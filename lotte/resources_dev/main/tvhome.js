(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteProduct',
        'timer'
    ]);
    app.filter('titleToHtml', function() {
		return function(title) {
			if (title == null){return '';}
			var newTitle = "";
			
			newTitle = title.split('<!HS>').join('<STRONG>');
			newTitle = newTitle.split('<!HE>').join('</STRONG>');
			return newTitle;
		}
	});
    app.filter('strToDateArr', [function() {
        return function(item) {
        	var timearr = [];
        	if(item != null) {
	            var remaketime = item.substr(0,4)+"-"+item.substr(4,2)+"-"+item.substr(6,2)+"-"+item.substr(8,2)+"-"+item.substr(10,2)+"-"+item.substr(12,2);
	            timearr = remaketime.split("-");
        	}
            return timearr;
        }
    }]);
    
    app.filter('onAirLeftTime', ['$filter', function($filter) {
        return function(etime) {
        	if(etime != null) {
	            var etime = $filter('strToDateArr')(etime);
	            var eDate = new Date(parseInt(etime[0]),parseInt(etime[1])-1,parseInt(etime[2]),parseInt(etime[3]),parseInt(etime[4]),parseInt(etime[5]),0);
	            return eDate.getTime()/1000;
        	}
        	return 0;
        }
    }]);
    
    
    app.controller('TvHomeCtrl', ['$window','$scope','$http','$timeout','$filter', '$location','LotteCommon', 'commInitData', 'LotteStorage', function($window,$scope,$http,$timeout,$filter,$location, LotteCommon,commInitData, LotteStorage) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.screenID = "TvHome";
        $scope.subTitle = "홈쇼핑";
        $scope.templateType = "tvhome";
        $scope.timerRunning = true;
        
        /*
         * 스크린 데이터 초기화
         */
        
        ($scope.screenDataReset = function() {
            $scope.pageOptions = {
            	today: '',
            	hasPrevious: false,
                homeTabFlag: 1,
                calendarIdx: 0,
                selected_date: "",
                selected_disp_no: '0',
                onAirCountdown: 0,
                showBeforeTvHome: false
            }
            $scope.screenData = {
                page: 0,
                totalProducts: 0,
                tv_home_calendar: [],
                tv_home_banner_list: [],
                tv_home_best_prod_list: [],
                tv_home_onair: [],
                tv_home_program_list: []
            }
        })();
        
        var d = new Date();
        var mm = (d.getMonth()+1)<10 ? "0"+(d.getMonth()+1):(d.getMonth()+1);
        var dd = d.getDate()<10 ? "0"+d.getDate():d.getDate();
        $scope.pageOptions.today = d.getFullYear()+""+mm+""+dd;
        
        $scope.pageOptions.selected_date = $scope.pageOptions.today;
        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['homeTabFlag'] != undefined) {
            $scope.pageOptions.homeTabFlag = parseInt(commInitData.query['homeTabFlag']);
        }
        
        $scope.buildSearchUrl = function() {
//          3. URL : http://molocal.lotte.com/json/main/tv_home_onair_prod_list.json?selected_date=20151001&selected_disp_no=5080601
//          4. 파라미터
//               - selected_date: 날짜
//               - selected_disp_no: 전시번호
            var url = LotteCommon.tvHomeOnAirData+"?"+$scope.baseParam;

            if($scope.pageOptions.selected_date != "") {
                url += "&selected_date="+$scope.pageOptions.selected_date;
            }
            if($scope.pageOptions.selected_disp_no != '0') {
                url += "&selected_disp_no="+$scope.pageOptions.selected_disp_no;
            }
            return url;
        }
        
        $scope.findToday = function() {
            for(var i=0;i < $scope.screenData.tv_home_calendar.length;i++) {
                $scope.pageOptions.calendarIdx = i;
                if($scope.screenData.tv_home_calendar[i].today_yn) {
                    break;
                }
            }
        }
        
        $scope.getTvHomeCalendar = function() {
            try {
                $http.get(LotteCommon.tvHomeCalendarData)
                .success(function(data) {
                    $scope.screenData.tv_home_calendar = data.tv_home_calendar.items;
                    $scope.findToday();
                    $timeout(function() {
                        $scope.moveMenuSwipeFnc($scope.pageOptions.calendarIdx, false);
                    },300);
                })
                .error(function() {
                });
            } catch(e) {}
        }

        $scope.getTvHomeBanner = function() {
            try {
                $http.get(LotteCommon.tvHomeBannerData)
                .success(function(data) {
                    $scope.screenData.tv_home_banner_list = data.tv_home_banner_list.items;
                })
                .error(function() {
                });
            } catch(e) {}
        }
        
        $scope.getTvHomeData = function() {
            $scope.screenData.page++;
            $scope.productListLoading = true;
            $scope.$parent.LotteSuperBlockStatus = true;
            try {
                $http.get($scope.buildSearchUrl())
                .success(function(data) {
                	$scope.screenData.totalProducts = 0;
                    $scope.screenData.tv_home_onair = data.tv_home_onair_prod_list.onair;
                    $scope.screenData.tv_home_program_list = data.tv_home_onair_prod_list.program_list.items;
                    angular.forEach($scope.screenData.tv_home_program_list, function(val) {
                    	$scope.screenData.totalProducts += val.prod_list.items.length;
                    	if(val.previous) {
                    		$scope.pageOptions.hasPrevious = true;
                    	}
                    });
                    
                    $scope.screenData.totalProducts += $scope.screenData.tv_home_onair.prod_list.items.length;
                    
                    $scope.getOnAirTimeLess();
                    $scope.productListLoading = false;
                    $scope.$parent.LotteSuperBlockStatus = false;
                })
                .error(function() {
                    $scope.productListLoading = false;
                    $scope.$parent.LotteSuperBlockStatus = false;
                });
            } catch(e) {
                $scope.$parent.LotteSuperBlockStatus = false;
            }
        }
        
        $scope.getTvHomeBestData = function() {
        	$scope.screenData.page++;
        	$scope.productListLoading = true;
        	$scope.$parent.LotteSuperBlockStatus = true;
        	try {
	        	$http.get("/json/main/tv_home_best_prod_list.json")
	        	.success(function(data) {
        			$scope.screenData.tv_home_best_prod_list = data.tv_home_best_prod_list.items;
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	})
	        	.error(function() {
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	});
        	} catch(e) {
        		$scope.$parent.LotteSuperBlockStatus = false;
        	}
        }
        
        $scope.getOnAirTimeLess = function() {
            $scope.screenData.onAirCountdown = $filter('onAirLeftTime')($scope.screenData.tv_home_onair.bdct_end_dtime)*1000;
            console.log($scope.screenData.onAirCountdown);
        }
        
        $scope.reSearch = function() {
            $scope.screenData.page = 0;
            $scope.getTvHomeData();
        }
        
        
        // 세션에서 가저올 부분 선언 
        //
        //
        var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
        var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');
        
        if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
        	var StoredData = JSON.parse(StoredDataStr);
    		$scope.pageLoading = false;
    		
        	$scope.pageOptions = StoredData.pageOptions;
        	$scope.screenData = StoredData.screenData;
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        } else {
        	$scope.getTvHomeCalendar();
            $scope.getTvHomeBanner();
            $scope.getTvHomeData();
            $scope.getTvHomeBestData();
        }
        
        /**
         * unload시 관련 데이터를 sessionStorage에 저장
         */
        angular.element($window).on("unload", function(e) {
            var sess = {};
            
            sess.pageOptions = $scope.pageOptions;
            sess.screenData = $scope.screenData;
            if (!commInitData.query.localtest && $scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
	            LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
            }
        });
    }]);

    app.directive('lotteContainer',['$timeout', 'LotteCommon', function($timeout,LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/main/tvhome_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                /*
                 * 배너 클릭 
                 */
                $scope.tvHomeBannerClick = function(item) {
                	 window.location.href = item.img_lnk_nm+((item.img_lnk_nm.indexOf("?")!=-1)?"&":"?")+$scope.baseParam+"&tclick=m_DC_TVsub_Clk_Ban_0"+(this.$index+1);
                }
                
                /*
                 * 
                 */
                $scope.tvHomeTabClick = function(idx) {
                    $scope.sendTclick("m_DC_TVsub_Clk_tap_" + idx);
                    $scope.pageOptions.homeTabFlag = idx;
                }
                
                /*
                 * 요일 변경
                 */
                $scope.programChangeDate = function(item,idx) {
                	//console.log($scope.pageOptions.selected_date +"   "+ $scope.pageOptions.today);
                    var tidx = idx + 1;
                    if(tidx < 10){
                        tidx = "0" + idx;
                    }
                    $scope.sendTclick("m_DC_TVsub_SwpW_Rst_" + tidx);
                    $scope.pageOptions.selected_date = item.yyyymmdd;
                    $scope.pageOptions.calendarIdx = idx
                    $scope.reSearch();
                    $timeout(function() {
                        $scope.moveMenuSwipeFnc($scope.pageOptions.calendarIdx, false);
                    },50);
                }
                
                /*
                 * 
                 */
                $scope.showBeforeTvHome = function() {
                    $scope.sendTclick("m_DC_TVsub_Clk_Btn_1");                    
                    if($scope.pageOptions.showBeforeTvHome) {
                        $scope.pageOptions.showBeforeTvHome = false;
                    } else {
                        $scope.pageOptions.showBeforeTvHome = true;
                    }
                }
                
                $scope.getProductImage = function(item) {
                	var url = item.img_url;
                	if(url != null) {
						url = url.replace("60.jpg","280.jpg");
					}
                	return url;
                }
                
                $scope.changeProductList = function() {
                    $scope.reSearch();
                    $scope.getTvHomeData();
                }
                
                $scope.productInfoClick = function(item, mode) {
                    if($scope.pageOptions.homeTabFlag == 1){
                        if(mode == undefined){
                            mode = "";
                        }else if(mode == "Z"){ //오늘이 아닌경우
                            if($(".tvDate").find("li.today").index() > $scope.pageOptions.calendarIdx){ //이전
                                mode = "A";
                            }else{//다음
                                mode = "C";
                            }
                        }
                        var pidx = this.$parent.$index;
                        if(pidx == undefined){
                            pidx = "_onair";
                        }else{
                            pidx = pidx + 1;
                            if(pidx < 10){
                                pidx = "0" + pidx;
                            }                                
                        }
                        
                        var tidx = this.$index + 1;
                        if(tidx < 10){
                            tidx = "0" + tidx;
                        }        
                        
                        if(pidx != NaN){
                            tidx = pidx + "_" + tidx;
                        }
                        
                        var tclickstr = "m_DC_TVsub_Clk_Prd_" + mode + tidx;
                        //console.log(tclickstr);
                        window.location.href = LotteCommon.prdviewUrl + "?" + $scope.$parent.baseParam + "&goods_no=" + item.goods_no + "&tclick=" + tclickstr;                        
                    }
                }
            }
        };
    }]);

})(window, window.angular);