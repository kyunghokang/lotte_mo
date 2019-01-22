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

    app.controller('EventSaunListCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'commInitData', function($scope, $http, $window, $timeout, LotteCommon, LotteUtil, commInitData) {
    	
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "구매사은신청"; //서브헤더 타이틀
        
        $scope.loginAlertFlag = false; // 로그인 창         
        $scope.allEventViewFlag = true; // 전체이벤트
        $scope.myEventViewFlag = false; // 내 레이어
        
        $scope.allEventList = [];
        $scope.myEventList = [];
        $scope.saunList_tot_cnt= 0;
        $scope.isShowLoadingImage = true;
        $scope.TopeventList = false;
        
        // 응모내역 data url
        var eventSaunListData = LotteCommon.eventSaunListData;
        
        $scope.selectOptionList = [];
   		$scope.selectOptionList.selected = "ALL";
        $scope.selectOptionList.push({text:'전체',val:'ALL'});
        $scope.selectOption = "ALL";
        $scope.myOption = "";
        
        // Data Load
        $scope.getSaunDataLoad = function() {
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
	        $http.get(eventSaunListData)
	        .success(function(data) {
	        	// maxData
	        	$scope.maxData = data;
	        	$scope.eventList_view = false; //추천구매사은이벤트 여부
	        	$scope.EventList = data.saunList.saun_list.items;
	        	for(var i=0; i<$scope.EventList.length; i++){
	        		if($scope.EventList[i].pur_ae_fvr_exp_yn == 'Y'){
	        			$scope.eventList_view = true;
	        		}
	        	}
	        	
	       		// 이벤트 총 개수
	       		$scope.totalEvent = data.saunList.saun_list.total_count;
	        	// 행사목록 리스트
	       		$scope.selectOptionList = [];
	       		$scope.selectOptionList.selected = "ALL";
	       		
	       		$scope.selectOptionList.push({text:'전체',val:'ALL'});
	       		    		
	       		
	       		
	       		// 카드리스트 중복 제거
	       		var card_list_tmp = new Array();
	       		var card_dup_check = false;
	       		var card_list_tmpe_cnt = 0;
	       		if (data.saunList.card_list.items != null){
	       			for(var i=0; i < data.saunList.card_list.total_count; i++){
	       				var item = data.saunList.card_list.items[i];
	       				if(!card_list_tmp.length) {
	       					card_list_tmp[card_list_tmpe_cnt] = {text:item.evtCdNm,val:item.evtCd};
	       				} else {
	       					card_dup_check = false;
		       				for(var j=0; j < card_list_tmp.length; j++) {
		       					if(card_list_tmp[j]["val"] == item.evtCd) {
		       						card_dup_check = true;
		       					}
		       				}
		       				if(!card_dup_check) {
		       					card_list_tmpe_cnt += 1;
		       					card_list_tmp[card_list_tmpe_cnt] = {text:item.evtCdNm,val:item.evtCd};
		       				}
		       				
	       				}
		       		}
	       			
	       			for(var i=0; i < card_list_tmp.length; i++){
	       				var item = card_list_tmp[i];
	       				if (item.val != ''){
	       					$scope.selectOptionList.push({text:item.text,val:item.val});
	       				}
		       		}
	       		}
	       		/*
	       		if (data.saunList.card_list.items != null){
	       			for(var i=0; i < data.saunList.card_list.total_count; i++){
	       				var item = data.saunList.card_list.items[i];
	       				if (item.evtCd != ''){
	       					$scope.selectOptionList.push({text:item.evtCdNm +'카드',val:item.evtCd});
	       				}
		       		}
		       		//$scope.selectOptionList.push({text:'기타행사',val:'999'});
	       		}
	       		*/
	       		
	            $scope.saunList_tot_cnt= data.saunList.saun_list.total_count;
	            
	            $scope.currentTotal = data.saunList.saun_list.total_count;
	            $scope.moreList($scope.currentStart, $scope.PageSize, $scope.selectOption );
	            
	            $scope.isShowLoadingImage = false;
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
        $scope.currentStart = 0;
        $scope.currentTotal = 0;
        
        $scope.page_end = 0;
        $scope.thisPage = 0;
        $scope.PageSize = 10;
        $scope.getSaunDataLoad();
        
        // 나의 신청 내역 탭 열기
        if(commInitData.query.myevent){
        	$timeout(function(){
				$scope.myEventClick();
			}, 300);
        }
        
        // 이벤트 전체 보기 클릭
        $scope.allEventClick = function(){
        	$scope.allEventViewFlag = true;
        	$scope.myEventViewFlag = false;
        	$scope.loginAlertFlag = false;
        	
        	$scope.currentStart = 0;
            $scope.currentTotal = $scope.saunList_tot_cnt;
            $scope.allEventList = [];
            $scope.moreList($scope.currentStart, $scope.PageSize, $scope.selectOption );
        };
        
        // 나의 신청내역 클릭
        $scope.myEventClick = function(){
        	$scope.isShowLoadingImage = true;
        	
        	$scope.currentStart = 0;
            $scope.currentTotal = 0;
            
        	if($scope.loginInfo.isLogin){
            	$http.get(eventSaunListData)
                .success(function(data) {
                	// 이벤트 리스트
                	if (data.saunList.mysaun_list.total_count > 0){
                		$scope.myEventList = data.saunList.mysaun_list.items;
                	}
                	// 행사목록 리스트
                	$scope.myOptionList = data.saunList.mysaun_list.items;
               		// 이벤트 총 개수
               		$scope.myTotalEvent = data.saunList.mysaun_list.total_count;
               		
               		$scope.currentStart = 0;
                    $scope.currentTotal = data.saunList.mysaun_list.total_count;
                    $scope.isShowLoadingImage = false;
                })
                .error(function(data, status, headers, config){
                    console.log('Error Data : ', status, headers, config);
                    $scope.myTotalEvent = 0;
                });
            	
        		$scope.allEventViewFlag = false;
            	$scope.myEventViewFlag = true;
            	$scope.loginAlertFlag = false;

        	} else {
        		$scope.myEventList = [];
        		$scope.loginAlertFlag = true;
        		$scope.allEventViewFlag = false;
            	$scope.myEventViewFlag = true;
            	
            	$scope.goLoginClick(1);
        	}
        };
        
        // 이벤트 상세보기 이동 Click
        $scope.goEvnetMainClick = function(evt_no) {
       		$window.location.href = LotteCommon.eventSaunMain + "?" + $scope.baseParam + "&evt_no=" + evt_no;	
        }
        
        // 로그인 클릭
        $scope.goLoginClick = function(myevent) {
    		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href + ( myevent ? '&myevent=' + myevent : '' ), 'UTF-8');
        	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
        }
        
        
                
        // 카드 선택 셀박 클릭
        $scope.eventOptionClick = function(eventOption) {
        	$scope.eventOptionData = eventOption;
        	$scope.selectOption = eventOption;
        	$scope.allEventList = [];
        	var listCnt = 0;
        	for(var i=0; i < $scope.maxData.saunList.saun_list.total_count; i++){
        		var item = $scope.maxData.saunList.saun_list.items[i];
        		
        		/*
        		if (eventOption == '999'){
        			var isData = false;
        			if ($scope.selectOptionList != null){
    	       			for(var j=0; j < $scope.selectOptionList.length; j++){
    	       				var subItem = $scope.selectOptionList[j];
    	       				if (subItem.val == item.evtCrcmCd){
    	       					isData = true;
    	       					break;
    	       				}
    		       		}
    	       		}
        			if (!isData){
        				listCnt = listCnt + 1;
        			}
        		} else
        		*/ 
        		if (eventOption == 'ALL'){
        			listCnt = listCnt + 1;
        		} else {
        			if (item.evtCrcmCd == eventOption){
        				listCnt = listCnt + 1;
	        		}
        		}
        		
        	}
            //$scope.saunList_tot_cnt= $scope.allEventList.length;
        	
        	$scope.currentStart = 0;
        	$scope.saunList_tot_cnt = listCnt;
            $scope.currentTotal = $scope.saunList_tot_cnt;
            $scope.moreList($scope.currentStart, $scope.PageSize, $scope.selectOption );
            
        }
        
        // 카드 선택 셀박 클릭
        $scope.myOptionClick = function(myOption) {
//        	$scope.myOptionData = myOption;
        	$scope.myOption = myOption;
        	$scope.myEventList = []; 
        	var listCnt = 0;
        	
        	for(var i=0; i < $scope.maxData.saunList.mysaun_list.total_count; i++){
        		var item = $scope.maxData.saunList.mysaun_list.items[i];
        		if (myOption == ''){
        			listCnt = listCnt + 1
        		} else {
        			if (item.eventStatus == myOption){
        				listCnt = listCnt + 1
	        		}
        		}
        	}
            $scope.currentStart = 0;
            $scope.currentTotal = listCnt;
            $scope.moreMyList($scope.currentStart, $scope.PageSize, $scope.myOption );
        }
        
        // 더보기
        $scope.moreListClick = function() {
        	$scope.moreList($scope.currentStart, $scope.PageSize, $scope.selectOption );
        }
        
        // 더보기
        $scope.moreList = function(pageStart, pageSize, eventOption) {
        	$scope.eventOptionData = eventOption;
        	for(var i=pageStart; i < $scope.maxData.saunList.saun_list.total_count && i < (pageStart+pageSize); i++){
        		var item = $scope.maxData.saunList.saun_list.items[i];
        		/*
        		if (eventOption == '999'){
        			var isData = false;
        			if ($scope.selectOptionList != null){
    	       			for(var j=0; j < $scope.selectOptionList.length; j++){
    	       				var subItem = $scope.selectOptionList[j];
    	       				if (subItem.val == item.evtCrcmCd){
    	       					isData = true;
    	       					break;
    	       				}
    		       		}
    	       		}
        			if (!isData){
        				$scope.allEventList.push(item);
        			}
        		} else
        		*/
        		if (eventOption == 'ALL'){
        			$scope.allEventList.push(item);
        		} else {
        			if (item.evtCrcmCd == eventOption){
	        			$scope.allEventList.push(item);
	        		}
        		}
        	}
        	$scope.currentStart = $scope.currentStart + $scope.PageSize;
        }
        
        // 더보기
        $scope.moreMyListClick = function() {
        	$scope.moreMyList($scope.currentStart, $scope.PageSize, $scope.myOption );
        }
        
        // 더보기
        $scope.moreMyList = function(pageStart, pageSize, myOption) {        	
    		for(var i=pageStart; i < $scope.maxData.saunList.mysaun_list.total_count && i < (pageStart+pageSize); i++){
        		var item = $scope.maxData.saunList.mysaun_list.items[i];
        		if (myOption == ''){
        			$scope.myEventList.push(item);
        		} else {
        			if (item.eventStatus == myOption){
	        			$scope.myEventList.push(item);
	        		}
        		}
        	}
        	$scope.currentStart = $scope.currentStart + $scope.PageSize;
        }
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/event/m/eventSaunList_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    
    app.filter('strToDate', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"."+item.substr(5,2)+"."+item.substr(8,2);	
    		}
    	}
    }]);
    
    app.filter('strToDate2', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"."+item.substr(4,2)+"."+item.substr(6,2);	
    		}
    	}
    }]);
    
})(window, window.angular);
