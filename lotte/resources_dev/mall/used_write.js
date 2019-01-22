(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'ngPinchZoom'
    ]);

    app.controller('UsedWriteCtrl', ['$http', '$scope', 'LotteCommon','commInitData','$location','LotteStorage','$timeout','LotteGA', function($http, $scope, LotteCommon,commInitData,$location,LotteStorage,$timeout,LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "판매 글 등록하기"; // 서브헤더 타이틀
        $scope.screenID = "판매 등록하기"; // 스크린 아이디 
        $scope.AccessUpload = true;
        $scope.used_data = LotteStorage.getSessionStorage("used_mall_edit_item", 'json');            
        $scope.show_term = false;
        $scope.photoCount = 0;
        $scope.no_write = ""; //금칙어 포함 
        $scope.FILE_NUM = 5; //업로드 가능한 사진의 갯수 
        if($scope.used_data == null){ //직접 접속인 경우 
            location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
        }
        $scope.check_list = [false, false, false, false];
        $scope.phoneArr = ["", "", ""];
        $scope.rotateCode = new Array($scope.FILE_NUM);
        $scope.orgImgFileList = new Array($scope.FILE_NUM);
        $scope.scrmode = true; //등록모드       
        $scope.pageLoading = false;
        
        
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
        var submitURL = LotteCommon.used_write;
        if($scope.used_data.item == null){ //쓰기인 경우 초기화                         
            $scope.used_data.item = {
                 "bbcNo" : "", 
                 "loginId" : "",
                 "regDate" : "",
                 "dispNo"  : "",
                 "bbcTitNm":"",
                 "salePrc" : "",
                 "dlexInclusYn" : "",
                 "cellNo" : "",
                 "shaGoodsStatCd" : "",
                 "saleStatCd" : "10",
                 "dirTradePsbYn" : "",
                 "dirTradeRgnNm" : "",
                 "bbcCont" : "",
                 "rplCnt" : 0,
                 "recommCnt" : 0,
                 "dclCnt" :  0,
                 "modifyYn" : "Y",
                 "imgInfo" : []                 
            }
            if($scope.used_data.user_cellNo){
                $scope.used_data.item.cellNo = $scope.base64Decode($scope.used_data.user_cellNo);
                $scope.phoneArr = $scope.used_data.item.cellNo.split("-");
            }
            $scope.check_list[1] = false;
        }else{ // 수정인경우 
            $scope.subTitle = "판매 글 수정하기"; // 서브헤더 타이틀
            //체크박스:  배송비/개인정보공개동의/직거래 여부/이용약관/판매상태 
            $scope.check_list[1] = true;            
            $scope.check_list[0] = $scope.used_data.item.dlexInclusYn == "Y" ? true:false;            
            $scope.check_list[2] = $scope.used_data.item.dirTradePsbYn == "Y" ? true:false;
            //전화번호 
            $scope.phoneArr = $scope.base64Decode($scope.used_data.user_cellNo).split("-");
            
            submitURL = LotteCommon.used_rewrite;
            //이미지 데이터만 재조합 
            var imgArr = [];
            if($scope.used_data.item.imgList != null){
                var maxx = $scope.used_data.item.imgList.items.length;
                if(maxx > $scope.FILE_NUM) maxx = $scope.FILE_NUM;
                for(var i=0; i<maxx; i++){
                    imgArr.push($scope.used_data.item.imgList.items[i].imgUrl);
                    $scope.orgImgFileList[i] = $scope.used_data.item.imgList.items[i].imgUrl;
                }
            }
            $scope.used_data.item.imgInfo = imgArr;
            $scope.scrmode = false; //수정모드
        }
        
        //이미지 크게보기 
        $scope.popOption = {
            open : false,
            data : "",
            target : null,
            index : 0,
            close : function(){
                $scope.popOption.open = false;
            },
            show : function(str, tar, i){
                if(str != ''){
                    $scope.popOption.data = str;
                    $scope.popOption.open = true;
                    $scope.popOption.target = tar;
                    $scope.popOption.index = i;
                }
            }
        }
        
        //이미지 갯수 채우기 
        for(var i=$scope.used_data.item.imgInfo.length; i<$scope.FILE_NUM; i++){
            $scope.used_data.item.imgInfo.push("");
            $scope.orgImgFileList[i] = "";
        }
        var requestState = false;
        $scope.dataForm = {};
        //수정하기 
        $scope.submit_edit = function(){
            if(confirm("수정한 내용을 저장하시겠습니까?")){
                $scope.submit();    
            }            
        }
        $scope.submit = function(){
            //금칙어 체크 후에 전송
            $scope.check_word(function(){
                //데이타 체크 
                // 전송중에 클릭 방지
                if(requestState) return;                       
                //1 데이타 체크 
                if($scope.photoCount == 0){
                    alert("사진을 등록해주세요"); 
                    angular.element(window).scrollTop($("#pd1").position().top);
                    return;    
                }            
                if($scope.used_data.item.bbcTitNm == ""){                
                    alert("상품명을 입력해주세요");
                    angular.element(window).scrollTop($("#pd2").position().top);
                    return;
                }
                if($scope.used_data.item.dispNo == ""){ 
                    alert("카테고리를 입력해주세요.");
                    angular.element(window).scrollTop($("#pd3").position().top);
                    return;
                }
                if($scope.used_data.item.salePrc == "") {
                    alert("판매 금액을 입력해주세요") ;
                    angular.element(window).scrollTop($("#pd4").position().top);
                    return;
                }
                /*
                if($scope.phoneArr[0] == "" && $scope.phoneArr[1] == "" && $scope.phoneArr[2] == "") {                    
                    //alert("연락처를 입력해주세요") ;
                    //angular.element(window).scrollTop($("#pd5").position().top);
                    //return;
                }
                */
                if(!$scope.check_list[1]) {
                    alert("중고라운지 서비스 제공을 위해서 필요한 최소한의 개인정보 이므로 동의를 해 주셔야만 서비스를 이용하실 수 있습니다.") ;
                    angular.element(window).scrollTop($("#pd5").position().top);
                    return;
                }
                if($scope.used_data.item.shaGoodsStatCd == "") {
                    alert("상품 상태를 입력해주세요") ;
                    angular.element(window).scrollTop($("#pd6").position().top);
                    return;
                }
                if($scope.check_list[2]){
                    if($scope.used_data.item.dirTradeRgnNm == ""){
                        alert("직거래 가능지역을 입력해주세요") ;
                        angular.element(window).scrollTop($("#pd9").position().top);
                        return;                        
                    }
                }
                if($scope.scrmode && !$scope.check_list[3]) {
                    alert("판매등록 전 안내 내용을 확인하시고 동의해주세요") ;
                    return;
                }

                requestState = true; 
                $scope.pageLoading = true;
                $scope.onePhotoUpload(0); //사진 한장씩 올리기 
            });            
        }
        $scope.dataUpload = function(){
            //2 데이터 조합 
            $scope.dataForm = {
                 "bbcNo" : $scope.used_data.item.bbcNo, 
                 "dispNo"  : $scope.used_data.item.dispNo,
                 "bbcTitNm": $scope.used_data.item.bbcTitNm,
                 "salePrc" : $scope.used_data.item.salePrc,
                 "dlexInclusYn" : $scope.check_list[0] ? "Y" : "N",
                 "cellNo" : $scope.phoneArr[0] + "-" + $scope.phoneArr[1] + "-" + $scope.phoneArr[2],
                 "shaGoodsStatCd" : $scope.used_data.item.shaGoodsStatCd,
                 "cellNoOppbAgrYn" : $scope.check_list[1] ? "Y" : "N",
                 "dirTradePsbYn" : $scope.check_list[2] ? "Y" : "N",
                 "shaBbcRegAgrYn" : $scope.check_list[3] ? "Y" : "N",
                 "dirTradeRgnNm" : $scope.used_data.item.dirTradeRgnNm,
                 "bbcCont" : $scope.used_data.item.bbcCont,
                 "imgInfo" : $scope.used_data.item.imgInfo,
                 "saleStatCd" : $scope.used_data.item.saleStatCd
            }
            //3 전송 
            angular.element("#board_write").bind('submit', function(e) {
                var formData = new FormData();
                formData.append("mbrNo", $scope.loginInfo.mbrNo);
                formData.append("userId", $scope.loginInfo.loginId);
                formData.append("bbcNo", $scope.dataForm.bbcNo);
                formData.append("dispNo", $scope.dataForm.dispNo);
                formData.append("bbcTitNm", $scope.dataForm.bbcTitNm);
                formData.append("salePrc", $scope.dataForm.salePrc);
                formData.append("dlexInclusYn", $scope.dataForm.dlexInclusYn);
                formData.append("cellNo", $scope.dataForm.cellNo);
                formData.append("shaGoodsStatCd", $scope.dataForm.shaGoodsStatCd);                
                formData.append("cellNoOppbAgrYn", $scope.dataForm.cellNoOppbAgrYn);
                formData.append("dirTradePsbYn", $scope.dataForm.dirTradePsbYn);
                formData.append("shaBbcRegAgrYn", $scope.dataForm.shaBbcRegAgrYn);
                formData.append("dirTradeRgnNm", $scope.dataForm.dirTradeRgnNm);
                formData.append("bbcCont", $scope.dataForm.bbcCont);
                formData.append("saleStatCd", $scope.dataForm.saleStatCd);
                
                $.ajax({
                    url : submitURL,
                    type : "post",
                    data : formData,
                    enctype: 'multipart/form-data',
                    //timeout: 180000,
                    async : true,
                    cache : false,
                    contentType : false,
                    processData : false,
                    success: function(res){
                        $scope.pageLoading = false;
                        requestState = false;
                        angular.element("#board_write").unbind('submit');
                        alert("상품 등록이 완료되었습니다.");
                        location.href = LotteCommon.used_main_link + "?" + $scope.baseParam;
                    },
                    error : function( e ) {
                        alert("판매글이 등록되지 않았습니다. 다시 등록해주세요");
                        $scope.pageLoading = false;
                        requestState = false;
                        console.log("error:글 등록 오류 ", e.statusText);
                        angular.element("#board_write").unbind('submit');
                    }
                });
                e.preventDefault();
            });   
            $timeout(function(){
                angular.element("#board_write").submit();            
            }, 100);                
        }
        //사진 한장씩 올리기 
        $scope.onePhotoUpload = function(k){
            //3 전송 
            if(document.getElementById("pli_" + k).files[0] != undefined){ //선택한 사진이 있으면 업로드 
               angular.element("#photo_write").bind('submit', function(e) {                
                    var formData = new FormData();                
                    if($scope.used_data.item.bbcNo != ""){
                        formData.append("bbcNo", $scope.used_data.item.bbcNo);
                    }
                    formData.append("userId", $scope.loginInfo.loginId);
                    formData.append("imgFileList", document.getElementById("pli_" + k).files[0]);                            
                    formData.append("rotateCd", $scope.rotateCode[k]);                        
                    $.ajax({
                        url : "http://www.lotte.com/display/boardImgInsert.lotte", //LotteCommon.used_photoWrite,
                        type : "post",
                        data : formData,
                        enctype: 'multipart/form-data',
                        async : true,
                        cache : false,
                        contentType : false,
                        processData : false,
                        success: function(data){
                            console.log("one image upload :", data);
                            angular.element("#photo_write").unbind('submit');
                            if($scope.used_data.item.bbcNo == "" && data != "0"){
                                $scope.used_data.item.bbcNo = data; //데이타 구조 다시 맞춤                                 
                            }                           
                            $scope.next_step(k);
                        },
                        error : function( e ) {
                            alert("판매글이 등록되지 않았습니다. 다시 등록해주세요");
                            console.log("error:이미지 업로드 오류 ", e.statusText);             
                            angular.element("#photo_write").unbind('submit');
                            $scope.pageLoading = false;
                            requestState = false;                            
                        }
                    });
                    e.preventDefault();                                   
                });   
               $timeout(function(){
                    angular.element("#photo_write").submit();            
                }, 100);                  
            }else{                                        
                $scope.next_step(k);                   
            }             
        }
        $scope.next_step = function(k){
            k += 1;
            if(k < $scope.FILE_NUM){ //photo upload
                $scope.onePhotoUpload(k);
            }else{ //data submit
                $scope.dataUpload();
            }            
        }
        
        
        //--------------------- 사진 등록 관련 시작         
        var uploadSizeLimit = 5, //업로드 가능 용량 
            uploadVer = 292, // 안드로이드 사진업로드 버전
            tuploadVer = 217; // 안드로이드 사진업로드 버전 ( TStore )        
        if($scope.appObj.isApp && $scope.appObj.isAndroid) {
            if( ( !$scope.appObj.isSktApp && $scope.appObj.verNumber < uploadVer ) || ( $scope.appObj.isSktApp && $scope.appObj.verNumber < tuploadVer ) ) {
                    $scope.AccessUpload = false;
            };
        }        
        $scope.userVersionCheck = function(){
            if (confirm('롯데닷컴 앱 업데이트 후 이용 가능합니다. 지금 업데이트 하시겠습니까?')) {
                var appDownURL = "market://details?id=com.lotte";
                if( $scope.appObj.isSktApp ) appDownURL = "https://www.onestore.co.kr/userpoc/apps/view?pid=0000677011";
                location.href = appDownURL;
            }
        }        
        $scope.getOrientation = function(file, callback) {
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
        $scope.photoPreview = function( target ) {                        
            if(!$scope.AccessUpload) return;
            var file = target.files[0],
                i = angular.element(target).attr('index'),
                reader  = new FileReader(),
                max = uploadSizeLimit*1000*1000,// 서버에서 체크하는 방식과 맞춤
                imgcontainer = angular.element(target).parent().find('figure');

            imgcontainer.children().remove();
            //scope.dataForm[i].photo = null;
            $scope.rotateCode[i] = null;

            try{ $scope.$apply() }catch(e){};            
            if(!file||  file==undefined) return;            
            //imgcontainer.attr('class','');
            if(!checkExt(file.type)) {
                alert('jpg/png 파일만 업로드 가능합니다.');
                return;
            }

            if( file.size > max ) {
                alert( '사진 용량이 '+uploadSizeLimit+'MB 이상은 등록할 수 없습니다.\n' +uploadSizeLimit+'MB 이하로 등록해주세요.');
                return;
            }
            if(!$scope.click_photo){
                $scope.gatag('사진등록', '이미지_', parseInt(i) + 1);                 
            }else{
                $scope.click_photo = false;
            }
            if(i >= 4){
                $(".photo_con").scrollLeft(i*70);
            } 
            //loading(true);
            loadImage( file, function (img) {
                    try{ 
                        $scope.used_data.item.imgInfo[i] = img.toDataURL(); 
                        $scope.check_photoCount();
                    }catch(e) { 
                        imgcontainer.append( img ); 
                    }
                    try{ $scope.$apply() } catch(e) { };
                }, { maxWidth:800, minWidth:216, minHeight:216, cover:true, canvas: true } // Options
            );

            // 사진 돌아감 예외 처리 
            $scope.getOrientation(file, function(c) {                   
                $scope.rotateCode[i] = c;                
                try{ $scope.$apply() } catch(e) { };
            });           
        }
        function checkExt( fileType ){
            if( fileType == "image/jpeg" || fileType == "image/png" ) return true;
            return false;
        }   
        $scope.click_photo = false;
        $scope.addPhoto = function(){
            if($scope.photoCount < $scope.FILE_NUM){
                $scope.click_photo = true;
                $scope.gatag('사진등록','사진첨부');
                var ind = 0;
                for(var i=0; i<$scope.FILE_NUM; i++){
                    if($scope.used_data.item.imgInfo[i] == ''){
                        ind = i;
                        i = $scope.FILE_NUM;
                    }                    
                }
                $("#pli_" + ind).trigger("click");                
            }
        }
        //사진 삭제 
        $scope.deletePhoto2 = function(){
            $scope.deletePhoto($scope.popOption.target, $scope.popOption.index);
            $scope.popOption.close();
        }
        $scope.deletePhoto = function(target, index){
            //기존 파일인 경우 삭제 
            var pass = true;
            if($scope.used_data.item.imgInfo[index].indexOf("http://") > -1){
                $scope.pageLoading = true;
                var fileNameAr = $scope.used_data.item.imgInfo[index].split("/");                
                $.ajax({
                  type: "POST",
                  url: LotteCommon.used_img_del,
                  dataType: "json",
                  async : true,
                  data: {
                        mbrNo : $scope.loginInfo.mbrNo,
                        bbcNo : $scope.used_data.item.bbcNo,
                        delFile : fileNameAr[fileNameAr.length - 1]
                    },
                  success: function (data) {
                      if(data.board_img_delete.response_code == '0000'){
                          console.log("삭제 완료");      
                      }else{
                          pass = false;
                          alert(data.board_img_delete.response_msg);                          
                      }                    
                    $scope.pageLoading = false;
                    },
                  error : function(data){
                      if(data.error.response_msg){
                          alert(data.error.response_msg); 
                      }
                      pass = false;
                      console.log(data.responseText);
                      $scope.pageLoading = false;                      
                  },
                  complete : function(e){
                        if(pass){
                            $scope.used_data.item.imgInfo[index] = '';
                            $scope.rotateCode[index] = '';
                            $scope.orgImgFileList[index] = '';
                            angular.element(target).parent().find('input[type=file]').val('');
                            $scope.check_photoCount();                
                        }                                      
                  }        
                });                 
                
            }else{
                $scope.used_data.item.imgInfo[index] = '';
                $scope.rotateCode[index] = '';
                angular.element(target).parent().find('input[type=file]').val('');
                $scope.check_photoCount();                
            }
        }
        //현재 등록된 사진 갯수 
        $scope.check_photoCount = function(){
            $scope.photoCount = 0;
            for(var i=0; i<$scope.FILE_NUM; i++){
                if($scope.used_data.item.imgInfo[i] != ''){
                    $scope.photoCount ++;
                }                    
            }                
        }
        //--------------------- 사진 등록 관련 끝
        //금칙어 체크          
        $scope.check_word = function(fnc, errfnc){
            if($scope.used_data.item.bbcCont != ""){
                $.ajax({
                  type: "POST",
                  url: LotteCommon.board_chk,
                  dataType: "json",
                  data: {
                      bbcCont : $scope.used_data.item.bbcCont
                    },
                  success: function (data) {
                      if(data.board_chk_cont.response_code == "0000"){
                          $scope.no_write = "";
                          if(fnc != null){
                              fnc();
                          }                      
                      }else{
                          $scope.no_write = data.board_chk_cont.response_msg; //금칙어 포함 
                          alert(data.board_chk_cont.response_msg);
                          if(errfnc != null){
                              errfnc();
                          }                         
                      }

                    }                  
                });                              
            }else{
              if(fnc != null){
                  fnc();
              }                 
            }
        }
        
        
        //직거래 여부 활성 비활성 
        $scope.check_meetarea = function(){
            if($scope.check_list[2]){
                $("#meet_input").removeAttr("disabled");        
            }else{
                $("#meet_input").attr("disabled",true);         
            }
        }        
        //GA태그 
        $scope.gatag = function(action, label, index){               
            var cate = "MO_중고라운지_등록하기";
            if(!$scope.scrmode){
               cate = "MO_중고라운지_수정하기";
            }
            if(index){
                if(index < 10){
                    label = label + "0" + index;
                }else{
                    label = label + "" + index;
                }
            }
            LotteGA.evtTag(cate, action, label, "", "");
        }
        
        //----------- init 
        $scope.check_photoCount();
        $timeout(function(){
            $scope.check_byte();  
            $scope.check_meetarea();
        }, 500);
        
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
            templateUrl : '/lotte/resources_dev/mall/used_write_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.go_back = function(){
                    if(confirm("입력한 내용을 모두 취소하시겠습니까?")){
                        history.back();    
                    }                    
                }
                $scope.selectCate = function(ctg){
                    $scope.used_data.item.dispNo = ctg;
                }        
                $scope.selectGoodStat = function(str){
                    $scope.gatag('상품상태', str); 
                    $scope.used_data.item.shaGoodsStatCd = str;
                }
                
                function checkInputNumber(strid){
                    var v = $(strid);
                    if(v.val() > 9999){
                        var str = new String(v.val());                        
                        v.val(parseInt(str.substr(0, 4)));                        
                    }
                }

                $("#input_title").focusin(function() {
                    angular.element(window).scrollTop($("#pd2").position().top);    
                }); 
                $("#g_price").focusin(function() {
                    angular.element(window).scrollTop($("#pd4").position().top);    
                }); 
                $("#phone1").focusin(function() {
                    angular.element(window).scrollTop($("#pd5").position().top);    
                }); 
                $("#input_cont").focusin(function() {
                    angular.element(window).scrollTop($("#pd8").position().top);    
                }); 
                
                
                
                
                
                //------- 글자 수 체크 
                $scope.check_title = function(max){
                    var str = $scope.used_data.item.bbcTitNm;
                    if(str != ""){
                        if(str.length > max){
                            alert(max + "자 이내로 입력해 주세요");
                            $scope.used_data.item.bbcTitNm = str.substr(0, max);
                        }
                    }
                }        
                $scope.nowbyte = 0;
                var tmpstr = "";
                var tmpstrlen = 0;
                $scope.check_byte = function(){
                    $scope.nowbyte = calcBytes($scope.used_data.item.bbcCont);            
                    if($scope.nowbyte >= 300){
                        alert("최대 300바이트 입력 가능합니다.");
                        $scope.used_data.item.bbcCont = tmpstr;
                        $scope.nowbyte = tmpstrlen;
                    }else{
                        tmpstr = $scope.used_data.item.bbcCont;
                        tmpstrlen = $scope.nowbyte;
                    }
                }
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
                
            }
        };
    });

})(window, window.angular);
 
