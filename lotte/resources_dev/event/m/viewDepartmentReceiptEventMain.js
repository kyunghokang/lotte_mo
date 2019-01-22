(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteUtil'
    ]);

    app.controller('ReceiptEventCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteUtil', function($scope, $http, $window, LotteCommon, LotteUtil) {
    	
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "영수증이벤트"; //서브헤더 타이틀
        $scope.departmentViewFlag = true; // 롯데백화점 영수증
        $scope.dotcomViewFlag = false; // 롯데닷컴 영수증
        $scope.checkMyEventViewFlag = false; // 나의응모내역확인하기 뷰
        $scope.recptNumber = null;
        
        $scope.onlyNumbers = /^\d+$/;
        
        // 응모내역 data url
        var receiptData = LotteCommon.recieptDataUrl;
        
        // 응모 iframe Url
        var receiptIframeUrl = LotteCommon.recieptIframeUrl;
        
        // 응모하기 가져오기 (사용백화점 리스트, 응모내역확인 리스트, 주문번호 리스트(응모내역포함)
        $http.get(receiptData)
        .success(function(data) {
        	// 영수증 데이터
        	$scope.receiptListData = data.receipt;
       		// Shop 데이터
       		$scope.shopListData = data.receipt.shop_list;
       		// 내역확인
       		$scope.resultRecieptListData = data.receipt.receipt_apply_list;
       		// 주문내역 리스트
       		$scope.orderListData = data.receipt.order_list;
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });
        
        // 롯데백화점 열기/닫기
        $scope.departmentClick = function () {
       		$scope.departmentViewFlag = true;
           	$scope.dotcomViewFlag = false;
        };
        
        // 롯데닷컴 주문번호 열기/닫기
        $scope.dotcomClick = function () {
    		$scope.departmentViewFlag = false;
        	$scope.dotcomViewFlag = true;
        };
        
        // 나의응모내역확인하기 열기
        $scope.checkMyEvent = function () {
    		$scope.checkMyEventViewFlag = true;
        };
        
        angular.isValue = function(recptNumber) {
      	  return !(recptNumber === null || !angular.isDefined(recptNumber) || (angular.isNumber(recptNumber) && !isFinite(recptNumber)));
        };
        
        // 영수증번호 응모하기 응모 (로그인만 체크 json call)
        // evt_no : 이벤트 번호, 
        $scope.receiptEventClick = function(recpt_no1, recpt_no2, recpt_no3, recpt_no4, evtShopNm) {
        	
        	$scope.recptNumber = recpt_no1+recpt_no2+recpt_no3+recpt_no4;
        	$scope.evtShopNm = evtShopNm;
			var recptNumbers = $scope.recptNumber;
			var evt_shop_sn = $scope.evtShopNm = evtShopNm 
			
			if(!angular.isDefined(evtShopNm)) {
				alert("사용백화점을 선택하셔야 합니다.")
			} else {
        	
	        	// 응모번호 null 입력 체크
	        	if (!angular.isDefined(recpt_no1) || !angular.isDefined(recpt_no2) || !angular.isDefined(recpt_no3) || !angular.isDefined(recpt_no4)) {
	        		alert("응모번호를 입력하셔야 합니다.");
	        		
	        	} else {
	        			
	    			// 응모번호 20자 체크
	    			if($scope.recptNumber.length != 20) {
	    				alert("응모번호를 20자로 입력하셔야 합니다.");	
	    			} else {
	    				
	    				//응모번호 등록
	    				//로그인체크
	    				if($scope.loginInfo.isLogin){
	    	        		
	    	        		$http({
	    	            		method: 'POST',
	    	            		url: LotteCommon.recieptVoteUrl + "?recpt_no=" + recptNumbers + "&evt_sbsc_path_cd=J560&recpt_evt_tgt_cd=31&ordList=&saveUrl=DEPT&evt_shop_sn=" + evt_shop_sn,
	    	            		data: {
	    	            			recptNumbers: recptNumbers
	    	            		},
	    	            		transformRequest: transformJsonToParam,
	    	            		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    	            	})
	    	            	
	    	        	} else {
	    	        		if (confirm('롯데 패밀리 회원 로그인 후 참여하실 수 있습니다.')) {
	    	            		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
	    	                	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
	    	    			} else {
	    	    				return false;
	    	    			}	    	        	}
	    			}
	        	}
			}

        };
        
        // 주문번호로 응모 (json call) 
        $scope.orderEventClick = function(orderNumber) {
        	$scope.orderNumber = "";
        	
        	var orderNo = $scope.orderNumber;
        	
        	if(!$scope.appObj.isIOS) {
        		alert('영수증 이벤트는 엘롯데 app에서 응모가 가능합니다.');
        		return false;
        	} else if (!$scope.appObj.isAndroid){
        		alert('영수증 이벤트는 엘롯데 app에서 응모가 가능합니다.');
        		return false;
        	}
        	
        	if($scope.loginInfo.isLogin){
        		
        		$http({
            		method: 'POST',
            		//url: LotteCommon.recieptVoteUrl + "?evt_no" + orderNo + "&mbr_no=",
            		url: LotteCommon.recieptVoteUrl + "?recpt_no&evt_sbsc_path_cd=J560&recpt_evt_tgt_cd=31&ordList=" + orderNumber + "&saveUrl=DEPT&evt_shop_sn=" + evt_shop_sn,

            		data: {
            			orderNo: orderNo
            		},
            		transformRequest: transformJsonToParam,
            		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            	})
            	
        	} else {
        		if (confirm('롯데 패밀리 회원 로그인 후 참여하실 수 있습니다.')) {
            		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
                	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
    			} else {
    				return false;
    			}        	}
        };
        
        // 나의 회원정보 수정
        $scope.myInfoChangClick = function() {
        	if($scope.loginInfo.isLogin){
        		$window.location.href = LotteCommon.changeMyInfoUrl  + 
				"?sid=NMELLOTTE" +
				"&returnurl=http%3A%2F%2Fm.ellotte.com%2Fmylotte%2Fm%2Fmyellotte.do%3Fc%3Dmlotte%26udid%3D%26v%3D%26cn%3D%26cdn%3D%26schema%3D%26tclick%3Dm_mylayer_mylotte" + 
				"&main_url=http%3A%2F%2Fm.ellotte.com%2Fmain.do%3Fc%3Dmellotte%26udid%3D%26v%3D%26cn%3D%26cdn%3D"+
				"&custid=Pyu/aLhm0OOuX6oFuZJM2qjhkToHASLCq2qN1101FpI=" +
				"&loginid=" + LotteCookie.getCookie('LOGINID')
				"&pageflag=I" + 
				"&opentype=P" +
				"&sch="
        	} else {
        		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
            	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
        	}        	
        }
        
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/event/m/viewDepartmentReceiptEventMain_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    
    app.directive('numericOnly', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : null;

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });
    
})(window, window.angular);

//TODO ywkang2 : Angular 공통 처리 필요
var transformJsonToParam = function(obj) {
	var str = [];
	
	for (var p in obj) {
		if (Array.isArray(obj[p])) {
			for(var i=0; i<obj[p].length; i++) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
			}
		} else {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}
	
	return str.join("&");
};