(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteNgSwipe',
		'lotteCommFooter',
		'lotteSns'
	]);

	app.controller('StylePushIntroCtrl', ['$http', '$scope', 'LotteCommon', '$timeout', function ($http, $scope, LotteCommon, $timeout) {
		
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "스타일 추천"; // 서브헤더 타이틀
		$scope.screenID = "StyleRecoIntro"; // 스크린 아이디
		$scope.topBanner = [
			{img_url : 'http://image.lotte.com/lotte/mo2018/search/style_intro1_01.jpg', img_url_tablet : 'http://image.lotte.com/lotte/mo2018/search/style_intro1_1440_01.jpg'},
			{img_url : 'http://image.lotte.com/lotte/mo2018/search/style_intro1_02.jpg', img_url_tablet : 'http://image.lotte.com/lotte/mo2018/search/style_intro1_1440_02.jpg'},
			{img_url : 'http://image.lotte.com/lotte/mo2018/search/style_intro1_03.jpg', img_url_tablet : 'http://image.lotte.com/lotte/mo2018/search/style_intro1_1440_03.jpg'}
		]; 
		
		//공유하기
		$scope.hasSharePreFunc = true;
		$scope.isShowThisSns = true;
		$scope.planShopSns = true;
		$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png"
		$scope.isShowLoading = true;
		
		// $scope.captureImg = "http://image.lotte.com/goods/97/38/18/96/1/196183897_1_280.jpg";
		$scope.captureImg = "";
		$scope.showCaptureImg = false;
				
		$scope.$watch("captureImg", function (newValue, oldValue) {
			if (newValue === oldValue) {
				return;
			}

			if ($scope.captureImg != "" && !$scope.appObj.isIOS) { // iOS일때 이전으로 돌아올시 초기화 되지 않는 문제로 제거
				$scope.showCaptureImg = true;
			}
		});
		
		$scope.showSharePopPre = function(){
			//console.log('showSharePopPre');
			var obj = {shareImg:$scope.share_img, tclick:'m_DC_' + $scope.screenID + '_clk_share'};
			$scope.showSharePop(obj);
		};
		
		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		}
		
		$scope.getSwipeControl = function(control){
            $scope.swipeControl = control;
            $scope.swipeCurIdx = $scope.swipeControl.getIndex();
            //console.log("$scope.swipeCurIdx " + $scope.swipeCurIdx);
        };

		$scope.swipeBefore = function() {
			//console.log('prev ' + $scope.swipeCurIdx);
			$($('.style_push_bottom .text')[$scope.swipeCurIdx]).fadeOut();
			if($scope.swipeCurIdx == 0) {
				$scope.swipeCurIdx = $scope.topBanner.length - 1;
			}else{
				$scope.swipeCurIdx--;
			}
			$scope.swipeControl.setIndex($scope.swipeCurIdx);
			$($('.style_push_bottom .text')[$scope.swipeCurIdx]).fadeIn();
		};
		
		$scope.swipeNext = function() {
			//console.log('prev ' + $scope.swipeCurIdx);
			$($('.style_push_bottom .text')[$scope.swipeCurIdx]).fadeOut();
			if($scope.swipeCurIdx >= $scope.topBanner.length - 1) {
				$scope.swipeCurIdx = 0;
			}else{
				$scope.swipeCurIdx++;
			}
			$scope.swipeControl.setIndex($scope.swipeCurIdx);
			$($('.style_push_bottom .text')[$scope.swipeCurIdx]).fadeIn();
		};
		
		$scope.transitionComplete = function(idx){
			//console.log('prev ' + $scope.swipeCurIdx);
			//console.log('current '+ idx);
			$($('.style_push_bottom .text')[$scope.swipeCurIdx]).fadeOut();
			$($('.style_push_bottom .text')[idx]).fadeIn();
			$scope.swipeCurIdx = idx;
		};
		
		// 닷컴 서버 파일업로드
		var upload_path = "http://www.lotte.com/display/insertStyleRecoUploadImage.lotte";
    	
		/**
		 * 업로드 성공
		 */
		function uploadSuccess(data){
        	//var json = JSON.parse(data);
			if(typeof(data) == "string"){ data = JSON.parse(data); }
			//alert('success');
        	/*alert('name : '+ tempFiles.name + '\n' +
        			'lastModified : ' + tempFiles.lastModified + '\n' + 
        			'size : ' + tempFiles.size + '\n' + 
        			'type : ' + tempFiles.type);*/
			if(data.styleUpImgInfo){
				$scope.goStyleRecom(data.styleUpImgInfo);
				$('#loading').hide();
			}
        };
        
        /**
         * 업로드 에러
         */
        function uploadError(){
        	$timeout(function(){ $('#loading').hide(); $('body').fadeIn(); }, 0);
        	$scope.alert_2016("파일을 전송하지 못했습니다.<br/>잠시 후 다시 시도해 주세요.");
        	$("input#file_input").prop('disabled', false);
        };
        
        $scope.detectFile = function(){
        	$('#loading').show();
			$('body').fadeIn();
        	var file = document.querySelector('#file_input');
	        var extension = file.files[0].type;
	        var uploadSizeLimit = 8;
	        var size = file.files[0].size;
	        var max = uploadSizeLimit*1000*1000;// 서버에서 체크하는 방식과 맞춤
	        
	        if(!checkExt(extension)) {
                alert('지원하지 않는 확장자입니다.');
                $('#loading').hide();
				$('body').fadeIn();
                return;
            }
	        //console.log("extension " + extension);
	        if( size > max ) {
                alert( '사진 용량이 '+uploadSizeLimit+'MB 초과하였습니다.' );
                $('#loading').hide();
				$('body').fadeIn();
                return;
            }
        	getOrientation(file.files[0], $scope.cbFileExif);
        };
        
        function checkExt( fileType ){
            if( fileType == "image/jpeg" || fileType == "image/png" ) return true;
            return false;
        }
		
        $scope.uploadFile = function(rotation){
        	$("input#file_input").prop('disabled', true);
        	var formData = new FormData();
        	formData.append("file", document.getElementById("file_input").files[0]);
        	formData.append("rote_code", rotation);
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
        
		function getOrientation(file, callback) {
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
		
		$scope.cbFileExif = function(a){
			//console.log('exif ' + a);
			$scope.uploadFile(a);
		};
		
		$scope.goStyleRecom = function(obj){
			if(!obj.img_url || !obj.img_key)	return;
			var tclick = 'm_DC_' + $scope.screenID + '_clk_camera';
			location.href = LotteCommon.styleRecomUrl + '?img=' + obj.img_url + '&img_key=' + obj.img_key + '&' + $scope.baseParam + '&tclick=' + tclick;
		};
	}]);

	app.directive('lotteContainer',['$timeout', function($timeout) {
		return {
			templateUrl : '/lotte/resources_dev/search/style_push_intro_container_2018.html',
			replace : true,
			link : function ($scope, el, attrs) {
				
				$scope.callApp = function (type) {
					if ($scope.appObj.isIOS) { // ios
						if (type == "image") {
							try {
								location.href = 'imagesearch://image';
								$scope.sendTclick("m_patternsearch_gate_gallery");
							} catch (e) {}
						} else if (type == "camera") {
							try {
								location.href = 'imagesearch://camera';
								$scope.sendTclick("m_patternsearch_gate_camera");
							} catch (e) {}
						}
					}else { // android
						if (type == "image") {
							try {
								window.imagesearch.callAndroid('image');
								$scope.sendTclick("m_patternsearch_gate_gallery");
							} catch (e) {}
						} else if (type == "camera") {
							try {
								window.imagesearch.callAndroid('camera');
								$scope.sendTclick("m_patternsearch_gate_camera");
							} catch (e) {}
						}
					}
				};

				$scope.iosAppPermisionChk = false;

				// iOS 사진/카메라 권한 확인 이후 callback 등록
				window.responsePermision = function (result) {
					console.log("iOS 권한체크 완료");

					if (result) {
						$scope.iosAppPermisionChk = result;
						angular.element("#file_input").click();
					}
				};
				
				//스타일 추천 사진 촬영/업로드 2018-01-25 상품평 동일
				var callScheme = {
					web2app:function(host, params) {
						var iframe = document.createElement('IFRAME');
						iframe.setAttribute("src", "lottebridge://"+host+"?"+params); 
						iframe.setAttribute('frameborder', '0'); 
						iframe.style.width = '1px'; 
						iframe.style.height = '1px'; 
						document.body.appendChild(iframe); 
						document.body.removeChild(iframe); 
						iframe = null;
					}
				}				
				$scope.callAppUpload = function($event) {
					if ($scope.appObj.isIOS && $scope.appObj.verNumber >= 4000 && !$scope.iosAppPermisionChk) { // IOS버전 4.0 이상
						console.log("iOS 권한체크 호출");

						$event.preventDefault(); // iOS 권한체크 선행을 위한 이벤트 중지
						$event.stopPropagation();

						location.href = "lottebridge://queryPermission?action=media";
					}

					if (!$scope.iosAppPermisionChk) {
						$scope.sendTclick("m_DC_"+$scope.screenID+"_clk_camera");
					}
					$scope.sendTclick("m_DC_"+$scope.screenID+"_clk_camera");
				};
				
			}
		};
	}]);

})(window, window.angular);