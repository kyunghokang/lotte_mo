(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header'
    ]);

    app.controller('ProfileWriteCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "프로필 수정"; //서브헤더 타이틀
        $scope.blankImgUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";
        $scope.actionbarHideFlag = true;
        
        $scope.pageUI = {
            mylotte : null
        };
    }]);

    app.filter('maskingId', function(){
        return function(str){
        	var result = '';
        	if(str){
        		result = str.substr(0, 3) + '*****';
        	}
            return result;
        }
	});
    
    // 이미지 에러시 처리
 	app.directive('onErrorSrc', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  if(scope.pageUI.mylotte.imgUrl != scope.blankImgUrl){
 	        		  scope.pageUI.mylotte.imgUrl = scope.blankImgUrl;
 	        	  }
 	          });
 	        }
 	    }
 	});

    app.directive('lotteContainer', ['$http', '$timeout', 'LotteCommon', 'LotteCookie', 'LotteForm', function($http, $timeout, LotteCommon, LotteCookie, LotteForm) {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/m/profile_write_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
            	// 닉네임 중복체크 
            	$scope.checkedNick = {
					nick : '',
					org : ''
				};
            	
            	var nick_org = '';

                ($scope.loadData = function() {
                    $scope.jsonLoading = true; // 로딩커버
        
                    $http.get('/json/mylotte/mylotte_profile.json')
                    .success(function (data) {
                        if (data.mylotte) {
                            $scope.pageUI.mylotte = data.mylotte;
							if(!$scope.pageUI.mylotte.imgUrl){
								$scope.pageUI.mylotte.imgUrl = $scope.blankImgUrl;
							}
							$scope.checkedNick.org = $.trim(data.mylotte.nickName);
							$scope.pageUI.mylotte.mbrNick = $.trim(data.mylotte.nickName);
                        }
                    })
                    .error(function () {
                        console.log('Data Error : 프로필 데이터 로드 실패');
                    })
                    .finally(function () {
                        $scope.jsonLoading = false; // 로딩커버
                    });
                })();

                // save(): 등록
            	$scope.save = function() {
            		
            		// 로딩중이면 리턴
            		if($scope.jsonLoading)	return;
            		
            		// 닉네임선택이 아닌경우 닉네임 원복
            		if(!$scope.pageUI.mylotte.nknmSetYn){
            			$scope.pageUI.mylotte.mbrNick = $scope.checkedNick.org;
            		}
            		
            		// 닉네임선택인데 닉네임이 입력되지 않은 경우
            		if($scope.pageUI.mylotte.nknmSetYn && !$.trim($scope.pageUI.mylotte.mbrNick)){
            			alert('닉네임을 입력해 주십시요.');
            			return;
            		}
            		
            		// 닉네임 선택, 닉네임이 변경되었는데 중복확인 안한경우
            		if($scope.pageUI.mylotte.nknmSetYn && !($scope.checkedNick.org == $.trim($scope.pageUI.mylotte.mbrNick) || $scope.checkedNick.nick == $.trim($scope.pageUI.mylotte.mbrNick))){
            			alert('닉네임을 중복확인해 주십시요.');
            			return;
					}
            		
            		var upload_path = "http://www.lotte.com/mobile/updateProfileInfo.lotte";
					// test
            		if(location.hostname.indexOf('mt') > -1){
            			upload_path = 'http://test.lotte.com/mobile/updateProfileInfo.lotte';
            		}
            		if(location.hostname.indexOf('mt2') > -1 || location.hostname.indexOf('localhost') > -1){
            			upload_path = 'http://test2.lotte.com/mobile/updateProfileInfo.lotte';
            		}
            		if(location.hostname.indexOf('molocal') > -1){
            			upload_path = 'http://fo.lotte.com/mobile/updateProfileInfo.lotte';
            		}
            		
            		var formData = new FormData();
            		formData.append("mbr_no", $scope.pageUI.mylotte.mbrNo || "");
            		formData.append("nickname", $.trim($scope.pageUI.mylotte.mbrNick) || "");
                	formData.append("nknm_set_yn", $scope.pageUI.mylotte.nknmSetYn);
            	
            		if(document.getElementById("file1") && document.getElementById("file1").files && document.getElementById("file1").files[0]){
            			formData.append("prf_img_file", document.getElementById("file1").files[0]);
            			formData.append("rote_code", $scope.pageUI.mylotte.rote_code);
            		}
            		
                	$scope.jsonLoading = true;
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

                /**
    			 * 업로드 성공
    			 */
    			function uploadSuccess(json){
    				try{
	    				var data = JSON.parse(json);
	    				if(data && data.response_code && data.response_code === '0000'){
		    				// 리스트로 이동
		        			$timeout(function() {  
		        				if(document.referrer){
		        					location.replace(document.referrer);
		        				}else{
		        					location.replace(LotteCommon.mylotteUrl + '?' + $scope.baseParam);
		        				}
		                	}, 200);
		        			return;
	    				}
	    				if(data && data.response_msg){
		        			alert(data.response_msg);
	    				}
    				}catch(e){}
    				$scope.jsonLoading = false;
    	        };
    	        
    	        /**
    	         * 업로드 에러
    	         */
    	        function uploadError(json){
    	        	try{
        				var data = JSON.parse(json);
	    	        	if(data && data.response_msg){
	    	        		alert(data.response_msg);
	    	        	}
    	        	}catch(e){}
    	        	$scope.jsonLoading = false;
    	        };
    	        
    	        $scope.detectFile = function(file){
    	        	//console.log(file);
    		        var extension = file.files[0].type;
    		        var uploadSizeLimit = 5;
    		        var size = file.files[0].size;
    		        var max = uploadSizeLimit*1000*1000;// 서버에서 체크하는 방식과 맞춤
    		        
    		        if(!checkExt(extension)) {
    	                alert('jpg/png 파일만 업로드 가능합니다.');
    	                return;
    	            }
    		        if( size > max ) {
    	                alert( '사진 용량이 '+uploadSizeLimit+'MB 초과하였습니다.' );
    	                return;
    	            }
    		        
    		        loadImage( file.files[0], function (img) {
                        try{ 
                        	//console.log('aaa ' + (idx - 1));
                        	$scope.pageUI.mylotte.imgUrl = img.toDataURL();
                        }catch(e) {
                        }
                        try{ $scope.$apply() } catch(e) { };
	                }, { maxWidth:800, minWidth:216, minHeight:216, cover:true, canvas: true } // Options
	                );
    		        
    	        	getOrientation(file.files[0], $scope.cbFileExif);
    	        };
    	        
    	        function checkExt( fileType ){
    	            if( fileType == "image/jpeg" || fileType == "image/png" ) return true;
    	            return false;
    	        }
    			
    			function getOrientation(file, callback, idx) {
					var reader = new FileReader();
					reader.onload = function(e) {
					
						var view = new DataView(e.target.result);
						if (view.getUint16(0, false) != 0xFFD8) return callback(file, -2);
						var length = view.byteLength, offset = 2;
						while (offset < length) {
							var marker = view.getUint16(offset, false);
							offset += 2;
							if (marker == 0xFFE1) {
								if (view.getUint32(offset += 2, false) != 0x45786966) return callback(file, -1);
								var little = view.getUint16(offset += 6, false) == 0x4949;
								offset += view.getUint32(offset + 4, little);
								var tags = view.getUint16(offset, little);
								offset += 2;
								for (var i = 0; i < tags; i++) {
									if (view.getUint16(offset + (i * 12), little) == 0x0112){
										return callback(file, view.getUint16(offset + (i * 12) + 8, little));
									}
								}
							}
							else if ((marker & 0xFF00) != 0xFF00) break;
							else offset += view.getUint16(offset, false);
						}
						return callback(file, -1);
					};
					reader.readAsArrayBuffer(file);
                }
                
                $scope.cbFileExif = function(file, a){
    				console.log('exif ' + a);
    				$scope.pageUI.mylotte.rote_code = a;
    				try{
    					$scope.$apply();
    				}catch(e){}
    			};
    			
    			$scope.iosAppPermisionChk = false;

				// iOS 사진/카메라 권한 확인 이후 callback 등록
				window.responsePermision = function (result) {
					console.log("iOS 권한체크 완료");

					if (result) {
						$scope.iosAppPermisionChk = result;
						angular.element("#file1").click();
					}
				};
				
    			$scope.callAppUpload = function($event, idx) {
    	        	
					if ($scope.appObj.isIOS && $scope.appObj.verNumber >= 4000 && !$scope.iosAppPermisionChk) { // IOS버전 4.0 이상
						console.log("iOS 권한체크 호출");

						$event.preventDefault(); // iOS 권한체크 선행을 위한 이벤트 중지
						$event.stopPropagation();

						location.href = "lottebridge://queryPermission?action=media";
					}
				};
				
				$scope.deleteImg = function(){
					
					if(confirm('기본 이미지로 변경하시겠습니까?')){
						if(document.getElementById("file1").files && document.getElementById("file1").files[0]){
							$scope.pageUI.mylotte.rote_code = 0;
							$scope.pageUI.mylotte.imgUrl = $scope.blankImgUrl;
							document.getElementById("file1").value = "";
						}else{
							$scope.deleteAttachedImage();
						}
					}
				};
				
				// deleteAttachedImage(): 첨부된 이미지 삭제
		    	$scope.deleteAttachedImage = function() {
		    		var imgFile = $scope.pageUI.mylotte.imgUrl;
		    		if($scope.pageUI.mylotte.imgUrl.indexOf('http://image.lotte.com/upload/profiles/') > -1){
		    			var arr  = $scope.pageUI.mylotte.imgUrl.split('http://image.lotte.com/upload/profiles/');
		    			imgFile = arr[1];
		    		}
		    		var params = {
		    			mbr_no : $scope.pageUI.mylotte.mbrNo,
		    			prf_img_file : imgFile
		    		};
		    		$scope.jsonLoading = true;

		    		LotteForm.FormSubmitForAjax(
		    				'/json/mylotte/profile_img_delete.json' + '?' + $scope.baseParam, params
	        		).success(function(data) {
	        			$scope.pageUI.mylotte.rote_code = 0;
						$scope.pageUI.mylotte.imgUrl = $scope.blankImgUrl;
						document.getElementById("file1").value = "";
	        		}).error(function(ex) {
	        			//ajaxResponseErrorHandler(ex);
	                })
	                .finally(function() {
	                	$scope.jsonLoading = false;
	                });
		    	};
				
				$scope.clickCancel = function(){
					if(document.referrer){
    					location.replace(document.referrer);
    				}else{
    					location.replace(LotteCommon.mylotteUrl + '?' + $scope.baseParam);
    				}
				};
				
				function hasSpecialChar(nick){
					var pattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| _.]*$/; // 한글, 영대소문자, 숫자, 공백, 언더바, 마침표만 가능
					if(!pattern.test(nick)){ //특수문자가 포함되면
						return true;
					}
					return false;
				}

				$scope.checkDupId = function(){
					
					var checkedNick = $.trim($scope.pageUI.mylotte.mbrNick);
					if(!checkedNick){
						alert('닉네임을 입력해 주십시요.');
						return;
					}
					
					if(checkedNick == $scope.checkedNick.org){
						alert('기존 닉네임과 동일합니다.');
						return;
					}
					
					if(hasSpecialChar(checkedNick)){
						alert('한글, 영문대소문자, 밑줄, 마침표를 제외한 특수문자는 입력이 불가능합니다.');
						$("#ipNick").focus();
						return;
					}
					$scope.jsonLoading = true; // 로딩커버
        
                    $http.get('/json/mylotte/mylotte_profile_chk.json' , {
                        params:{
							nickname : checkedNick
                        }
                    })
                    .success(function (data) {
                    	if(data.mylotte){
	                        if (data.mylotte.resultCode && data.mylotte.resultCode == '01') {
								$scope.checkedNick.nick = checkedNick;
	                            if(data.mylotte.resultMsg){
									alert(data.mylotte.resultMsg);
								}
	                        }else{
								if(data.mylotte.resultMsg){
									alert(data.mylotte.resultMsg);
								}
							}
                    	}
                    })
                    .error(function () {
                        console.log('Data Error : 아이디 중복체크 실패');
                    })
                    .finally(function () {
                        $scope.jsonLoading = false; // 로딩커버
                    });
				};
				
				$scope.calcByte = function(){	
					var ip = angular.element('#ipNick');
					var disp = angular.element('#curbyte');
					var msgLen = 0, prevMsgLen = 0;
					var temp, tempStr = "";
					var max = 16;
					if(ip.val().length){
						for(var k = 0; k<ip.val().length; k++){
							temp = ip.val().charAt(k);
							prevMsgLen = msgLen;
							if(escape(temp).length > 4){
								msgLen += 2;
							}else{
								msgLen++;
							}
							if(msgLen > max){
								alert('16바이트를 초과할 수 없습니다.');
								ip.val(tempStr);
								//console.log(prevMsgLen);
								disp.text(prevMsgLen);
								break;
							}else{
								tempStr += temp;
								disp.text(msgLen);
							}
						}
					}else{
						disp.text(msgLen);
					}
					$scope.pageUI.mylotte.mbrNick = tempStr;
				};
            }
        };
    }]);

})(window, window.angular);