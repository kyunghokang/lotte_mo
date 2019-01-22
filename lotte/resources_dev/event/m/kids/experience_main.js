(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteSns'
    ]);

    app.controller('ExperienceMainCtrl', ['$http', '$scope', 'LotteCommon', function($http, $scope, LotteCommon) {
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "유아동 체험단"; //서브헤더 타이틀
        $scope.pageLoading = false;  
        $scope.isShowThisSns = true; /*공유버튼*/
        $scope.ingEventViewFlag = true; // 체험단 신청
        $scope.endEventViewFlag = false; //체험단 후기
        
        $scope.ingEventList = [];
        $scope.endEventList = [];        
        $scope.end_tot_cnt= 0;
        $scope.TopeventList = false;
        
        // 이벤트 리스트 data url
        var getExperienceListData = LotteCommon.kidsExperienceMainData;
        
        // Data Load
        $scope.loadScreenData = function() {
            console.log("스크린 데이터 로드...");     
        	$scope.pageLoading = true;
        	
	        $http.get(getExperienceListData)
	        .success(function(data) {
	        	// maxData
	        	$scope.maxData = data;
	        	$scope.EventList = data.end_list.items;
	        	$scope.ingEventList = data.ing_list.items;
	        	$scope.evtFaqList = data.evt_faq.items;
	        	
	       		// 이벤트 총 개수 
	            $scope.end_tot_cnt= data.end_list.total_count;	            
	            $scope.currentTotal = data.end_list.total_count;
	            
	            // 당첨날짜 가공처리 가공처리
				for(var i=0; i<data.end_list.items.length; i++){
					data.end_list.items[i].evt_strt_dtime =  data.end_list.items[i].evt_strt_dtime.split("2017").join('17');
					data.end_list.items[i].evt_strt_dtime =  data.end_list.items[i].evt_strt_dtime.split("2016").join('16');
					data.end_list.items[i].evt_end_dtime =  data.end_list.items[i].evt_end_dtime.split("2017").join('17');
					data.end_list.items[i].evt_end_dtime =  data.end_list.items[i].evt_end_dtime.split("2016").join('16');
					data.end_list.items[i].winner_dtime =  data.end_list.items[i].winner_dtime.split("2017").join('17');
					data.end_list.items[i].winner_dtime =  data.end_list.items[i].winner_dtime.split("2016").join('16');
					
				}
	            
	            $scope.pageLoading = false;
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	            $scope.pageLoading = false;
	        });
        }      
        
        $scope.loadScreenData();
        
        
        // 체험단 신청 클릭
        $scope.ingEventClick = function(){  
    		$scope.endEventViewFlag = false;
        	$scope.ingEventViewFlag = true;
        	$scope.sendTclick("m_DC_KidsEventList_Clk_Tap01");
        };       
        
        
        
        // 체험단 후기 신청 클릭
        $scope.endEventClick = function(){        	
        	$scope.currentStart = 0;
            $scope.currentTotal = 0;        
            $scope.page_end = 0;
            $scope.thisPage = 0;
            $scope.PageSize = 5;
        	
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
        	$scope.endEventViewFlag = true;
        	$scope.ingEventViewFlag = false;        	
        	$scope.currentStart = 0;
            $scope.currentTotal = $scope.end_tot_cnt;
            $scope.endEventList = [];            
            $scope.moreList($scope.currentStart, $scope.PageSize);
            $scope.sendTclick("m_DC_KidsEventList_Clk_Tap02");
        };
        
        // 더보기
        $scope.moreListClick = function() {
        	$scope.moreList($scope.currentStart, $scope.PageSize);
        	$scope.sendTclick("m_DC_KidsEventList_Clk_Btn_G");
        }
        $scope.moreList = function(pageStart, pageSize) {
        	for(var i=pageStart; i < $scope.maxData.end_list.total_count && i < (pageStart+pageSize); i++){
        		var item = $scope.maxData.end_list.items[i];
        		$scope.endEventList.push(item);
        	}
        	$scope.currentStart = $scope.currentStart + $scope.PageSize;
        }
        
    }]);

    app.directive('lotteContainer', ['$http','LotteCommon','$window', function($http,LotteCommon,$window) {
        return {
            templateUrl : '/lotte/resources_dev/event/m/kids/experience_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	//FAQ 아코디언
				$scope.faqIdx=-1;
				$scope.faqAccordion = function(i){
					if($scope.faqIdx==i) $scope.faqIdx=-1;
					else $scope.faqIdx=i;
				}
				$scope.ProductClick = function(no, tclick) {
					var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + no + "&curDispNoSctCd=12";
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
				
		        // 이벤트 상세보기 이동 Click
		        $scope.goEvtViewClick = function(evt_no, tclick) {
		        	var url = LotteCommon.kidsExperienceDetailUrl + "?" + $scope.baseParam + "&evt_no=" + evt_no;	
		       		if (tclick) {
						url += "&tclick=" + tclick;
					}
		       		$window.location.href = url;
		        }		        
		        
		        // 체험단 후기 작성
		        $scope.getCommentWriteUrl = function(evt_no, goods_no, tclick) {
		        	if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;   
        			}  else{
        				$http.get(LotteCommon.kidsExperiencePrizewinnerData + "?" + "&evt_no=" + evt_no)
        		        .success(function(data) {
        		        	if(data.winner_yn == "Y"){
        		        		var url = LotteCommon.kidscommentWriteUrl + "?" + $scope.baseParam + "&isKids=Y" + "&evt_no=" + evt_no+ "&goods_no=" + goods_no + "&isKidsApp=Y";
								if (tclick) {
									url += "&tclick=" + tclick;
								}
					       		$window.location.href = url;
							} else if(data.winner_yn == "N" || data.winner_yn == ""){
								alert('체험단 당첨자인 경우에만 작성하실 수 있습니다');
							}
        		        })	
		        	}
		        }
		        
		        // 이벤트 당첨자발표 이동 Click
		        $scope.goEvtWinnerClick = function(evt_no, tclick) {
		        	var url = LotteCommon.kidsExperienceWinnerUrl + "?" + $scope.baseParam + "&evt_no=" + evt_no;	
		       		if (tclick) {
						url += "&tclick=" + tclick;
					}
		       		$window.location.href = url;
		        }
		        
		        // FAQ 이동
		        $scope.goFaq = function () {
					$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
						setTimeout(function () {
							$('body').animate({"scrollTop":$(".evt_faq").position().top - 45}, 0);
						}, 1);
					});
					$scope.sendTclick("m_DC_KidsEventList_Clk_Btn_A");
				};
            }
        };
    }]);
    app.filter('strToDate', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"."+item.substr(4,2)+"."+item.substr(6,2);	
    		}
    	}
    }]);
    /* 체험단 후기신청 */
    app.filter('strToDate_end', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,2)+"."+item.substr(2,2)+"."+item.substr(4,2);	
    		}
    	}
    }]);
    
})(window, window.angular);
