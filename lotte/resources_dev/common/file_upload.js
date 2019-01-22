(function(window, angular, undefined) {
	'use strict';

	var addressInfoModule = angular.module('fileUpload', ['lotteComm']);
    
	addressInfoModule.controller('fileUploadCtrl', ["$scope", "LotteCommon", function ($scope, LotteCommon){}]);

	addressInfoModule.directive('fileUpload', ['LotteCommon','$window', '$timeout', '$parse', '$http',
	                                  function (LotteCommon,  $window,   $timeout,   $parse,   $http){
		return {
			templateUrl : '/lotte/resources_dev/common/file_upload.html',
			replace : true,
			link : function($scope, el, attrs) {
				
				////////////////// 로컬 PHP 테스트
				////////////////// 실제 JSP 페이지로 변경할것
				var upload_path = "http://10.149.132.91/test/upload/upload.php";
            	
				$scope.filepath = ["", "", ""];
				
				var extensions = ["jpg", "jpeg", "png", "gif"];
				var fu_form = el.find("form.fu_form");
				var fu_file = el.find("input.fu_file");
				var currentIndex = -1;

				
				/**
				 * 디렉티브 시작
				 */
				function startOver(){
					fu_file.unbind("change", uploadFile);
					fu_file.bind("change", uploadFile);
				};
				
				/**
				 * 파일 선택하기
				 */
				$scope.selectFile = function(idx){
					currentIndex = idx;
					fu_file.trigger("click");
				};
				
				/**
				 * 파일 제거하기
				 */
				$scope.delectFile = function(idx){
					$scope.filepath[idx] = "";
				};
				
				/**
				 * 파일 확장자 체크하기
				 */
				function checkExtension(path){
					var idx = path.lastIndexOf(".");
					if(idx < 0){ return false; }
					
					var ext = path.substr(idx + 1);
					return (extensions.indexOf(ext) >= 0);
				};
				
				/**
				 * 업로드하기
				 */
				function uploadFile(){
					var path = fu_file.val();
					if(path == ""){ return; }
					if(!checkExtension(path)){
						$scope.alert_2016("지원하지 않는 파일 형식입니다.");
						return;
					}
					
					var formData = new FormData(fu_form.get(0));
					$.ajax({
			            url: upload_path,
			            method: 'POST',
			            type:"json",
			            xhr: function() {
			                var myXhr = $.ajaxSettings.xhr();
			                return myXhr;
			            },
			            success: uploadSuccess,
			            error: uploadError,
			            data: formData,
			            cache: false,
			            contentType: false,
			            processData: false
			        });
				};
				
				/**
				 * 업로드 성공
				 */
				function uploadSuccess(data){
	            	//var json = JSON.parse(data);
					if(typeof(data) == "string"){ data = JSON.parse(data); }
	            	$scope.filepath[currentIndex] = data.path;
	            };
	            
	            /**
	             * 업로드 에러
	             */
	            function uploadError(){
	            	$scope.alert_2016("파일을 전송하지 못했습니다.<br/>잠시 후 다시 시도해 주세요.");
	            };
	            
	            
	            startOver();
				
			}// link
		};
	}]);
})(window, window.angular);