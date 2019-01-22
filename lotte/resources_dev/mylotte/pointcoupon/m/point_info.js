(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
	     'lotteComm',
	     'lotteSrh',
	     'lotteSideCtg',
	    //  'lotteSideMylotte',
	     'lotteCommFooter'
    ]);
    
//    app.filter('filters', []).filter('htmlToPlaintext', function() {
//        return function(text) {
//          return String(text).replace(/<[^>]+>/gm, '');
//        }
//      });
    
    app.filter('htmlRemove', [function() {
    	return function(text) {
            return text.substr(0,4)+"."+text.substr(8,2)+"."+text.substr(11,2);
    	}
    }]);
    
    app.controller('PointInfoCtrl', ['$scope', '$window', '$http', 'LotteCommon', 'LotteGA', function($scope, $window, $http, LotteCommon, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        
        $scope.depositView = false; // 보관금 공지사항 뷰
        $scope.delCloverListViewFlag = false; //소멸예정클로버 리스트 뷰
        $scope.isShowLoadingImage = true; // 로딩이미지 출력 여부
        $scope.tabControl = 'second';
        $scope.gaCtgName = "MO_쿠폰존";

        // 로그인 정보 체크 후 로그인 페이지로 리턴
//    	if(!$scope.loginInfo.isLogin){
//    		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
//        	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
//    	}
    	
        // URL PARAM GET
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        
    	$scope.pointDivParam = getParameterByName('point_div');

        $scope.subTitle = "포인트 내역";
        
        if(getParameterByName('point_div') == "clover") {
        	$scope.subTitle = "클로버 내역"; //서브헤더 타이틀
        }
        
        if(getParameterByName('point_div') == "coupon") {
        	$scope.subTitle = "쿠폰존"; //서브헤더 타이틀
        }
        
        $scope.pointListData = [];
        $scope.pointDelData = [];
        $scope.pointSaveData = [];
        $scope.bankListData = [];
        $scope.cloverListData = [];
        $scope.delCloverListData = [];
        $scope.couponListData = [];
        
        $scope.pointList_tot_cnt= 0;
        $scope.tobeDelLPointList_tot_cnt= 0;
        $scope.saveLtPointList_tot_cnt= 0;
        $scope.cloverPointList_tot_cnt= 0;
        $scope.tobeDelCloverList_tot_cnt= 0;
        $scope.couponList_tot_cnt= 0;
        
        // Data Load
        $scope.getPointDataLoad = function() {
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
	        $http.get(LotteCommon.pointInfoData +"?" + $scope.baseParam + "&point_div=" + $scope.pointDivParam + "&page_num=" + $scope.thisPage +"&tclick=m_mylayer_" + $scope.pointDivParam)
	        .success(function(data) {
	       		if($scope.thisPage > 1) {
	       			// 쿠폰리스트
		       		//$scope.couponListData = data.max.couponList;
		       		angular.forEach(data.max.couponList.items, function(val, key) {
		       			$scope.couponListData.push(val);
		       		});
		       		// 클로버 리스트
		       		//$scope.cloverListData = data.max.cloverPointList;
		       		angular.forEach(data.max.cloverPointList.items, function(val, key) {
		       			$scope.cloverListData.push(val);
		       		});
		       		angular.forEach(data.max.pointList.items, function(val, key) {
		       			$scope.pointListData.push(val);
		       		});
	       		} else {
	       			// maxData
		        	$scope.maxData = data.max;
		       		// 포인트 리스트
		        	$scope.page_end = parseInt(data.max.page_end);
		        	console.log('page end ; ' + $scope.page_end)
		       		// 삭제예정 포인트 리스트
		       		//$scope.pointDelData = data.max.tobeDelLPointList;
		       		angular.forEach(data.max.tobeDelLPointList.items, function(val, key) {
		       			$scope.pointDelData.push(val);
		       		});
		       		// 적립예정 포인트 리스트
		       		//$scope.pointSaveData = data.max.saveLtPointList;
		       		angular.forEach(data.max.saveLtPointList.items, function(val, key) {
		       			$scope.pointSaveData.push(val);
		       		});
		       		// 보관금 은행 리스트
		       		//$scope.bankListData = data.max.bankList;
		       		angular.forEach(data.max.bankList.items, function(val, key) {
		       			$scope.bankListData.push(val);
		       		});
		       		// 클로버 소멸예정 리스트
		       		//$scope.delCloverListData = data.max.tobeDelCloverList;
		       		angular.forEach(data.max.tobeDelCloverList.items, function(val, key) {
		       			$scope.delCloverListData.push(val);
		       		});
		       		// 쿠폰리스트
		       		//$scope.couponListData = data.max.couponList;
		       		angular.forEach(data.max.couponList.items, function(val, key) {
		       			$scope.couponListData.push(val);
		       		});
		       		// 클로버 리스트
		       		//$scope.cloverListData = data.max.cloverPointList;
		       		angular.forEach(data.max.cloverPointList.items, function(val, key) {
		       			$scope.cloverListData.push(val);
		       		});
		       		angular.forEach(data.max.pointList.items, function(val, key) {
		       			$scope.pointListData.push(val);
		       		});
		        	$scope.isShowLoadingImage = false; // 로딩이미지 출력 여부
	       		}
	       		$scope.bankHasYn = data.max.refund_acct_yn;
	            $scope.pointList_tot_cnt= data.max.pointList_tot_cnt;
	            $scope.tobeDelLPointList_tot_cnt= data.max.tobeDelLPointList_tot_cnt;
	            $scope.saveLtPointList_tot_cnt= data.max.saveLtPointList.total_count;
	            $scope.cloverPointList_tot_cnt= data.max.cloverPointList_tot_cnt;
	            $scope.tobeDelCloverList_tot_cnt= data.max.tobeDelCloverList_tot_cnt;
	            $scope.couponList_tot_cnt= data.max.couponList_tot_cnt;
	        })
	        .error(function(data, status, headers, config){
	        	$scope.isShowLoadingImage = false; // 로딩이미지 출력 여부
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
        $scope.page_end = 0;
        $scope.thisPage = 0;
        $scope.getPointDataLoad();
        
        // L-point Click
        $scope.lPointClick = function(){
        	$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=lt_point&tclick=m_mylayer_ltmoney";
        }
        
        // L-money Click
        $scope.ltPointClick = function(){
        	$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=l_point&tclick=m_mylayer_lmoney";
        }
        
        // 보관금 Click
        $scope.depositClick = function(){
        	$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam +"&point_div=deposit&tclick=m_mylayer_deposit";
        }
        
        // 소멸예정 클로버 상세보기 클릭
        $scope.delCloverView = function () {
            $scope.delCloverListViewFlag = !$scope.delCloverListViewFlag;
        };
        
    	// 페이퍼 쿠폰 등록 Click
    	$scope.paperCouponRegi = function(paper_no){
        	$window.location.href = LotteCommon.paperCouponUrl + "?" + $scope.baseParam + "&paper_no=" + paper_no + "&point_div=coupon&tclick=m_mylayer_coupon"; 
    	}
    	
    	// 포인트 적립
    	$scope.pointSaveClick = function(ordNo) {
    		$scope.saveOrdNo = String(ordNo).replace(/-/gi,"");
    		console.log($scope.saveOrdNo);
    		$http({
        		method: 'POST',
        		url: '/json/mylotte/pointcoupon/point_save.json',
        		data: {
        			ord_no: $scope.saveOrdNo
        		},
        		transformRequest: transformJsonToParam,
        		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        	})
        	.success(function(data) {
    			console.log(data.resultMsg);
    			alert(data.resultMsg);
            	$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=lt_point&tclick=m_mylayer_ltmoney";
            })
            .error(function(ex) {
            	console.log('적립하기 오류');
            });
    	}

		// 나의 총 클로버 링크
		$scope.cloverLink = function () {
			$window.location.href = LotteCommon.cloverUrl + "?" + $scope.baseParam + "&tclick=m_DC_clover_Clk_Btn_01";
		};
    	
        // 보관금 공지사항 보기 CLICK
        $scope.depositViewClick = function() {
            $scope.depositView = !$scope.depositView;
        }
        
    	// 안내영역 탭보기 CLICK
    	$scope.depositViewClick1 = function() {
    		$scope.depositView1 = !$scope.depositView1;
    	}
        
        // 안내영역 탭보기2 CLICK
        $scope.depositViewClick2 = function() {
            $scope.depositView2 = !$scope.depositView2;
        }
    	
    	// 보관금 환불요청 클릭
    	$scope.goRefundDetail = function() {
    		// 로그인 체크
    		if(!$scope.loginInfo.isLogin) {
    			alert("로그인 후 이용가능합니다.");
    			var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
            	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
    		}
    		// 환불금액 유무 확인
    		if($scope.maxData.deposit == 0){
    			alert("환불금액이 없습니다.")
    			return;
    		}
    		// 페이지 이동
			$window.location.href = LotteCommon.depositDetailUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_deposit";
    	}
    	
    	// 예금계좌확인
    	$scope.checkBank = function() {
    		
    	}
    	
    	// 환불신청
    	$scope.refundDeposit = function(bnk_cd, actn, ooa_nm) {
    		
    	}

    	$scope.moreListClick = function() {
    		$scope.getPointDataLoad();
    	}
		// 엘포인트 링크 이동
		$scope.lPointGoLink = function(){
			if ($scope.appObj.isApp) {
				openNativePopup('엘포인트', 'http://www.lpoint.com')
			}else{
				window.open('http://www.lpoint.com');
			} 
		}

        //쿠폰존 텝제어 
        $scope.changeTab = function(str){
           $scope.tabControl = str;

           if(str == 'first'){
                $scope.couponZoneTab = false;
                $window.location.href = LotteCommon.newCouponzoneUrl + '?' + $scope.baseParam;
                
           }else{
                $scope.couponZoneTab = true;
                $window.location.href = LotteCommon.myPointUrl + '?point_div=coupon&' + $scope.baseParam;
           }
        }

        // 쿠폰내역 상단 배너 링크
        var newCouponzoneData = LotteCommon.newCouponzoneData;
        var newCouponzoneTop = '/main_json_contents.do?dispNo=5570119&age=20&dispNo=5570119&gender=F';

        $http.get(newCouponzoneData)
        .success(function(data) {
            // 받을 수 있는 쿠폰 수
            $scope.couponYnCnt = data.goodBenefit.attributes.couponList.coupon_yn_cnt;
        })
        .error(function (data, status, headers, config) {
            //console.log('Error Data : ', status, headers, config);
        });
        
        $scope.cpLinks = function(num){
            switch(num){
                case '1':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.attendUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.directAttendUrl + '?' + $scope.baseParam;
                    }
                    break;
                /*case '2':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.benefitUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.newCouponzoneUrl + '?' + $scope.baseParam;
                    }
                    break;*/
                case '3':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.rewordUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.eventSaunUrl + '?' + $scope.baseParam;
                    }
                    break;
                case '4':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.eventUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.eventGumeUrl + '?' + $scope.baseParam;
                    }
                    break;
            }
        };

        $scope.cpGA = function(num, name, name2){
            LotteGA.evtTag($scope.gaCtgName, '탭0'+ num +'_' + name, name2);
        };
    	
    }]);

    app.directive('lotteContainer', function() {
        return {
        	restrict: "EA",
            scope: true,
            replace : true,
            templateUrl: function(element, attrs) {
            	
            	function getParameterByName(name) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(location.search);
                    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                }

                if (getParameterByName('point_div') == ""){
                	var pointDivParam = "lt_point";
                } else {
                	var pointDivParam = getParameterByName('point_div');
                }; 
                
              return "/lotte/resources_dev/mylotte/pointcoupon/m/point_" + pointDivParam + "_container.html";
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