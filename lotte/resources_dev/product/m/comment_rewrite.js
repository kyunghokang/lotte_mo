(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('commentRewriteCtrl', ['$scope', '$timeout', 'LotteCommon', '$http', '$filter', '$window', 'LotteUtil', 'LotteForm', function($scope, $timeout, LotteCommon, $http, $filter, $window, LotteUtil, LotteForm) {
    	$scope.showWrap = true;
    	$scope.contVisible = true;
    	$scope.subTitle = '상품평 수정'; /* 서브헤더 타이틀 */

    	// INPUT 데이터 초기화
    	$scope.input = {};
    	$scope.input.evt_no = LotteUtil.getParameter('evt_no');
    	$scope.input.evt_flag = LotteUtil.getParameter('evt_flag');
    	
    	$scope.pageUI = {
			stepOpen1 : true,
			stepOpen2 : true,
			stepOpen3 : true
		};
    	
    	$scope.rotation1 = 0;
		$scope.rotation2 = 0;
		$scope.rotation3 = 0;
    	
    	$scope.fileImgList = {
			blankImg : 	'http://image.lotte.com/lotte/mo2018/reviews/btn_media.jpg',
			ingIdx : null,
			hasImg : false,
			list :[]
		};
    	
    	// 상품 데이터 조회
    	$scope.commentWrite = {};
    	try {
    		$scope.jsonLoading = true;
	    	$http.get(LotteCommon.commentRewriteData + '?' + $scope.baseParam + '&gdas_no=' + LotteUtil.getParameter('gdas_no') + '&goods_no=' + LotteUtil.getParameter('goods_no'))
					.success(function(data) {
				$scope.commentWrite = data.comment_rewrite;
				
				// E-쿠폰 혹은 스마트픽일 때 타이틀 변경
				$scope.subTitle = ($scope.commentWrite.goods_tp_cd == '20' || $scope.commentWrite.smp_psb_yn) ? '이용후기 쓰기' : $scope.subTitle;
				
				$scope.input.gdas_no = $scope.commentWrite.gdas_no; 
		    	$scope.input.reviewTxt = $scope.commentWrite.gdas_cont;
		    	$scope.input.gdas_stfd_val = $scope.commentWrite.stfd_val;
	        	$scope.input.frst_gdas_yn = $scope.commentWrite.frst_gdas && 'Y' || 'N'; 
	        	$scope.input.wrtr_pur_yn = $scope.commentWrite.wrtr_pur && 'Y' || 'N'; 
	        	$scope.input.goods_no = $scope.commentWrite.goods_no;
	        	$scope.input.usm_goods_no = $scope.commentWrite.usm_goods_no;
	        	
	        	var arrCount = [];
	        	if($scope.commentWrite.img_path_1_nm && $scope.commentWrite.img_file_1_nm){
	        		var obj1 = {idx:1, hasFile:false};
	        		arrCount.push(1);
	        		obj1.imgUrl = LotteUtil.getImagePath('') + $scope.commentWrite.img_path_1_nm + $scope.commentWrite.img_file_1_nm;
	        		obj1.reqUrl = $scope.commentWrite.img_file_org_nm_1;
	        		$scope.fileImgList.list.push(obj1);
	        	}
	        	if($scope.commentWrite.img_path_2_nm && $scope.commentWrite.img_file_2_nm){
	        		var obj2 = {idx:2, hasFile:false};
	        		arrCount.push(2);
	        		obj2.imgUrl = LotteUtil.getImagePath('') + $scope.commentWrite.img_path_2_nm + $scope.commentWrite.img_file_2_nm;
	        		obj2.reqUrl = $scope.commentWrite.img_file_org_nm_2;
	        		$scope.fileImgList.list.push(obj2); 
	        	}
	        	if($scope.commentWrite.img_path_3_nm && $scope.commentWrite.img_file_3_nm){
	        		var obj3 = {idx:3, hasFile:false};
	        		arrCount.push(3);
	        		obj3.imgUrl = LotteUtil.getImagePath('') + $scope.commentWrite.img_path_3_nm + $scope.commentWrite.img_file_3_nm;
	        		obj3.reqUrl = $scope.commentWrite.img_file_org_nm_3;
	        		$scope.fileImgList.list.push(obj3); 
	        	}
	        	if($scope.fileImgList.list.length < 3){
		        	for(var i = $scope.fileImgList.list.length; i<3; i++){
		        		var dummy = {
    		        		imgUrl : 'http://image.lotte.com/lotte/mo2018/reviews/btn_media.jpg',
    		        		reqUrl : '',
    		        		hasFile : false
    		        	};
		        		for(var j = 1; j<=3; j++){
		        			if(arrCount.indexOf(j) < 0){
		        				dummy.idx = j;
		        				arrCount.push(j);
		        				break;
		        			}
		        		}
		        		$scope.fileImgList.list.push(dummy);
		        	}
	        	}
	        	if($scope.input.reviewTxt){
	        		$timeout(function(){
	        			$('#reviewTxt').trigger('keyup');
	        		}, 300);
	        	}
	    	}).error(function(ex) {
	        	ajaxResponseErrorHandler(ex);
	        })
	        .finally(function() {
	        	$scope.jsonLoading = false;
	        });
    	} catch(e) {
    		console.error(e);
    	}
    	
    	// cancel(): 취소
    	$scope.cancel = function() {
    		if (confirm('상품평 수정을 취소하시겠습니까?')) {
    			location.replace(LotteCommon.mylotteCritViewUrl + '?' + $scope.baseParam + '&mode=second');
    		}
    	};
    }]);

    app.directive('lotteContainer', ['$window', '$location', 'LotteCommon', 'LotteForm', '$timeout', function ($window, $location, LotteCommon, LotteForm, $timeout) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/comment_rewrite_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
            	// 개별 파일업로드를 위한 데이터
				$scope.objFile = {
					count: 0,
					items: []
				};
				
            	$scope.clickStepTitle = function(step){
            		$scope.pageUI['stepOpen' + step] = !$scope.pageUI['stepOpen' + step];
        			if(step === 3){
        				$scope.actionbarHideFlag = true;
        			}else{
        				$scope.actionbarHideFlag = false;
        			}
            	};
            	
            	$scope.openStep = function(step){
            		$timeout(function(){
            			$scope.pageUI['stepOpen' + step] = true;
    					
    					var top = 0;
    					if(step == 1){
    						top = $('.list.review li.star').offset().top;
    					}else if(step == 2){
    						top = $('.list.review li.option').offset().top;
    					}else if(step == 3){
    						top = $('.list.review li.file').offset().top;
    					}
    					
    					var body = $("html, body");
            			body.stop().animate({scrollTop:top - 94}, 500, 'swing', function() { 
            			   //console.log("Finished animating");
            			});
            		});
				};
            	
            	$scope.saveReady = function(){
            		
            		// 로딩중이면 리턴
					if($scope.jsonLoading)	return;
					
            		// 입력값 확인
            		if(!$scope.input.gdas_stfd_val){
            			alert('별점과 항목별 평가는 꼭 등록해주셔야 하는 항목입니다.');
            			$scope.openStep(1);
            			return;
            		}
            		if($scope.commentWrite.easnGdasList && $scope.commentWrite.easnGdasList.items && $scope.commentWrite.easnGdasList.items.length){
	            		var validInput = true;
	            		for(var i = 0; i<$scope.commentWrite.easnGdasList.items.length; i++){
	            			var item = $scope.commentWrite.easnGdasList.items[i];
	            			if(!item.gdas_choc_item_value){
	            				validInput = false;
	            				break;
	            			}
	            		}
	            		if(!validInput){
	            			alert('별점과 항목별 평가는 꼭 등록해주셔야 하는 항목입니다.');
	            			$scope.openStep(2);
	            			return;
	            		}
            		}
            		// 개별 파일 업로드 관련 데이터 초기화 및 재 등록
					$scope.objFile.count = 0;
					$scope.objFile.items = [];
					for(var i = 1; i<=3; i++){
						if(document.getElementById("file" + i) && document.getElementById("file" + i).files && document.getElementById("file" + i).files[0]){
							$scope.objFile.count++;
							$scope.objFile.items.push({
								img_file : '', 
								index : i,
								rote_code: $("#file" + i).data("rote_code")
							})
						}
					}
					if($scope.objFile.count > 0){
						eachFileUpload(0);
					}else{
						$scope.save();
					}
            	};
            	
            	/**
				 * 파일을 하나씩 업로드
				 */
				function eachFileUpload(idx) {
					var upload_path = "http://www.lotte.com/mobile/insertCommentImage.lotte";
					// test
            		if(location.hostname.indexOf('mt') > -1){
            			upload_path = 'http://test.lotte.com/mobile/insertCommentImage.lotte';
            		}
            		if(location.hostname.indexOf('mt2') > -1 || location.hostname.indexOf('localhost') > -1){
            			upload_path = 'http://test2.lotte.com/mobile/insertCommentImage.lotte';
            		}
            		if(location.hostname.indexOf('molocal') > -1){
            			upload_path = 'http://fo.lotte.com/mobile/insertCommentImage.lotte';
            		}
					var formData = new FormData();
            		formData.append("img_file", document.getElementById("file" + $scope.objFile.items[idx].index).files[0]);
            		formData.append("rote_code", $("#file" + $scope.objFile.items[idx].index).data("rote_code"));
                	$scope.jsonLoading = true;
        			$.ajax({
        				type : "post",
                        data : formData,
                        async : false,
                        cache : false,
        	            url: upload_path,
        	            success: function(json){
        	            	var data = JSON.parse(json);
        	            	if(data.response_code && data.response_code == "0000" && data.img_file){
								$scope.objFile.items[idx].img_file = data.img_file;
								$scope.checkStep(idx);
							}else{
								if(data.response_msg){
									alert(data.response_msg);
								}else{
									alert("상품평이 등록되지 않았습니다. 다시 등록해주세요");
								}
								$scope.jsonLoading = false;
							}
        	            },
        	            error: function(data){
        	            	alert("상품평이 등록되지 않았습니다. 다시 등록해주세요");
        	            	$scope.jsonLoading = false;
        	            },
        	            contentType: false,
        	            processData: false
        	        });
				};
				
				/**
				 * 파일업로드 다음 단계 체크
				 */
				$scope.checkStep = function(idx){
					idx++;
					if($scope.objFile.count > idx){
						eachFileUpload(idx);
					}else{
						$scope.save();
					}
				};
            	
            	// save(): 등록
            	$scope.save = function() {
            		var upload_path = 'http://www.lotte.com/mobile/updateCommentNew.lotte';
            		// test
            		if(location.hostname.indexOf('mt') > -1){
            			upload_path = 'http://test.lotte.com/mobile/updateCommentNew.lotte';
            		}
            		if(location.hostname.indexOf('mt2') > -1 || location.hostname.indexOf('localhost') > -1){
            			upload_path = 'http://test2.lotte.com/mobile/updateCommentNew.lotte';
            		}
            		if(location.hostname.indexOf('molocal') > -1){
            			upload_path = 'http://fo.lotte.com/mobile/updateCommentNew.lotte';
            		}
            		$scope.jsonLoading = true;
            		var formData = new FormData();
            		formData.append("mbr_no", $scope.commentWrite.mbr_no);
            		formData.append("goods_no", $scope.input.goods_no);
            		formData.append("gdas_no", $scope.input.gdas_no);
            		formData.append("gdas_stfd_val", $scope.input.gdas_stfd_val);
            		if($scope.commentWrite.easnGdasList && $scope.commentWrite.easnGdasList.items && $scope.commentWrite.easnGdasList.items.length){
                		for(var i = 0; i<$scope.commentWrite.easnGdasList.items.length; i++){
                			var item = $scope.commentWrite.easnGdasList.items[i];
                			formData.append("eval_item_" + i, item.gdas_item_no + ":" + item.gdas_choc_shp_item_yn + ":" + item.gdas_choc_item_value);
                    	}
                	}
            		formData.append("usm_goods_no", $scope.input.usm_goods_no);
            		if($scope.objFile.count && $scope.objFile.count > 0){
            			for(var j = 0; j<$scope.objFile.count; j++){
            				var num = getValidFileIndex();
							formData.append("img_file_" + num, $scope.objFile.items[j].img_file);
						}
					}
                	formData.append("reviewTxt", $scope.input.reviewTxt);
                	
                	// 실제 올리는 파일이 없는 경우 1번 이미지필드가 비어 있는지 확인후 채움
                	if(!$scope.objFile.count){
                		resetImgList();
                	}
                	
                	for(var i = 0; i<3; i++){
            			formData.append("img_file_org_nm_" + (i + 1), $scope.fileImgList.list[i].reqUrl);
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
            		//return false; // form sumbmit 기본 동작 방지
            	};
            	
            	/**
            	 * 파일 업로드가 없는 경우 : 첫번째 사진이 비었으면 채움
            	 */
            	function resetImgList(){
            		var hasImg = false;
            		for(var i = 0; i<$scope.fileImgList.list.length; i++){
            			if($scope.fileImgList.list[i].reqUrl){
            				hasImg = true;
            				break;
            			}
            		}
            		// 기등록 이미지 없으면 통과
            		if(!hasImg)	return;
            		// 첫번째 이미지가 채워져 있으면 통과
            		if($scope.fileImgList.list[0].reqUrl)	return;
            		// 두번째에 기등록 이미지 있으면 첫번째로 넣음.
            		if($scope.fileImgList.list[1].reqUrl){
            			$scope.fileImgList.list[0].reqUrl = $scope.fileImgList.list[1].reqUrl;
            			$scope.fileImgList.list[1].reqUrl = "";
            			return;
            		}
            		// 세번째에 기등록 이미지 있으면 첫번째로 넣음.
            		if($scope.fileImgList.list[2].reqUrl){
            			$scope.fileImgList.list[0].reqUrl = $scope.fileImgList.list[2].reqUrl;
            			$scope.fileImgList.list[2].reqUrl = "";
            			return;
            		}
            	}
            	
            	/**
            	 * 사진 순서 재배치
            	 */
            	function getValidFileIndex(){
            		var idx = 0;
            		var arr = [];
            		for(var i = 0; i<$scope.fileImgList.list.length; i++){
            			var item = $scope.fileImgList.list[i];
            			if(!item.reqUrl && !item.hasFile){
            				idx = i + 1;
            				break;
            			}
            		}
            		if(idx >= 0) $scope.fileImgList.list[idx-1].hasFile = true;
            		return idx;
            	}
            	
    			/**
    			 * 업로드 성공
    			 */
    			function uploadSuccess(json){
    				try{
	    				var data = JSON.parse(json);
	    				if(data && data.response_code && data.response_code === '0000'){
		    				// 리스트로 이동
		        			$timeout(function() {  
		        				location.replace(LotteCommon.mylotteCritViewUrl + '?' + $scope.baseParam);
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
    	        
    	        $scope.detectFile = function(file, idx){
    	        	//console.log(file);
    	        	$scope.fileImgList.ingIdx = idx;
    	        	
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
                        	$scope.fileImgList.list[idx - 1].imgUrl = img.toDataURL();
                        	$scope.fileImgList.list[idx - 1].reqUrl = "";
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
    				//alert('exif ' + a);
    				//alert($scope.fileImgList.ingIdx);
    				$("#file" + $scope.fileImgList.ingIdx).data('rote_code', a);
    				$scope["rotation" + $scope.fileImgList.ingIdx] = a;
    			};
    			
    			$scope.iosAppPermisionChk = false;

				// iOS 사진/카메라 권한 확인 이후 callback 등록
				window.responsePermision = function (result) {
					console.log("iOS 권한체크 완료");

					if (result) {
						$scope.iosAppPermisionChk = result;
						angular.element("#file" + $scope.fileImgList.ingIdx).click();
					}
				};
    			
    			$scope.callAppUpload = function($event, idx) {

					if ($scope.appObj.isIOS && $scope.appObj.verNumber >= 4000 && !$scope.iosAppPermisionChk) { // IOS버전 4.0 이상
						console.log("iOS 권한체크 호출");
						$scope.fileImgList.ingIdx = idx;

						$event.preventDefault(); // iOS 권한체크 선행을 위한 이벤트 중지
						$event.stopPropagation();

						location.href = "lottebridge://queryPermission?action=media";
					}
					//$scope.sendTclick("m_DC_"+$scope.screenID+"_clk_camera");
				};
				
				$scope.deleteImg = function(idx, dbIdx){
					if(document.getElementById("file" + idx) && document.getElementById("file" + idx).files && document.getElementById("file" + idx).files[0]){
						$scope.fileImgList.list[idx - 1].imgUrl = $scope.fileImgList.blankImg;
						$scope.fileImgList.list[idx - 1].reqUrl = "";
						document.getElementById("file" + idx).value = "";
						$scope["rotation" + idx] = 0;
            		}else{
            			$scope.deleteAttachedImage(idx, dbIdx);
            		}
				};
				
				// deleteAttachedImage(): 첨부된 이미지 삭제
		    	$scope.deleteAttachedImage = function(uiIndex, index) {
		    		if (confirm('사진을 삭제하시겠습니까?')) {
		    			$scope.input.del_file = '';
		    			$scope.input.del_path = '';
			    		switch (index) {
				    		case 1:	
				    			$scope.input.del_file = $scope.input.img_file_1
				    			$scope.input.del_path = $scope.input.img_path_1
				    			$scope.input.img_file_1 = '';
				    			$scope.input.img_path_1 = '';
				    			break;
				    		case 2:
				    			$scope.input.del_file = $scope.input.img_file_2
				    			$scope.input.del_path = $scope.input.img_path_2
				    			$scope.input.img_file_2 = '';
				    			$scope.input.img_path_2 = '';
				    			break;
				    		case 3:
				    			$scope.input.del_file = $scope.input.img_file_3
				    			$scope.input.del_path = $scope.input.img_path_3
				    			$scope.input.img_file_3 = '';
				    			$scope.input.img_path_3 = '';
				    			break;
			    		}
			    		$scope.jsonLoading = true;
		//	    		var params = $('#commentRewriteForm').serialize();
			    		LotteForm.FormSubmitForAjax(
			    			LotteCommon.commentImageDeleteData + '?' + $scope.baseParam, $scope.input
		        		).success(function(data) {
		        			// 엘리먼트 숨김 처리
		        			//document.querySelectorAll('#img_list img')[index - 1].src = blankImageUrl; 
		        			//document.querySelectorAll('#img_list a')[index - 1].style.display = 'none';
		        			$scope.fileImgList.list[uiIndex - 1].imgUrl = $scope.fileImgList.blankImg;
		        			$scope.fileImgList.list[uiIndex - 1].reqUrl = "";
		        		}).error(function(ex) {
		        			ajaxResponseErrorHandler(ex);
		                })
		                .finally(function() {
		                	$scope.jsonLoading = false;
		                });
		    		}
		    	};
		    	
		    	$scope.tipSwipeIndex = 0;
				$scope.tipSwipeEnd = function(idx){
					$scope.tipSwipeIndex = idx;
				};

				$scope.showTipLayer = function(items){
					if(!$scope.commentWrite.commentTipInfo || !$scope.commentWrite.commentTipInfo.items || !$scope.commentWrite.commentTipInfo.items)	return;
					
					$scope.tipSwipeIndex = 0;
					
					$scope.dimmedOpen({
						callback: $scope.hideTipLayer,
						scrollEventFlag: false
					});
					$timeout(function(){
						$scope.arrTip = $scope.commentWrite.commentTipInfo.items;
						//console.log(items);
						$('#lotteDimm').css('z-index', '115');
					}, 200);
				};
				$scope.hideTipLayer = function(){
					$scope.arrTip = null;
				};
				
				// 별점 변경 이벤트 콜백
				$scope.onStarChange = function(val){
					//console.log(val);
					$scope.input.gdas_stfd_val= val;
					try{
						$scope.$apply();
					}catch(e){}
				};
            }
        };
    }]);
    
    app.directive('lotteStar', ['$window', '$timeout', function ($window, $timeout) {
		return {
			scope : {
				onStarChange : "&"
			},
			link: function (scope, el, attrs) {
				
				var config; // 설정
				var target;
				var dragging = false;
				var arrX;
				
				// 초기화 함수
				function init(time){
					$timeout(function(){
						config = angular.extend({
							selector : 'ul>li'
						}, attrs);
						
						target = angular.element(el);
						arrX = [];
						angular.forEach(target.find(config.selector), function(value, key){
	                    	arrX.push(angular.element(value).offset().left);
	                    });
						target.off('touchstart.star').off('touchmove.star').off('touchend.star');
						target.on({'touchstart.star' : onStart, 'touchmove.star' : onMove ,'touchend.star' : onEnd});
					}, time);
				}
				init(200);
				
				function onStart(e){
					e.stopPropagation();
					dragging = true;
					var point = e.originalEvent.touches[0];
				}
				
				function onMove(e){
					if(dragging){
						var point = e.originalEvent.touches[0];
	                    var cx = point.clientX;
	                    var temp = 1;
	                    if(cx < arrX[0]){
	                    	temp = 0;
	                    }else{
		                    for(var i = 0; i<arrX.length; i++){
		                    	if(cx >= arrX[i]){
		                    		temp = i;
		                    	}
		                    }
	                    }
	                    scope.onStarChange({val : temp + 1});
					}
				}
				
				function onEnd(e){
					dragging = false;
				}
				
				angular.element($window).on("orientationchange.star", function (e) {
					init(500);
				});
			}
		};
    }]);
})(window, window.angular);

/**
 * 비동기 서비스 요청 후 에러 시 핸들러
 * 		- 응답을 서버수행에러(500)으로 받은 후 호출 됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseErrorHandler = function(ex, errorCallback) {
	if (ex.error) {
		var errorCode = ex.error.response_code;
		var errorMsg = ex.error.response_msg;
		if ('9004' == errorCode) {
			// TODO ywkang2 : lotte_svc.js 를 참조해야함
			var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};

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
		  document.getElementById('spn_input_char').innerText = 4000 - msglen;
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
					document.getElementById('spn_input_char').innerText = 4000 - msglen;
				}      
				tmpstr += temp;
			}
		}  
	}
}