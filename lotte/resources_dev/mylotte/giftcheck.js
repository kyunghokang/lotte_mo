(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'addressInfo'
    ]);

    app.controller('giftcheckCtrl', ['$scope', 'LotteCommon','$http','commInitData', function($scope, LotteCommon,$http,commInitData) {
        $scope.loading = false;
        $scope.state = 0; //0 일반, 1 거절, 2 이미 취소,거절 
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "선물 확인"; //서브헤더 타이틀
        $scope.order_no = commInitData.query["orderNo"];
        $scope.key = decodeURI(commInitData.query["key"]);
        $scope.test = decodeURI(commInitData.query["test"]);
        $scope.presentListUrl =  LotteCommon.presentListUrl +'?'+baseParam; //선물함 경로
        $scope.presentShop = LotteCommon.mainUrl +'?'+baseParam+'&dispNo=5556743'; //선물매장으로가기
        //앱다운로드 배너 
        $scope.appBanner = null;
        $http.get(LotteCommon.mainPopupData, {params:{}})
        .success(function(data) {
            $scope.appBanner = data.app_down_popup[0];
        });        
        
        $scope.load = function(){
            var reqParam = {
                orderNo :  $scope.order_no,
                KEY : $scope.key,
                mbr_no : $scope.loginInfo.mbrNo
            };
            //basic data
            $http({url: LotteCommon.giftCheckUrl,
                data: $.param(reqParam),
                method: 'POST',
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
                }).success(function(data) {
                    $scope.giftData = data;
                    /*gift_state
                    0 : 기본
                    1 : 배송지정보 x -> 선물함으로 이동
                    2 : 주문취소 -> 거절화면으로 이동
                    3 : 거절 -> 거절화면으로 이
                    */
                    //test code
                    if($scope.test == "0"){
                        $scope.giftData.gift_state = 0;
                    }
                
                    if($scope.giftData.gift_state == "1"){
                        //선물함으로 이동
                        location.href =  $scope.presentListUrl;
                    }else if($scope.giftData.gift_state == "2" || $scope.giftData.gift_state == "3"){
                            $scope.state = 2;
                            $scope.subTitle = "선물 확인 완료";                            
                            $scope.checkGiftPage = true; //선물확인 -> 확인 완료(true)
                            $scope.getGoodsList();                          
                    }else if($scope.giftData.gift_state == "4"){ //20160907 add case
                            $scope.state = 4;
                            $scope.subTitle = "선물 확인";                            
                            $scope.checkGiftPage = true; //선물확인 -> 확인 완료(true)
                            $scope.getGoodsList();                          
                    }else if($scope.giftData.gift_state == undefined){
                        console.log("데이타 로드 실패");
                        return;
                    }else{
                        $scope.loading = true; //선물확인 페이지 로딩
                    }
                
                    if($scope.giftData.gift_msg_info.msg != undefined){
                        $scope.giftData.gift_msg_info.msg = $scope.giftData.gift_msg_info.msg.replace(/\n/g, "<br />");
                    }
                    //로그인한 상태에서 사용자가 입력한 배송지가 없으면
                    if($scope.loginInfo.isLogin && $scope.giftData.user_addr_info != undefined){
                        $scope.myAddr_tab = true;
                    }
                
                    if($scope.giftData.gift_msg_info.bg_color == undefined){
                        $scope.giftData.gift_msg_info.bg_color = "#ffffff";
                    }
                    //옵션 수량 관련 체크 하여 품절인것만 모음 ========== 옵션 품절 처리 ==============
                    $scope.zeroOpt = [];
                    if($scope.giftData.gift_prd_info.opt_item_lst != undefined){
                        var optlist = $scope.giftData.gift_prd_info.opt_item_lst;
                        if(optlist.length > 1){
                            for(var i=0; i< optlist.length; i++){
                                //if(optlist[i].inv_qty == 0){
                                    $scope.zeroOpt.push(optlist[i].opt_tval.split(" x "));
                                //}
                            }
                        }                           
                    }
                    //console.log($scope.zeroOpt);
                    //$scope.loginInfo.isLogin = true;
                    
                    // 배송불가지역 확인 추가
					$scope.giftData.orderNo = $scope.order_no;
					$scope.giftData.ordDtlSn = $scope.giftData.gift_prd_info.ord_dtl_sn;
                
                    //$scope.giftData.ord_addr_info 정보가 있으면 새로운 배송지에 그 내용을 입력 20161125                    
                    if($scope.giftData.ord_addr_info != undefined && $scope.giftData.ord_addr_info != null && $scope.giftData.ord_addr_info.addr_post != undefined){   
                        $scope.myAddrChange(false);
                    }                    
					
                }).error(function () {});
            

        }
        setTimeout(function(){
            $scope.load();    
        }, 500);
        
    }]);

    app.directive('lotteContainer', ['LotteCommon','$http','LotteLink', function(LotteCommon, $http, LotteLink) {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/giftcheck_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                //appdown
                $scope.gotoApp = function(){
                    LotteLink.appDeepLink("lotte", "http://m.lotte.com", null, null); // 앱 딥링크 params : lotte/ellotte, 딥링크URL (없을 경우 default 현재 URL, tclick, referrer)
                }
                
                $scope.checkGiftPage = false; //선물확인 -> 확인 완료(true)
                //선물확인, 거절
                $scope.confirm_submit = function(flag){
                    //submit
                    var reqParam = {
                        order_no :  $scope.order_no,
                        key : $scope.key,
                        ordDtlSn : $scope.giftData.gift_prd_info.ord_dtl_sn,
                        addr1:"",
                        addr2:"",
                        addr_name:"",
                        addr_post:"",
                        addr_tel:"",
                        password:"",
                        r_name:"",
                        message:"",
                        dlvp_sn : ""
                    };                    
                    if(flag){//받기
                        //data check    
                        reqParam = $scope.getlastAddress(); //배송정보
                        if(reqParam.message == undefined){
                            return;
                        } 
                        //console.log(reqParam);
                        if($scope.checkField("비밀번호를", "#pass1") ||
                            $scope.checkField("비밀번호를", "#pass2")){
                            return;
                        }
                        if($("#pass1").val() != $("#pass2").val()){
                            alert("비밀번호가 일치하지 않습니다.");
                            $("#pass2").val("");
                            $("#pass2").focus();
                            return;
                        }
                        if($("#agreeInfoCheck:checked").length == 0){
                            alert("선물 수령을 위한 정보제공에 대하여 동의해주세요.");
                            return;                            
                        }
                        reqParam.ordDtlSn = $scope.giftData.gift_prd_info.ord_dtl_sn;
                        reqParam.order_no = $scope.order_no;
                        reqParam.key = $scope.key;
                        reqParam.password = $("#pass1").val();
                        reqParam.reject_msg = "";
                    }else{ //거절 이후 화면                         
                        if($("#refuse_message").val() == ''){
                            alert("거절 메시지를 선택해주세요.");
                            return;
                        }                        
                        reqParam.reject_msg = $("#refuse_message").val();
                        $scope.state = 2;
                    }
                    $http.get(LotteCommon.confirm_gift, {params:reqParam})
                        .success(function(data) {
                            if(data.result.result_code == "0000"){                                
                                $(window).scrollTop(0);
                                $scope.subTitle = "선물 확인 완료";
                                $scope.checkGiftPage = true; //선물확인 -> 확인 완료(true)
                                $scope.getGoodsList();
                            }else{
                                // 조회 실패
                            	if(data.result != undefined){
	                                var err_msg = data.result.error_msg;
	                                if(err_msg == undefined || err_msg == ""){
	                                	err_msg = "선물 확인 중 에러가 발생했습니다.";
	                                }
	                                alert(err_msg);
	                                console.log(data.result.result_code, data.result.error_msg);
                            	}
                                if(!flag){
                                    location.reload();//거절이면 리로드
                                }
                            }

                        }).error(function (data) {
                            console.log(data.result.result_code, data.result.error_msg);
                            if(data.result.result_code == "ETC"){
                                location.reload();
                            }
                    });
                }                
                //받기 완료 후 이거어때 리스트 호출 
                
                $scope.getGoodsList = function(){
                    $http.get(LotteCommon.gift_epilogue, {params:null})
                        .success(function(data) {
                            $scope.recom_prd_lst = data.recom_prd_lst;
                        }).error(function () {
                    });                                        
                }
                
                //선물 거절 layer ==============================
                $scope.refuseLayerFlag = false;
                $scope.refuse_rLayer = function(flag){
                    if(flag){
                        $(window).scrollTop(0);
                    }                    
                    $scope.refuseLayerFlag = flag;
                }

                //옵션 변경 ===============================
                $scope.optFlag = false; //옵션변경창
                $scope.changeOpt = function(){
                    $scope.optFlag = !$scope.optFlag;
                    if($scope.optFlag){
                        $scope.initOptCheck() ; //첫번째 옵션 초기화 = 옵션 품절 처리 ==
                    }
                        
                }
                
                $scope.getOptionString = function(){
                    var opts = [];
                    var sel;
                    var len = $scope.giftData.gift_prd_info.opt_list.length;
                    for(var i=0; i<len; i++){
                        sel = $("#prod_option_" + i);                        
                        opts.push(sel.val());//0721 수정
                    }
                    return opts.join(" x ");
                }     
                $scope.saveOpt = function(){
                    if($scope.giftData.gift_prd_info.opt_item_lst == undefined){ return; }

                    var opt = $scope.getOptionString();
                    var no = -1;
                    var arr = $scope.giftData.gift_prd_info.opt_item_lst;
                    var len = arr.length;
                    var item;

                    var optvalue = ""; 
                    var old_no = "";
                    var item_qty = 0;
                    for(var i=0; i<$scope.giftData.gift_prd_info.opt_list.length; i++){
                        if(i > 0){
                            optvalue += " x ";
                        }
                        optvalue += $scope.giftData.gift_prd_info.selected_opt[i].opt_value;//0721 수정
                    }
                    
                    for(i=0; i<len; i++){
                        item = arr[i];
                        if(item.opt_tval == opt){ //0721 수정
                            no = item.item_no;
                            item_qty = item.inv_qty;
                        }
                        if(item.opt_tval == optvalue){//0721 수정
                            old_no = item.item_no;
                        }
                    }
                    if(old_no == no){
                        alert("동일한 옵션을 선택하셨습니다.");
                        return;
                    }                    
                    
                    if(item_qty == 0){
                        alert("재고 수량이 부족합니다.");
                        return;
                    }                    
                    
                    if(no < 0){ return; }

                    var path = LotteCommon.presentDetailOption;
                    var param = {
                        ord_no		:$scope.order_no,
                        ord_dtl_sn	:$scope.giftData.gift_prd_info.ord_dtl_sn,
                        goods_no	:$scope.giftData.gift_prd_info.goods_no,
                        item_no		:old_no,
                        chg_item_no	: no,
                        rel_qty		: $scope.giftData.gift_prd_info.rel_qty                        
                    };
                    //원주문 번호, 원주문일련번호, 상품번호, 변경 된 단품번호
                    
                    //$scope.UIStatus.isDataLoading = true;
                    $http.get(path, {params:param})
                    .success(function(data){                        
                        //$scope.UIStatus.isDataLoading = false;
                        if(data.result_code == "0000"){
                            alert("저장하였습니다.");
                            $scope.optFlag = false;
                            //변경한 정보로 갱신
                            for(var i=0; i<$scope.giftData.gift_prd_info.selected_opt.length; i++){
                                $scope.giftData.gift_prd_info.selected_opt[i].opt_value =  $("#prod_option_" + i).val();
                            }
                            $scope.giftData.gift_prd_info.ord_dtl_sn = data.ord_dtl_sn;
                        }else{
                            // 조회 실패
                            var err_msg = data.error_msg;
                            if(err_msg == undefined || err_msg == ""){
                                err_msg = "변경 사항을 저장하지 못했습니다.";
                            }
                            alert(err_msg);
                        }
                    })
                    .error(function(){
                        console.log('Data Error : 옵션 변경');
                        //$scope.UIStatus.isDataLoading = false;
                    });
                };        
                
                //상품 기술서 팝업 =================
                $scope.productDetailPop = false; //product detail popup 
                $scope.detailHtml = "";                
                $scope.ProductDetailLayer = function(){ //open
                    var reqParam = {
                        goods_no : $scope.giftData.gift_prd_info.goods_no
                    };                    
                    $http.get(LotteCommon.productProductDetailHtmlData, {params:reqParam})
                        .success(function(result) {
                            var data = result.max;
                            data = $scope.replaceAll(data,'\\"', '"');
                            data = $scope.replaceAll(data,"&#34;", "'");
                            $scope.detailHtml = $scope.replaceAll(data,"\r\n", "");
                            $scope.productDetailPop = true;
                        }).error(function () {

                    });                    
                    
                }                
                $scope.closeProductDetailLayer = function(){ //close
                    $scope.productDetailPop = false;
                }
                $scope.replaceAll = function (str, searchStr, replaceStr) {
                    if (str != undefined && str != null && str != "") {
                        str = str.split(searchStr).join(replaceStr);
                    }
                    return str;
                };
                //상품 기술서 팝업 =================   
                
                //링크 이동 
                $scope.gotoLink = function(item, index){
                    var tclick = "&tclick=m_DC_SrhResult_Clk_Prd_idx" + (index + 1);
                    /*
                    index = index + 1;
                    if(index < 10){
                        tclick = tclick + "0" + index;
                    }else{
                        tclick = tclick + index;
                    }
                    */
                    window.location.href =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + tclick;     
                };  
                
                
                 //옵션 선택시 품절상품인 것 찾아서 안보이게 처리 ======================= 옵션 품절 처리 ==========================
                $scope.initOptCheck = function(){
                    var key = [0];
                    var optlist = $scope.giftData.gift_prd_info.opt_list;                    
                    for(var k = 0; k < optlist[0].opt_value_lst.length;k++){
                        key[0] = optlist[0].opt_value_lst[k];
                        if(optlist.length > 1){
                            if($scope.treecheck(key, 1, optlist)){    
                                $("#prod_option_0").find("option").eq(k+1).hide();
                            }    
                        }else{                            
                            if($scope.checkZero(key)){ //재고 0인 것이 있으면
                                $("#prod_option_0").find("option").eq(k+1).hide();
                            }    
                        }
                    }                     
                }
                
                $scope.checkOptCnt = function(index){
                    //초기화  : 선택한 옵션 밑으로 초기화              
                    var optlist = $scope.giftData.gift_prd_info.opt_list;
                    if(optlist.length > 1){
                        var key = [];                        
                        var checkTime = true; //선택한 하위 옵션 한개만 품절 설정하도록 함
                        var result;
                        for(var i=0; i< optlist.length; i++){
                            if(i > index){
                                $("#prod_option_" + i).find("option").show();
                                optlist[i].selectID = 0;
                                //하위 옵션 검색
                                //중간 옵션인 경우
                                if(i < optlist.length - 1){
                                    if(checkTime){
                                        //하위 옵션의 레벨만큼 루프돌면서 체크 
                                        //하위 옵션이 전체가 품절이어야 함.
                                        key.push(0);
                                        for(var k = 0; k < optlist[i].opt_value_lst.length;k++){
                                            key[i] = optlist[i].opt_value_lst[k];
                                            if($scope.treecheck(key, i + 1, optlist)){
                                                $("#prod_option_" + i).find("option").eq(k+1).hide();
                                            }    
                                        }                                                                             
                                        checkTime = false;
                                    }
                                }else{ //마지막 옵션인 경우
                                    if(checkTime){
                                        key.push(0);
                                        for(var k = 0; k < optlist[i].opt_value_lst.length;k++){
                                            key[i] = optlist[i].opt_value_lst[k];
                                            result = $scope.checkZero(key);
                                            //console.log(key[i], result);
                                            if(result){ //재고 0인 것이 있으면
                                                $("#prod_option_" + i).find("option").eq(k+1).hide();
                                            }    
                                        }                                         
                                    }
                                }                            
                            }else{                            
                                if(optlist[i].selectID == 0){
                                    //상위 옵션을 선택하지 않으면 그 밑으로 다시 초기화 
                                    for(; i< optlist.length; i++){
                                        optlist[i].selectID = 0;
                                    }
                                    break;    
                                }else{
                                    //상위옵션 저장
                                    key.push($("#prod_option_" + i).val());
                                }                            
                            }
                        }
                        
                    }
                }    
                $scope.treecheck = function(key, level, list){
                    var key2, j;
                    var rvalue = true;
                    //서브노드 검색
                    if(level < list.length - 1){ //마지막이 아니면                        
                        key2 = key.concat(0);
                        for(j = 0; j < list[level].opt_value_lst.length;j++){
                            key2[level] = list[level].opt_value_lst[j];
                            if(!$scope.treecheck(key2, level + 1, list)){ 
                                j = list[level].opt_value_lst.length;
                                rvalue = false;
                            }    
                        }
                    }else{ //마지막이면 
                        key2 = key.concat(0);
                        for(j = 0; j < list[level].opt_value_lst.length;j++){                            
                            key2[level] = list[level].opt_value_lst[j];
                            var result = $scope.checkZero(key2);
                            if(!result){ //재고 0이 아닌것이 있으면                                  
                                j = list[level].opt_value_lst.length;
                                rvalue = false;                                 
                            }                                    
                        }
                    }
                    return rvalue;
                }
                $scope.checkZero = function(obj){
                    var cnt = 0;
                    var return_value = true;
                    for(var i=0; i<$scope.zeroOpt.length; i++){
                        cnt = 0;                        
                        for(var i2=0; i2< $scope.zeroOpt[i].length; i2++){                            
                            if(obj[i2] == $scope.zeroOpt[i][i2]){
                                cnt ++;
                            }                           
                        }
                        if(cnt == $scope.zeroOpt[i].length){
                            i = $scope.zeroOpt.length;
                            return_value = false; //일치하는게 있으면                            
                        }
                    }
                    return return_value;;                    
                }
                
               if(!$scope.appObj.isApp){
                   $scope.appDownBann = true;
               }

               $scope.appDownBnrClose = function(){
                   $scope.appDownBann = false;
               }
                
            }
        };
    }]);
       
})(window, window.angular);
