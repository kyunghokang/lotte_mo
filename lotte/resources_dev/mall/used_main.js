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

    app.controller('UsedMainCtrl', ['$http', '$scope', 'LotteCommon','$window','LotteStorage','$timeout','commInitData','$location','LotteGA', function($http, $scope, LotteCommon,$window,LotteStorage,$timeout,commInitData,$location,LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "#중고라운지"; // 서브헤더 타이틀
        $scope.screenID = "중고라운지"; // 스크린 아이디 
        $scope.pageLoading = true;
        $scope.photo_width = 290;
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
                isTab : false,
                dispNo : commInitData.query["dispNo"],
                subCateName : '전체',
        		page: 0,
        		pageSize: 20,
        		pageEnd: false,
                data : null,
                storedLoc : null,
                storedScrollY : 0,
                myList : 'N', 
                keyword : "",
                ctgDispNo : commInitData.query["ctgDispNo"]
        	}             
        })();
        if($scope.screenData.dispNo == undefined){
            $scope.screenData.dispNo = '5618795';
        }
        if($scope.screenData.ctgDispNo == undefined){
            $scope.screenData.ctgDispNo = '';
        }
        
        //이미지 크게보기 
        $scope.popOption = {
            open : false,
            data : "",
            cnt : 0,
            close : function(){
                $scope.popOption.open = false;
            },
            show : function(){
                $scope.popOption.open = true;
            },
            next : function(){
                $scope.popOption.cnt ++;
                if($scope.popOption.cnt > $scope.popOption.length - 1)$scope.popOption.cnt = 0;
            },
            prev : function(){
                $scope.popOption.cnt --;
                if($scope.popOption.cnt < 0)$scope.popOption.cnt = $scope.popOption.length - 1;
            }
        }        
        $scope.use_pop_show = false;
        $scope.showInfoPop = function(){
            $scope.gatag(0, "책임 고지 안내");
            location.href = "/mall/board/board_info.do?" + $scope.baseParam;
            //$scope.use_pop_show = true;
        }
        //태블릿을 경우 이미지영역 계산      
        var wwd = angular.element($window).width();
        function resizePhoto(){            
            if(wwd >= 768){
                $scope.screenData.isTab = true; 
            }else{
                $scope.screenData.isTab = false; 
            }
            $scope.photo_con_width = (wwd - 32)/2 - 8; 
            if(wwd < 1024){
                $scope.photo_width = 290;
            }else{
                $scope.photo_width = 400;
            }            
        }
        $scope.log = "v.0.002";
        /*
        angular.element($window).on("orientationchange", function(){
            if(wwd != angular.element($window).width()){
                wwd = angular.element($window).width();
                $scope.log = wwd;
                resizePhoto();                
            }                        
        });
        */
        angular.element($window).on("resize.used", function(e) {
            if(wwd != angular.element($window).width()){
                wwd = angular.element($window).width();
                resizePhoto();                
            }            
        });
        resizePhoto();
        //페이지 unload 시 세션에 저장 
        /*
        angular.element($window).on("unload", function(e) {
            $scope.screenData.storedLoc = $location.absUrl();    
            $scope.screenData.storedScrollY = angular.element($window).scrollTop();                
            LotteStorage.setSessionStorage('used_mall', $scope.screenData, 'json');
        });
        */
        //카테고리
        $scope.selectCate = function(dispNo, dispNm, index){
            //$scope.screenDataReset();
            $scope.screenData.page = 0;
            resizePhoto();
            $scope.screenData.ctgDispNo = dispNo;
            $scope.screenData.subCateName = dispNm;            
            $scope.gatag(1, '', index);            
            $scope.loadData();
        }
        //검색 
        $scope.selectSearch = function(gubun){
            if(gubun == "search"){
                if($scope.screenData.keyword == '' || $scope.screenData.keyword == undefined || $scope.screenData.keyword.length <= 1){
                    alert("검색어를 입력하세요");
                    return;
                }
            }
            var kw = $scope.screenData.keyword;
            //$scope.screenDataReset();
            $scope.screenData.page = 0;
            $scope.screenData.keyword = kw;
            //console.log($("#my_csh")[0].checked);
            if($scope.screenData.data.mbrCertYn == 'Y'){
                $("#my_csh")[0].checked ? $scope.screenData.myList = "Y":$scope.screenData.myList = "N";
            }
            $scope.loadData();
        }
        
        //데이타 로딩         
        $scope.loadData = function(){
            if(!$scope.screenData.pageEnd || $scope.screenData.page == 0){
                $scope.pageLoading = true;
                $scope.screenData.page ++;            

                $.ajax({
                  type: "POST",
                  url: LotteCommon.used_main,
                  dataType: "json",
                  data: {
                        dispNo : $scope.screenData.dispNo,
                        ctgDispNo : $scope.screenData.ctgDispNo,
                        page : $scope.screenData.page,
                        myBoard : $scope.screenData.myList,
                        sort : $scope.screenData.keyword,
                        mbrNo : $scope.loginInfo.mbrNo
                    },
                  success: function (data) {
                        if($scope.screenData.page == 1){
                            //console.log("----", $scope.screenData.data);
                            if($scope.screenData.data){                                
                                $scope.screenData.data.boardListInfo = data.board_main.boardListInfo;    
                            }else{
                                $scope.screenData.data = data.board_main;    
                            }
                            
                        }else{
                            if(data.board_main.boardListInfo == null){
                               $scope.screenData.pageEnd = true;
                            }else{
                                $scope.screenData.data.boardListInfo.boardList.items = $scope.screenData.data.boardListInfo.boardList.items.concat(data.board_main.boardListInfo.boardList.items);
                            }
                        }                
                        if(data.board_main.boardListInfo != null){
                            if($scope.screenData.data.boardListInfo.boardList.items.length == $scope.screenData.data.boardListInfo.maxCount){
                                $scope.screenData.pageEnd = true;
                            }
                        }
                        $scope.pageLoading = false;
                        $scope.reflash();
                    }                  
                });
            }
        }

        $timeout(function(){
            $scope.loadData();    
        }, 100);        
        
        var $win = angular.element($window),
        $body = angular.element("body"),
        winH = $win.height();        
        angular.element($window).on("scroll", function(e){            
            //console.log($(".topbann").height() + 10);
            if($scope.screenData.data && $scope.screenData.data.mbrCertYn == 'Y' && $(".cate_box")){
                if($win.scrollTop() >= $(".cate_box").offset().top - 155){
                    $(".addbtn_box").addClass("fix");
                    $(".cate_box").addClass("fix");                
                }else{
                    $(".addbtn_box").removeClass("fix");
                    $(".cate_box").removeClass("fix");
                }                
            }
            
            if ($scope.screenData.pageEnd || $scope.pageLoading) {                
                return ;
            }
            if($("#footer").offset().top < $win.scrollTop() + winH) {
                 //console.log("-------------- scroll load", $scope.screenData.page);
                 $scope.loadData();
            }
        });
        
        //사진 전체보기 
        $scope.viewPhoto = function(list, index){
            $scope.gatag(2, '이미지_', index + 1); 
            $scope.popOption.cnt = index;
            $scope.popOption.data = list;
            $scope.popOption.show();
        }
        //댓글 조회         
        $scope.loadReply = function(item){
            //if(item.reply_list){
            //    item.more = true;
            //}else{
                var httpConfig = {
                    method: "get",
                    url: LotteCommon.used_reply_list,
                    params: {
                        bbcNo : item.bbcNo
                    }
                };
                $http(httpConfig) // 실제 탭 데이터 호출
                .success(function (data) {
                    item.reply_list = [];
                    setTimeout(function(){
                        item.reply_list = data.reply_info.items;  
                        item.rplCnt = data.reponse_cnt;
                        item.more = true;
                        $scope.reflash();                         
                    },100);
                    //console.log(data.reply_info.item, item.bbcNo);
                }).error(function(e){
                    console.log(e);
                });                
            //}
        }        
        //댓글,답글 등록, 수정 
        $scope.reply_write = function(item, rpl, mod){
            if($scope.used_logincheck()){
                
                var cont = "";
                var secret = "";
                var NO = null;
                var UPNO = null;
                if(rpl == null){ //댓글 등록하기 
                    if($scope.check_balcklist()){
                        return;
                    }
                    cont = item.insstr;
                    secret = item.inscheck ? "Y":"N";
                }else{ 
                    if(mod == "edit"){ //댓글, 답글 수정하기 
                        cont = rpl.rplCont;
                        NO = rpl.rplNo;
                        UPNO = rpl.uprRplNo;                    
                    }else{ //답글 등록하기 
                        //답글 등록하기 
                        cont = rpl.insstr; 
                        UPNO = rpl.rplNo;                    
                    }
                }   

                if(cont == undefined || cont == ""){                
                    alert("내용을 입력하세요");
                    return;
                }

                $.ajax({
                  type: "POST",
                  url: LotteCommon.used_reply_write,
                  dataType: "json",
                  data: {
                        bbcNo : item.bbcNo,
                        uprRplNo : UPNO, 
                        rplNo : NO,
                        scrtRplUseYn : secret,
                        rplCont : cont,
                        mod_flag : mod
                    },
                  success: function (data) {
                        alert(data.reply_write.response_msg);
                        if(data.reply_write.response_code == '0000'){                    
                            //댓글 새로 불러오기 
                            $scope.loadReply(item); 
                            item.insstr = "";
                            if(rpl) rpl.insstr = "";
                            item.inscheck = false;
                        }
                    }                  
                });                   
            }
        
        }
        //댓글 삭제 
        $scope.reply_delete = function(rplNo, item, rplDpthNo){
            console.log("delete :", rplNo);
            if(confirm("해당 글을 삭제하시겠습니까?")){
                $.ajax({
                  type: "POST",
                  url: LotteCommon.used_reply_delete,
                  dataType: "json",
                  data: {
                        bbcNo : item.bbcNo,
                        rplNo : rplNo,
                        dpthNo : rplDpthNo
                  },
                  success: function (data) {
                        alert(data.reply_delete.response_msg);
                        if(data.reply_delete.response_code == '0000'){                    
                            //댓글 새로 불러오기 
                            $scope.loadReply(item); 
                        }
                  }                  
                });                  
            }
        }
        //글 삭제 
        $scope.board_delete = function(item, index){
            if(confirm("해당 판매 글을 삭제하시겠습니까?")){
                $.ajax({
                  type: "POST",
                  url: LotteCommon.used_delete,
                  dataType: "json",
                  data: {
                      mbrNo : $scope.loginInfo.mbrNo,
                      bbcNo : item.bbcNo
                  },
                  success: function (data) {
                    data = data.board_delete;
                    if(data.response_msg){
                        alert(data.response_msg);
                    }                          
                    if(data.response_code == '0000'){    
                         $scope.screenData.data.boardListInfo.boardList.items.splice(index, 1);                                                
                    }
                  }                  
                });                 
            }
        }   
        $scope.call = function(num){
            if($scope.screenData.data.mbrCertYn != 'Y' || !$scope.loginInfo.isLogin){
                $scope.used_gotoLogin();
            }else{
                location.href = "tel:" + $scope.base64Decode(num);
            }
        }
        $scope.used_gotoLogin = function(){
            if(confirm("L.point 로그인 회원만 이용 가능합니다. \n로그인하시겠습니까?")){
                var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
                $window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targUrl;                        
            }                            
        }
        //글 등록, 수정 
        $scope.board_edit = function(item){
            if(!$scope.used_logincheck("로그인 후 이용하세요")){
                return;
            }            
            if($scope.screenData.data.mbrCertYn != 'Y'){                
                //alert("");
                $scope.used_gotoLogin();
                return;
            }  
                        
            var modparam = "";
            if(item != null){
                modparam = "mode=edit&";
                item.cellNo = $scope.base64Decode(item.cellNo);
                var _str = item.bbcCont;
                 _str = _str.replace(/(<br>)/gi, '\r\n');  // <br> -> 엔터
                 _str = _str.replace(/(<br\/>)/gi, ''); // <br/> -> 엔터
                item.bbcCont = _str;                
            }else{
                if($scope.check_balcklist()){
                    return;
                }
            }                        
            //선택한 아이템을 세션에 저장 
            var data = {
                user_cellNo : $scope.screenData.data.user_cellNo,
                ctgList : $scope.screenData.data.ctgList.items,
                item : item
            }
            LotteStorage.setSessionStorage('used_mall_edit_item', data, 'json');                  
            
            $scope.gatag(0, "판매글 등록하기");
            $timeout(function(){
                location.href = LotteCommon.used_write_link +"?" + modparam + $scope.baseParam;
            }, 100);
                
        }
        //추천
        $scope.recommend = function(item){
            if($scope.used_logincheck()){
                if(item.modYn == 'Y'){
                    alert("본인이 작성한 글은 찜 할 수 없습니다");
                    return;
                }
                $.ajax({
                  type: "POST",
                  url: LotteCommon.used_recommend,
                  dataType: "json",
                  data: {
                    tgtNo : item.bbcNo,
                    tgtTpCd : '10'
                  },
                  success: function (data) {
                    data = data.data;
                    if(data.response_code == '0000'){                         
                        item.recommCnt = data.response_cnt;
                        item.recommYn = 'Y';
                    }else{
                        alert(data.response_msg);  
                    }  
                  }                  
                });                                           
            }
        }
        
        //신고 
        $scope.dclpop = {
            open : false,
            type : 1,
            cont : "",
            item: null,
            rpl : null,
            list : []
        }
        //신고문구
        var dcl_str1 = [
            "판매 불가 상품 게재(담배, 주류, 장물 등)",
            "음란, 욕설 등 부적절한 내용",
            "상업적 판매 목적",
            "중고 게시판의 취지에 어긋남",
            "이미지 도용",
            "게시글 도배"
        ];
        var dcl1_code = ["10", "11", "12", "13", "14", "15"];
        var dcl_str2 = [
            "음란, 욕설 등 부적절한 내용",
            "상업적 홍보 및 과대선전",
            "허위 정보 제공",
            "개인 정보 요구",
            "댓글 도배"
        ];
        var dcl2_code = ["20", "21", "22", "23", "24"];        
        $scope.open_dcl = function(type, item, rpl, rpl_type){
            if($scope.used_logincheck()){
                if(type == 1 && item.modYn == 'Y'){
                    alert("본인이 작성한 글은 신고 할 수 없습니다");
                    return;                    
                }
                if((type == 1 && item.dclYn == 'Y') || (type == 2 && rpl.declareYn == 'Y')){
                    alert("이미 신고하셨습니다");
                    return;                    
                }
                
                $scope.dclpop.list = [];
                if(type == 2){
                    $scope.dclpop.rpl = rpl;
                    $scope.dclpop.list = dcl_str2;
                }else{
                    $scope.dclpop.list = dcl_str1;
                }                
                $scope.dclpop.cont = "";
                $scope.dclpop.type = type;
                $scope.dclpop.open = true;            
                $scope.dclpop.item = item;
                if(rpl_type){
                    $scope.dclpop.rpl_type = rpl_type;
                }
            }
        }
        $scope.close_dcl = function(){
            $scope.dclpop.open = false;            
        }
        $scope.dcl_submit = function(){
            if($scope.dclpop.cont == ""){
                alert("신고 사유를 선택 후 신고해주세요");
            }else{
                if($scope.dclpop.type == 1){
                    $.ajax({
                      type: "POST",
                      url: LotteCommon.used_declare,
                      dataType: "json",
                      data: {
                            tgtNo : $scope.dclpop.item.bbcNo,
                            tgtTpCd : '10',
                            cont : dcl1_code[$scope.dclpop.cont]
                      },
                      success: function (data) {
                        data = data.data;
                        if(data.response_msg){
                            alert(data.response_msg);    
                        }                          
                        if(data.response_code == '0000'){                    
                            $scope.dclpop.item.dclCnt = data.response_cnt;
                            $scope.dclpop.item.dclYn = 'Y';
                        }
                        $scope.close_dcl();  
                      }                  
                    });                                     
                }else{
                    $.ajax({
                      type: "POST",
                      url: LotteCommon.used_declare2,
                      dataType: "json",
                      data: {
                            tgtNo : $scope.dclpop.item.bbcNo,
                            tgtTpCd : $scope.dclpop.rpl_type,
                            cont : dcl2_code[$scope.dclpop.cont],
                            rplNo : $scope.dclpop.rpl.rplNo,                          
                            dpthNo: $scope.dclpop.rpl.rplDpthNo
                      },
                      success: function (data) {
                        data = data.data;
                        if(data.response_msg){
                            alert(data.response_msg);    
                        }                            
                        if(data.response_code == '0000'){                    
                            $scope.dclpop.rpl.declareNum = data.response_cnt;
                            $scope.dclpop.rpl.declareYn = 'Y';
                        }
                        $scope.close_dcl();  
                      }                  
                    });                 
                    
                }
            }
            //console.log($scope.dclpop.cont);

        }
        $scope.used_logincheck = function(str){ 
            var flag = true;
            if(!$scope.loginInfo.isLogin){
                if(str){
                    alert(str);
                }else{
                    alert("로그인 후 참여하실 수 있습니다.");
                }
				var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targUrl;
                flag = false;
            }
            return flag;
        }
        $scope.reply_focus = function(){
            //console.log("------- 댓글 작성시 로그인 체크");
            if($scope.used_logincheck()){
                $scope.check_balcklist();
            }
        }
        $scope.check_balcklist = function(){
            var flag = false;
            if($scope.screenData.data.board_blacklist != undefined && $scope.screenData.data.board_blacklist != null && $scope.screenData.data.board_blacklist != ""){
                alert("고객님께서 작성한 글이 일주일간 5번 이상 신고되어\n"+$scope.screenID+" 이용이 한 달간 제한되었습니다.\n" + $scope.screenData.data.board_blacklist +" 부터 이용하실 수 있습니다.");
                flag = true;
            }                            
            return flag;
        }
        $scope.scroll_reply = function(id){
            $(window).scrollTop($("#unit_" + id).offset().top);// - 150
        }
        $scope.reflash = function(){
            $(window).scrollTop($(window).scrollTop() - 1);            
        }
        //그만 보기 
        $scope.usedPopOpen = false;
        if(!LotteStorage.getLocalStorage("usedMall_popup")){
            $scope.usedPopOpen = true;
        }                
        $scope.close_usedNoMore = function(){
            $scope.usedPopOpen = false;
            LotteStorage.setLocalStorage("usedMall_popup", $scope.getTodayDate());
        }
        
        //GA태그 
        $scope.gatag = function(type, label, index){            
            var gaGroupNm = ["타이틀 영역", $scope.screenData.subCateName, $scope.screenData.subCateName + "_상품"];
            if(index){
                if(index < 10){
                    label = label + "0" + index;
                }else{
                    label = label + "" + index;
                }
            }
            LotteGA.evtTag("MO_" + $scope.screenID, gaGroupNm[type], label, "", "");
        }
        $scope.base64Decode = function(str) {
            var enc64List, dec64List;
            enc64List = new Array();
            dec64List = new Array();
            var i;
            for (i = 0; i < 26; i++) {
                enc64List[enc64List.length] = String.fromCharCode(65 + i);
            }7
            for (i = 0; i < 26; i++) {
                enc64List[enc64List.length] = String.fromCharCode(97 + i);
            }
            for (i = 0; i < 10; i++) {
                enc64List[enc64List.length] = String.fromCharCode(48 + i);
            }
            enc64List[enc64List.length] = "+";
            enc64List[enc64List.length] = "/";
            for (i = 0; i < 128; i++) {
                dec64List[dec64List.length] = -1;
            }
            for (i = 0; i < 64; i++) {
                dec64List[enc64List[i].charCodeAt(0)] = i;
            }

            var c=0, d=0, e=0, f=0, i=0, n=0;
            var input = str.split("");
            var output = "";
            var ptr = 0;
            do {
                f = input[ptr++].charCodeAt(0);
                i = dec64List[f];
                if ( f >= 0 && f < 128 && i != -1 ) {
                    if ( n % 4 == 0 ) {
                        c = i << 2;
                    } else if ( n % 4 == 1 ) {
                        c = c | ( i >> 4 );
                        d = ( i & 0x0000000F ) << 4;
                    } else if ( n % 4 == 2 ) {
                        d = d | ( i >> 2 );
                        e = ( i & 0x00000003 ) << 6;
                    } else {
                        e = e | i;
                    }
                    n++;
                    if ( n % 4 == 0 ) {
                        output += String.fromCharCode(c) + 
                                  String.fromCharCode(d) + 
                                  String.fromCharCode(e);
                    }
                }
            }
            while (typeof input[ptr] != "undefined");
            output += (n % 4 == 3) ? String.fromCharCode(c) + String.fromCharCode(d) : 
                      ((n % 4 == 2) ? String.fromCharCode(c) : "");
            return output;
        }


    }]);
	app.filter('base64Decode', [function () {
		return function (str) {  
            return getScope().base64Decode(str);
		}
	}]);       
	app.filter('cutDate', [function () {
		return function (str) {  
            return str.substr(0, 10);
		}
	}]);       
    
    // 스크립트로 화면 안넘어가게 이미지 사이즈 조정 할 경우
    app.directive('orientable', function () {
	    return {
	        link: function($scope, element, attrs) {
	            element.bind("load" , function(e){
	            	$scope.imageSize = { width:this.width, height:this.height };
	            });
	        }
	    }
	});
    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/used_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);