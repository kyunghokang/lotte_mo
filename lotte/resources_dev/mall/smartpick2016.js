(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteNgSwipe'        
    ]);

    app.controller('smartpick2016Ctrl', ['$scope', 'LotteCommon','$http','LotteStorage','commInitData', function($scope, LotteCommon, $http, LotteStorage, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스마트픽"; //서브헤더 타이틀
        $scope.smpcurDispNo = {
			curDispNo : commInitData.query.curDispNo
		};
		// Data Load
		$scope.loadData = function () {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.smartpickData,
				params: {
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
                $scope.smp = data.main_contents; //전체 데이타 
                if(data.main_contents.prd_list != null && data.main_contents.prd_list != undefined){
				    $scope.products = data.main_contents.prd_list.items;
                }else{
                    $scope.products = [];
                }
                $scope.dept_store = data.main_contents.dept_store;
                //4개 아이콘 활성화 여부 
                $scope.smp.branchInfoView = [false, false, false, false];
                for(var i=0; i<$scope.smp.branch_detail_info.length; i++){
                    $scope.smp.branchInfoView[$scope.smp.branch_detail_info[i] - 1] = true;
                }
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
                LotteStorage.setSessionStorage("smartpick", $scope.smp,'json');
				//$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};
        $scope.goLogin = function(){
            $scope.loginProc("m_DC_Smartpick_Clk_login", "N");
        }
		// 지점목록 불러오기
		$scope.loadBranchList = function(){
			if(LotteCommon.mainBranchListData == undefined){ return false; }
			var httpConfig = {
				method: "get",
				url: LotteCommon.mainBranchListData
			};

			$http(httpConfig)
			.success(function (data) {
				//$scope.tpmlData.contData = data.main_contents;
				var group, branch, blen, b;
                //디폴트
				data.branch_grp_list.fav_branch = {branch_nm:"본점",branch_org_nm:"본점",branch_no:"20",dept_no:null,is_fav:true};
				var glen = data.branch_grp_list.items.length;
				for(var g=0; g<glen; g++){
					group = data.branch_grp_list.items[g];
					blen = group.branch_list.items.length;
					for(b=0; b<blen; b++){
						branch = group.branch_list.items[b];
                        branch.branch_org_nm = branch.branch_nm;
                        if(g == glen - 1){ //영플라자 제거 0516  
                            branch.branch_nm = branch.branch_nm.replace("(영플라자)", "");
                        }
						if(branch.is_fav){
							data.branch_grp_list.fav_branch = branch;
							//break;
						}
					}
				}
				$scope.branch_list = data.branch_grp_list;
                
                //저장한 단골지점과 로드한 단골지점이 같지 않으면 데이타 갱신 
                var stored_branch = LotteStorage.getSessionStorage("fav_branch_name"); 
                if(stored_branch != '' && stored_branch != undefined){
                    if(stored_branch != data.branch_grp_list.fav_branch.branch_nm){
                        $scope.loadData();   
                    }
                }
                LotteStorage.setSessionStorage("fav_branch_name", data.branch_grp_list.fav_branch.branch_nm);
			});
		}
        // 단골지점 선택
        $scope.branchClick = function(target){
            if($scope.loginInfo.isLogin == false){
                alert("로그인 후 단골지점을 설정할 수 있습니다.");
                $scope.loginProc();
                return false;
            }

            if(target.branch.is_fav){ return false; }
            if(LotteCommon.mainBranchSelectData == undefined){ return false; }

            var httpConfig = {
                method: "get",
                url: LotteCommon.mainBranchSelectData,
                params: {
                    branch_no: target.branch.branch_no
                }
            };

            $http(httpConfig) // 실제 탭 데이터 호출
            .success(function (data) {
                if(data.result && data.result.response_code == "0000"){
                    
                    // success
                    var group, branch, blen, b;
                    var glen = $scope.branch_list.items.length;
                    for(var g=0; g<glen; g++){
                        group = $scope.branch_list.items[g];
                        blen = group.branch_list.items.length;
                        for(b=0; b<blen; b++){
                            branch = group.branch_list.items[b];
                            branch.is_fav = false;
                        }
                    }
                    target.branch.is_fav = true;
                    $scope.branch_list.fav_branch = target.branch;
                    if(data.smp_prod && data.smp_prod.items){
                        // 스마트픽 2개로 제한
                        if(data.smp_prod.items.length > 2){
                            data.smp_prod.items.length = 2;
                        }
                        $scope.smp_prod = data.smp_prod;
                    }

                    if($scope.loginInfo.favDeptBranchNo == undefined){
                        $scope.loginInfo.favDeptBranchNo = {dept_branch_no:target.branch.branch_no, dept_branch_nm:target.branch.branch_nm};
                    }else{
                        $scope.loginInfo.favDeptBranchNo.dept_branch_no = target.branch.branch_no;
                        $scope.loginInfo.favDeptBranchNo.dept_branch_nm = target.branch.branch_nm;
                    }
                    $scope.showBranchLayer = false;
                    LotteStorage.setSessionStorage("fav_branch_name", target.branch.branch_nm);
                    $scope.loadData();
                }else{
                    // fail
                    alert("단골지점을 저장하지 못했습니다.");
                }
            });

            // TCLICK
            var tclick = "m_DC_Smartpick_Clk_store";
            var bidx = target.$index;
            var pidx = target.$parent.$index;
            var tidx = bidx * 4 + pidx + 1;
            if(tidx < 10){ tidx = "0" + tidx; }
            $scope.sendTclick(tclick + tidx);
        }  

        //링크 함수
        $scope.linkProduct = function(item, tclick, index, moreParam){
            if(index != "" && index < 10){
                index = "0" + index;
            }
            var tClickCode = tclick + index; 
            window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&curDispNo=5539740&curDispNoSctCd=64&goods_no=" + item.goods_no+ "&tclick="+tClickCode + moreParam;
        }
        $scope.linkUrl = function(item, tclick, index){
            if(index != "" && index < 10){
                index = "0" + index;
            }
            var tClickCode = tclick + index;
            if(item.link_url == undefined){
                item.link_url = item.img_link;
            }
            if(item.link_url.indexOf('?') > 1){
                item.link_url = item.link_url + "&";
            }else{
                item.link_url = item.link_url + "?";
            }
            window.location.href =  item.link_url + $scope.baseParam + "&tclick="+tClickCode;
        } 
        $scope.getProductImage = function(item) {
            var newUrl = "";
            if(item.img_url == null) {
                return "";
            }
            newUrl = item.img_url.replace("280.jpg","550.jpg");
            return newUrl;
        }            
        $scope.viewMorePick = function(){                      
            window.location.href = "/search/search_list.do?" + $scope.baseParam + "&reqType=N&keyword=스마트픽%20" 
                + $scope.branch_list.fav_branch.branch_org_nm + "&tclick=m_DC_Smartpick_Clk_Btn01";
        }
        //데이타 로드 
        $scope.smp = LotteStorage.getSessionStorage("smartpick", 'json');//sessionStorage.getItem("tvshopping");
        if($scope.smp == null || $scope.smp == ''){     
            $scope.loadData();                    
        }else{                       
            if($scope.smp.prd_list != null && $scope.smp.prd_list != undefined){
                $scope.products = $scope.smp.prd_list.items;    
            }else{
                $scope.products = [];    
            }
            $scope.dept_store = $scope.smp.dept_store;            
        }         
        $scope.loadBranchList();
        
    }]);

    app.directive('lotteContainer', ['$window', 'LotteCommon', function($window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/smartpick2016_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.showBranchLayer = false;
                //픽업장소 시간
                $scope.pickupFlag = false;
                $scope.showPickup = function(){
                    $scope.sendTclick("m_DC_Smartpick_Clk_Btn05");
                    $scope.pickupFlag = true;
                }
                $scope.hidePickup = function(){
                    $scope.pickupFlag = false;
                }  
                //DM 쿠폰북
                $scope.dmCoupon = function(){
					if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        alert("로그인을 해주세요.");
        				var targetUrl = "&targetUrl=" + encodeURIComponent(LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_DC_Smartpick_Clk_Btn04", 'UTF-8');
        				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
					}else{
						$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_DC_Smartpick_Clk_Btn04";
					}
					
                }
                //층별안내
                $scope.floorInfo = function(){
                    var link;
                    if($scope.branch_list.fav_branch.branch_no == '287230'){ //에비뉴엘 일 때 
                        link = "http://www.avenuel.co.kr/shopping/floorGuide.do?lang=kr&branchCd=00001";
                    }else{
                        link = "http://store.lotteshopping.com/handler/StairGuide_F-BaseInfoSearch?subBrchCd="+$scope.dept_store.dept_branch_no;
                    }
                    link += "&tclick=m_DC_Smartpick_Clk_Btn03";
					//$scope.sendTclick('_Clk_Btn_3');
					if ($scope.appObj.isApp) {
						openNativePopup("층별 안내", link);
					} else {
						window.open(link);
					}
                }                
				// 단골지점 선택 레이어 on/off
				$scope.showHideStoreList = function(){
					$scope.showBranchLayer = !$scope.showBranchLayer;
					
					var tclick = "m_DC_Smartpick_Clk_Lyr";
					if($scope.showBranchLayer){
						$scope.sendTclick(tclick+"01");
					}else{
						$scope.sendTclick(tclick+"02");
					}
				}                
            }
        };
    }]);
	app.directive('calendarHoliday', [function () {
		return {
			replace: true,
			link: function (scope, el, attrs) {
				scope.getFirstDay = function (year, month) { // 첫째요일
					return new Date(year, month, 1).getDay();
				};

				scope.getLastDay = function (year, month) { // 마지막날짜
					return new Date(year, month + 1, 0).getDate();
				};

				scope.addZero = function (n) {
					return n < 10 ? "0" + n : n;
				};

				scope.date = new Date();
				scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
				scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
				scope.dateHead = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
				
				scope.calendarHoliday = false;
				
				scope.calendarHolidayClick = function () {
					scope.sendTclick('m_DC_Smartpick_Clk_Btn02');
					scope.dimmedOpen({
						target: "calendarHoliday", 
						callback: this.calenderHolidayClose
					});
					scope.calendarHoliday = true;
				};
				
				scope.calenderHolidayClose = function () {
					if (scope.calendarHoliday) {
						scope.calendarHoliday = false;
						scope.dimmedClose();
					}
				};
				
				// biz_dd_sct_class_nms : 영업일 구분 클래스명 배열 (달력 표기용) data 받아옴 (7 x
				// 6 = 42)
				// scope.bizDdSctData = [];
				scope.makeDays = function () {
					scope.day = [];

					for (var i = 0 ; i < scope.firstDay ; i++) {
						scope.day.push("");
					}

					for (var i = 0 ; i < scope.lastDay ; i++) {
						scope.day.push((i + 1));
					}
					
					// console.log(scope.day)
					// console.log(scope.screenData.dept_store.biz_dd_sct_class_nms)
				};

				scope.makeDays();
			}
		};
	}]);
    app.filter('trim', [function() {
    	return function(item) {
            item = $.trim(item); //.replace(/(^\s*)|(\s*$)/gi, "");
            item = item.replace(" ", "");
            return item;
    	}
    }]);
    
	commModule.directive("zoomProductContiner",['$parse', '$http' , '$timeout', 'LotteCommon' , 'LotteScroll', 'LotteUtil', function($parse,$http,$timeout,LotteCommon,LotteScroll, LotteUtil) {
		return {
			template: '<div class="unit_zoomImage" ng-show="zoomImageFalg"><span class="btn_close" ng-click="zoomImageClose()"></span><p class="img"><img ng-src="{{zoomImageSrc|| \'//:0\'}}" alt="{{zoomImageTitle}}" /></p></div>',
			replace: true,
			link : function($scope, el, attrs) {
				$scope.zoomImageFalg = false;
				$scope.zoomImageSrc = "";
				$scope.zoomImageTitle = "";

				$scope.zoomImageClose = function() {
					if($scope.zoomImageFalg) {
						$scope.dimmedClose();
						$scope.zoomImageFalg = false;
						$scope.scrollFlag = true;
						LotteScroll.enableScroll();
					}
				}

				$scope.zoomImageClick = function(url) {
					if(url != null) {
						url = url.replace("60.jpg","550.jpg");
						url = url.replace("280.jpg","550.jpg");
					}

					$scope.dimmedOpen({
						target: "imageZoom",
						callback: this.zoomImageClose,
						scrollEventFlag: true
					});
					$scope.scrollFlag = false;
					LotteScroll.disableScroll();
					$scope.sendTclick($scope.tClickBase+$scope.$$childHead.screenID+'_Clk_Elg');
					$timeout(function() {
						$scope.$apply(function() {
							$scope.zoomImageSrc = url;
							$scope.zoomImageFalg = true;
						});
					});
				}
			}
		}
	}]);       
})(window, window.angular);