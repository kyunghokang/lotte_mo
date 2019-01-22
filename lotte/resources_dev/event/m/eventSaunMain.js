(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteUtil',
        'lotteSns'
    ]);

    app.controller('EventSaunMainCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon', 'LotteUtil', '$filter', function($scope, $http, $window, $timeout, LotteCommon, LotteUtil, $filter) {
    	
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "구매사은신청"; //서브헤더 타이틀
        $scope.isShowThisSns = true; /*공유버튼*/

        $scope.loginAlertFlag = false; // 로그인 경고창         
        $scope.allEventViewFlag = true; // 전체이벤트
        $scope.myEventViewFlag = false; // 내 대상내역
        $scope.eventInfoLoading = true;
        $scope.joinEvetClickTitle = "신청하기";
        $scope.joinEvetClickFlag = true;
        $scope.eventInfo = [];
        $scope.share_img = "";
        $scope.isShowLoadingImage = true;
        
        //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    	$scope.evtNoParam = getParameterByName('evt_no'); 

        
        // 응모상세 data url
        var eventSaunMainData = LotteCommon.eventSaunMainData + "?evt_no=" + $scope.evtNoParam;
        
        // 전체 이벤트 데이터 가져오기
        $http.get(eventSaunMainData)
        .success(function(data) {
        	// 이벤트 정보
        	$scope.eventInfo = data.saun;
        	// 이벤트 신청 정보 리스트
        	$scope.eventInfoList = data.saun.fvr_info_list.items;

        	//
        	$scope.eventInfoLoading = false;
        	//
        	$scope.joinButtonCheck($scope.eventInfo.fvrPolcStrtAmt, $scope.eventInfo.totalAmount);
        	//console.log($scope.eventInfoList)
        	$scope.isShowLoadingImage = false;
        })
        .error(function(data){
        	$scope.eventInfoLoading = false;
        	$scope.isShowLoadingImage = false;
            console.log('Error Data : ');
        });
        
        // 공유
        $timeout(function() {
        	$scope.share_img = $scope.eventInfo.evtDtlImg1PathNm + $scope.eventInfo.evtDtlImg1FileNm;
        },2000);
        
        $scope.evtFvrTpTitle = function(evtFvrTpCd) {
        	if(evtFvrTpCd != null ) {
	        	switch(evtFvrTpCd) {
	    		case "10" :
	    			return "L.POINT";
	    			break;
	    		case "20" :
	    			return "L-money";
	    		default :
	    			//return $scope.eventInfo.etcGoodNm;
	    			return "혜택";
	    			break;
	        	}
        	} else {
        		return "L.POINT";
        	}
        }
        
        $scope.evtFvrTpValue = function(evtFvrTpCd) {
        	if(evtFvrTpCd != null ) {
	        	switch(evtFvrTpCd) {
		    		case "10" :
		    			return $filter('number')($scope.eventInfo.totalSaun);
		    			break;
		    		case "20" :
		    			return $filter('number')($scope.eventInfo.totalSaun);
		    			break;
		    		default :
		    			return $scope.eventInfo.etcGoodNm;
		    			break;
	        	}
        	} else {
        		return $filter('number')($scope.eventInfo.totalSaun);
        	}
        	
        }
        // 로그인 클릭
        $scope.goLoginClick = function() {
        	var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
        	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
		}
        
        $scope.myListClick = function(evtNo) {
            $scope.myEventViewFlag = true; // 내 대상내역

        	$scope.evtNo = evtNo;
			var evtNo = $scope.evtNo;
			$scope.totalMyAmount = 0;
			$scope.eventMyist = [];
			
        	var eventMyData = LotteCommon.eventSaunDetailData + "?evt_no=" + evtNo;
            
            // 전체 이벤트 데이터 가져오기
            $http.get(eventMyData)
            .success(function(data) {
            	// 이벤트 신청 정보 리스트
            	if (data.saunApplyList != null){
            		var totalAmount = 0;
            		for(var i=0; i < data.saunApplyList.total_count; i++){
            			var item = data.saunApplyList.items[i];
            			item.evtNo = i;
            			if (item.ordApplyPayAmt > 0){
	            			totalAmount = totalAmount + item.ordApplyPayAmt;
	                    	$scope.eventMyist.push(item);
            			}
            		}
            		$scope.totalMyAmount = totalAmount;
            		
            		//$scope.joinButtonCheck($scope.eventInfo.fvrPolcStrtAmt, $scope.totalMyAmount);
            	}
            })
            .error(function(data, status, headers, config){
            	$scope.joinEvetClickFlag = true;
                console.log('Error Data : ', status, headers, config);
            });
            
			$scope.dimmedOpen({
				target : "myList",
				callback: this.myListClose
			});
			
        }
        
        //
        $scope.joinButtonCheck = function(minAmt, myAmt) {
        	if(myAmt < minAmt) {
        		$scope.joinEvetClickTitle = "대상 결제 금액이 부족합니다.";
        		$scope.joinEvetClickFlag = false;
        	} else {
        		$scope.joinEvetClickTitle = "신청하기";
        		$scope.joinEvetClickFlag = true;
        	}
        }
        
        //hide show box
        $scope.myListClose = function(){
            $scope.myEventViewFlag = false;
    		$scope.dimmedClose();
        }
        
        // TODO 이벤트 신청 클릭
        $scope.joinEventClick = function(evtNo){
        	// LOGIN CHECK
        	if(!$scope.loginInfo.isLogin){
        		alert("로그인 후 응모가능합니다.");
        		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
            	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
        	} else {
        		if($scope.joinEvetClickFlag) {
	        		// 신청기간 check
	            	if($scope.eventInfo.eventStatus == 'N'){
	            		alert("신청기간이 아닙니다.");
	            	} else {
	                	// 응모여부 check
	                	if($scope.eventInfo.areadyEnter == "Y"){
	                		alert("이미 응모한 이벤트입니다.");	
	                	} else {
	                    	// 결제금액 check
	                		if($scope.eventInfo.enterPossible == "N"){
	                			alert("이벤트 응모 대상이 아닙니다.");	
	                		} else {
	                			// 응모처리
	                			$http({
	                				url : "/json/event/regist_saun.json?evt_no=" + evtNo,
	                				method : 'POST',
	                				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
	                			}) // AJAX 호출
	                			.success(function (data, status, headers, config) { // 호출 성공시
	                				console.log(data.data_set.response_msg);
	                				console.log(status);
	                				alert(data.data_set.response_msg);
				        			$window.location.href = LotteCommon.eventSaunMain + "?evt_no=" + evtNo;
	                				/* if(data.data_set.response_msg == '신청이 완료되었습니다.'){	        
	                					$(".price_range > span a").text("신청완료");
	                				} */
	                			})
	                			.error(function (data, status, headers, config) { // 호출 실패시
	                				alert("error");
	                			});
	                			
	                		}
	                	}
	            	}
        		}
        	}
        }
        $scope.joinEventEndClick = function(){
        	alert("이미 응모한 이벤트입니다.");
        }
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/event/m/eventSaunMain_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    
    app.directive('myEventlist', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/event/m/eventMyMoney.html',
            replace:true,
            link:function($scope, el, attrs) {
            }
        };
    }]); 
    
    app.filter('strToDate', [function() {
    	return function(item) {
    		if(item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"/"+item.substr(4,2)+"/"+item.substr(6,2);	
    		}
    		
    	}
    }]);
    
    app.filter('strToDate2', [function() {
    	return function(item) {
    		if(item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"/"+item.substr(5,2)+"/"+item.substr(8,2);	
    		}
    		
    	}
    }]);
	
})(window, window.angular);
//TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseFailHandler = function(errorCallback) {
	alert('처리중 오류가 발생하였습니다.');
	if (errorCallback) errorCallback();
};

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
			var targUrl = 'targetUrl='+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};
