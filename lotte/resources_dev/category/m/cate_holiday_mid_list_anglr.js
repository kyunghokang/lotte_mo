(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe',
        'lotteMainPop'
    ]);

    app.controller('CateHolidayMidListCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productMoreScroll = true;
        $scope.screenID = "HolidaycateTpl";
        $scope.pageLoading = true; //페이지 첫 로딩
        $scope.subTitle = " ";

        LotteStorage.delSessionStorage('cateListLoc');
        LotteStorage.delSessionStorage('cateListData');
        LotteStorage.delSessionStorage('cateListScrollY');
        
        /*
         * 스크린 데이터 초기화
         201604
         */
        $scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		disp_name: null,
        		disp_no: null,
        		mGrpNo: '',
        		idx: "",
    			smallCate: [],
    			rankingBestBuy: []
        	}
        };
        $scope.screenDataReset();
        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['curDispNo'] != undefined) {
        	$scope.screenData.disp_no = commInitData.query['curDispNo'];
        }
        if(commInitData.query['idx'] != undefined) {
        	$scope.screenData.idx = commInitData.query['idx'];
        }
        if(commInitData.query['title'] != undefined) {
            $scope.subTitle = decodeURIComponent(commInitData.query['title']);
        }
        
        $scope.curDispNo = $scope.screenData.disp_no;
        $scope.curDispNoSctCd = 65;
        
        /*
         * 스크린 데이터 로드
         */
        $scope.loadScreenData = function() {
        	if($scope.screenData.endPage) { // 더이상 데이터 없음 
        		return false;
        	}
        	//console.log("스크린 데이터 로드...");
        	
        	$scope.screenData.page++;
        	$scope.productListLoading = true;
        	$http.get(LotteCommon.smallHolidayCategoryData+'?curDispNo='+$scope.screenData.disp_no+'&cateDiv=MIDDLE&idx='+$scope.screenData.idx+"&page="+$scope.screenData.page)
        	.success(function(data) {
        		var contents = [];
        		if(data['max'] != undefined) {
        			contents = data['max'];
        			if(contents.mgrp_no) {
        				$scope.screenData.mGrpNo = contents.mgrp_no;
        			}
         			if($scope.screenData.disp_name == null) {
        				$scope.subTitle = $scope.screenData.disp_name = contents.disp_nm;
        			}
        			if(!$scope.screenData.smallCate.length) {
        				$scope.screenData.smallCate = contents.small_cate.items;
        			}
                    
        			if(contents.ranking_best_buy) {
        				if(!contents.ranking_best_buy.items.length) {
        					$scope.productMoreScroll = false;
        				} else {
	        				angular.forEach(contents.ranking_best_buy.items, function(val, key) {
	        					$scope.screenData.rankingBestBuy.push(val);
	        				});
        				}
        			}
        			$scope.productListLoading = false;
        		}
        		//console.log($scope.screenData);
        		$scope.pageLoading = false;
            }).error(function(data) {
                $scope.pageLoading = false;
                $scope.productListLoading = false;
            });
        }
        //201604 추천기획전 이동 
        $scope.gotoLinkP = function(no, tclick, idx){
            if(idx < 10){
                idx = "0" + idx;
            }
            var link = "/product/m/product_list.do?"+$scope.baseParam+"&curDispNo=" + no +"&tClick=" + tclick + idx;
            $window.location.href = link;
        }
        $scope.totalPagePad = function(value){            
            return Math.ceil(value/2);
        }
        // 세션에서 가저올 부분 선언 
        var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
        var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');
        
        if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
        	var StoredData = JSON.parse(StoredDataStr);
    		$scope.pageLoading = false;

        	$scope.screenData = StoredData.screenData;
        	$scope.subTitle = $scope.screenData.disp_name;
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        } else {
        	$scope.loadScreenData();
        }
        
        /**
         * unload시 관련 데이터를 sessionStorage에 저장
         */
        angular.element($window).on("unload", function(e) {
            var sess = {};
            sess.screenData = angular.copy($scope.screenData);
            if (!commInitData.query.localtest && $scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
	            LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
            }
        });
        
        function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
		/* 중카에서 가져오는 중카테고리 값*/
		$scope.cateDepth1 = {};
		$scope.depthCurDispNo = {}; 
		
		$scope.paramCurDispNo = getParameterByName('curDispNo');
		$scope.paramCateDepth1 = getParameterByName('cateDepth1');

        if (getParameterByName('cateDepth1') == ""){
        	$scope.cateDepth1 = ""; 
        } else if($scope.paramCateDepth1.length >= 1) {
        	$scope.cateDepth1 = $scope.paramCateDepth1; 
        }
        
        if (getParameterByName('paramCurDispNo') == ""){
        	$scope.depthCurDispNo = ""; 
        } else if($scope.paramCurDispNo.length >= 1) {
        	$scope.depthCurDispNo = $scope.paramCurDispNo; 
        }
    }]);

    app.directive('lotteContainer',['$window','LotteCommon', function($window,LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/cate_holiday_mid_list_anglr_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
            	$scope.subCateClick = function(item) {
                    //20160711 $scope.cateDepth1 을 조회
                    $scope.cateDepth1 = "";
                    for(var i=0; i<$scope.sideCtgData.ctgAll.length; i++){
                        for(var k=0; k < $scope.sideCtgData.ctgAll[i].lctgs.length; k++){                                                    
                            if($scope.sideCtgData.ctgAll[i].lctgs[k].name == $scope.subTitle){                                
                                $scope.cateDepth1 = $scope.sideCtgData.ctgAll[i].name;
                                break;
                            }   
                        }                        
                    }                    
                    
            		var tclick = "&tclick="+$scope.tClickBase+"side_cate_catesmall_"+item.disp_no+"&curDispNoSctCd=65";
            		//var url = LotteCommon.cateProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDiv=MIDDLE&idx="+$scope.screenData.idx+"&mGrpNo="+item.mgrp_no+"&title="+encodeURIComponent(item.disp_nm)+tclick;
            		var url = LotteCommon.cateHolidayProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDiv=MIDDLE&idx="+$scope.screenData.idx+"&mGrpNo="+item.mgrp_no+"&curDispNo2="+$scope.curDispNo+"&cateDepth1="+$scope.cateDepth1+"&cateDepth2="+$scope.subTitle+"&title="+encodeURIComponent(item.disp_nm)+tclick;
            		if(item.sort != undefined){
            			url += "&sort=" + item.sort;
            		}
            		$window.location.href = url;
            	}
                $scope.isTotal=true;
            }
        };
    }]);

})(window, window.angular);