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

		app.controller('presentListCtrl', ['$scope', '$http', '$filter', 'LotteCommon', 'LotteCookie', 'LotteUtil', '$timeout', '$window', 'LotteStorage', 'commInitData', function($scope, $http, $filter, LotteCommon, LotteCookie, LotteUtil, $timeout, $window, LotteStorage, commInitData) {
			//----------------------------------------------------------------------------------------------------
			// 변수 선언
			//----------------------------------------------------------------------------------------------------
			$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)

			$scope.isWishDebug = false; // UI 디버깅용
			$scope.showWrap = true;
			$scope.contVisible = true;
			$scope.subTitle = '선물함'; // 서브헤더 타이틀
			$scope.screenId = 'present_list'; // 화면ID

			$scope.itemCountPerPage = 20; // 페이지당 상품 출력 개수(디폴트:20)
			$scope.currentPageNo = 0; // 현재 페이지 번호(최초 상품 로딩 시 1로 셋팅되어서 호출됨)
			
			// UI data object
			$scope.UIData = {
				presentListTab	: 0
			}
            //20161110
			if(commInitData.query['sndr_yn'] == "Y"){
                $scope.UIData.presentListTab = 1;                
                //비로그인이면 로그인페이지로 이동 20161220
                $timeout(function(){
                    if(!$scope.loginInfo.isLogin){
                        var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
                        $window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targUrl;                        
                    }
                }, 50);
            }
            //20161213 탭위치 기억
            var prTab = LotteStorage.getSessionStorage('presentTab');
            if(prTab != null && prTab != ""){
                $scope.UIData.presentListTab = prTab;                
            }        
            $scope.sortType = 0;
            var sort = LotteStorage.getSessionStorage('sortType');
            if(sort != null && sort != ""){
                $scope.sortType = sort;                
            }        
            
			// UI state variables
			$scope.UIStatus = {
				isReceivedLoading	: false,
				isSentLoading		: false,
				isSearchingGift		: false
			};
			
			// local variables
			$scope.LV = {
				SESSION_ID		: "PRESENT_LIST",
				HASH_STRING		: "/prslst",
				loadingReceived	: false,
				loadingSent		: false
			};
			
			$scope.LV.DELIVER_STAT		= PRESENT_COMMON.DELIVER_STAT;
            $scope.LV.DELIVER_DTL_STAT	= PRESENT_COMMON.DELIVER_DTL_STAT;
			$scope.LV.DELIVER_MSG		= PRESENT_COMMON.DELIVER_MSG;
			
			// url variables
			$scope.URLs = {
				RECEIVE_LIST		: LotteCommon.presentReceivedListData,
				SENT_LIST			: LotteCommon.presentSentListData,
				PRESENT_DETAIL		: LotteCommon.presentDetailUrl,
				PURCHASE_DETAIL		: LotteCommon.purchaseViewUrl,
				CHECK_NEW_PRESENT	: LotteCommon.presentListCheckNewData,
				WRITE_COMMENT		: LotteCommon.presentWriteCommentUrl,
                EDIT_COMMENT		: LotteCommon.presentEditCommentUrl,
				MAIN_URL			: LotteCommon.mainUrl
			};
			
			$scope.getSessionName = function(name){
				return $scope.LV.SESSION_ID + "_" + name;
			};
			/*
			$scope.convertOrderNumber = function(str){                
				if(str.indexOf("-") >= 0){
					return str;
				}
				return str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8) + "-" + str.substring(8, str.length);
			}
			*/
	    	
	    	// for local test
	    	if(location.host == "localhost:8082" || location.host == "mt2.lotte.com" || location.host == "mo.lotte.com"){
	    		window.$scope = $scope;
	    		if(location.host == "localhost:8082" && $scope.URLs.PURCHASE_DETAIL == ""){
	    			$scope.URLs.PURCHASE_DETAIL = "/mylotte/purchase/m/purchase_view.do"
	    		}
	    	}
		}]);

		app.directive("lotteContainer", ["LotteStorage", "$timeout", "$http", "$window","LotteCommon", function(LotteStorage, $timeout, $http, $window,LotteCommon) {
			return {
				templateUrl: '/lotte/resources_dev/mylotte/present/present_list_container.html',
				replace: true,
				link: function($scope, el, attrs) {
					
					/**
					 * 선물함 시작하기
					 */
					$scope.startOver = function(){
						/*
                        angular.element($window).on("unload", function () {
							LotteStorage.setSessionStorage($scope.getSessionName("data"), $scope.UIData, "json");
							LotteStorage.setSessionStorage($scope.getSessionName("scroll"), angular.element($window).scrollTop());
						});
						*/
						$scope.loadListData();
						
						/*
						if(location.hash.indexOf($scope.LV.HASH_STRING) < 0){
							// 페이지 신규 방문
							console.warn("NEW VISIT");
							history.replaceState(null, null, "#" + $scope.LV.HASH_STRING);
							$scope.loadListData();
							
						}else{
							// 페이지 재방문
							console.warn("RE-VISIT");
							var session = LotteStorage.getSessionStorage($scope.getSessionName("data"), "json");
							if(session == null){
								// 세션 정보 없음
								console.warn("NO SESSION");
								$scope.loadListData();
								
							}else{
								// 세션 정보 있음
								console.warn("HAS SESSION");
								$scope.UIData = session;
								
								var scrollY = LotteStorage.getSessionStorage($scope.getSessionName("scroll"));
								$timeout(function () {
									angular.element($window).scrollTop(scrollY);
								}, 300);
							}
						}
						*/
					};
					
					
					/**
					 * 리스트 데이터 로드
					 */
					$scope.loadListData = function(){
						console.log("LOAD DATA");
						$scope.loadReceivedList();
						$scope.loadSentList();
					};
					
					/**
					 * 받은 선물함 데이터 로드
					 */
					$scope.loadReceivedList = function(){
						if($scope.loginInfo.isLogin==false || $scope.loginInfo.mbrNo==undefined || $scope.loginInfo.mbrNo==""){
							$scope.UIStatus.isSearchingGift = true;
							return;
						}
						
						$scope.UIStatus.isReceivedLoading = true;
						var url = $scope.URLs.RECEIVE_LIST;
						var params = {
							mbr_no	: $scope.loginInfo.mbrNo
						}
						$http.get(url, {params:params})
							.success(function(data){
								$scope.processListData(data.gift_lst.items);
								$scope.UIData.receivedList = data;
								$scope.UIStatus.isReceivedLoading = false;
                            
                                //20161213 스크롤위치로 이동하기 
                                var scrollY = LotteStorage.getSessionStorage('presentScrollY');
                                if(scrollY != null && scrollY != ""){
                                    $timeout(function () {
                                        angular.element($window).scrollTop(scrollY);
                                    }, 500);
                                    LotteStorage.setSessionStorage('presentScrollY', "");//초기화
                                    LotteStorage.setSessionStorage('presentTab', "");
                                    LotteStorage.setSessionStorage('sortType', "");
                                }
                            
							})
							.error(function(){
								console.log('Data Error : 받은 선물함');
								$scope.UIStatus.isReceivedLoading = false;
							});
					};
					
					/**
					 * 보낸 선물함 데이터 로드
					 */
					$scope.loadSentList = function(){
						if($scope.loginInfo.isLogin==false || $scope.loginInfo.mbrNo==undefined || $scope.loginInfo.mbrNo==""){
							$scope.UIData.sentList = {"gift_lst":{"items":[]}};
							return;
						}
						
						$scope.UIStatus.isSentLoading = true;
						var url = $scope.URLs.SENT_LIST;
						var params = {
							mbr_no	: $scope.loginInfo.mbrNo
						}
						$http.get(url, {params:params})
							.success(function(data){
								$scope.processListData(data.gift_lst.items);
                                $scope.processListData2(data.gift_lst.items); //20161215
								$scope.UIData.sentList = data;
								$scope.UIStatus.isSentLoading = false;
							})
							.error(function(){
								console.log('Data Error : 보낸 선물함');
								$scope.UIStatus.isSentLoading = false;
							});
					};
					
					/**
					 * 선물함 데이터 가공
					 */
					$scope.processListData = function(items){
						if(items==undefined){ return; }						
						var status;
						angular.forEach(items, function(item, index){
							status = item.gift_info.status + "";
							item.gift_info.canceled		= false;
							item.gift_info.commentable	= false;
							switch(status){
								case "12":
									item.gift_info.canceled = true;
									break;
								case "17":
								case "18":
									item.gift_info.commentable	= true;
								break;
							}
						});
					}
                    //보낸선물함만 추가 가공 //20161215                    
					$scope.processListData2 = function(items){
						if(items==undefined){ return; }						
						var status, agryn, sct;
                        $scope.sendGift_total = items.length;
                        $scope.sendGift_get = 0;
                        $scope.sendGift_yet = 0;
                        $scope.sendGift_end = 0;
						angular.forEach(items, function(item, index){
                            //수락 1, 미수락 2, 취소3  
                            status = item.gift_info.status + "";
                            agryn = item.gift_info.gift_acq_agr_yn;
                            sct = item.gift_info.sct;
                            item.giftType = 10;
                            //20161220 조건 추가                             
                            if(agryn == 'N' || 
                                     (status != '10' && status != '11' && agryn == '') || 
                                     (sct == '16' && status == '21') || 
                                     (sct == '11' && status == '12')){ //취소
                                item.giftType = 3;                                
                                $scope.sendGift_end += 1;
                            }else if(agryn == 'Y' && ((sct != '16' && status != '21')||(sct != '11' && status != '12'))){ //수락
                                //수락 : 수락여부가 y이고 교환반품완료가 아니거나 주문취소가 아닌 경우
                                item.giftType = 1;                                
                                $scope.sendGift_get += 1;
                            }else if((status == '10' || status == '11') && agryn == ''){ //미수락
                                item.giftType = 2;                                
                                $scope.sendGift_yet += 1;
                            //취소 : 수락여부가 'N' 이거나, 주문상태가 '주문접수' '주문완료'가 아니면서 수락여부가 없거나교환반품완료이거나,주문취소인 경우    
                            } 
						});
					}
                    //20161215 보낸선물함 소팅
                    //0전체, 1수락, 2미수락, 3취소
					$scope.selectSort = function(type){
                        $scope.sortType = type;
                    }
					/**
					 * 선물함 탭 선택
					 */
					$scope.selectPresentList = function(idx){
						if($scope.UIData.presentListTab == idx){ return; }
						$scope.UIData.presentListTab = idx;
                        if(idx == 0){ //20161215
                            $scope.sortType = 0;
                        }
					};
					
					/**
					 * 받은선물 찾기 시작
					 */
					$scope.showSearchGift = function(){
						$scope.UIStatus.isSearchingGift = true;
						$(document).scrollTop(0);
					};
					
					/**
					 * 선물 찾기 조회
					 */
					$scope.searchReceivedGift = function(){
						var n1 = $("#srh_phone_no1").val();
						var n2 = $("#srh_phone_no2").val();
						if(n2.length < 3){
							alert("전화번호를 입력해 주세요.");
							$("#srh_phone_no2").focus().select();
							return false;
						}
						var n3 = $("#srh_phone_no3").val();
						if(n3.length < 3){
							alert("전화번호를 입력해 주세요.");
							$("#srh_phone_no3").focus().select();
							return false;
						}
						var pw = $("#srh_password").val();
						if(pw.length < 4){
							alert("선물함 비밀번호 4자리를 입력해 주세요.");
							$("#srh_password").focus().select();
							return false;
						}
						
						var url = $scope.URLs.CHECK_NEW_PRESENT;
						var params = {
							tel_no	: n1 + "-" + n2 + "-" + n3,
							pw		: pw
						}
						if($scope.loginInfo.mbrNo != undefined && $scope.loginInfo.mbrNo != ""){
							params.mbr_no = $scope.loginInfo.mbrNo;
						}
						$http.get(url, {params:params})
							.success(function(data){
								$scope.UIStatus.isReceivedLoading = false;
								if(data.result_code == "0000"){
									// 조회 성공 20161202
                                    $scope.processListData(data.gift_lst.items);
									$scope.UIData.receivedList = data;
									$scope.UIStatus.isSearchingGift = false;
									
								}else{
									// 조회 실패
									var err_msg = data.error_msg;
									if(err_msg == undefined || err_msg == ""){
										err_msg = "일치하는 선물 내역이 없습니다.";
									}
									alert(err_msg);
								}
							})
							.error(function(){
								$scope.UIStatus.isReceivedLoading = false;
								alert("일치하는 선물 내역이 없습니다.");
							});
					};

					
					/**
					 * 숫자 입력 글자수 제한
					 */
					$scope.searchRestrictInput = function(id){
						var tf = $("#"+id);
						if(tf.length == 0){ return; }
						var str = tf.val();
						if(str.length > 4){
							tf.val( str.substr(0, 4) );
						}
					}
					
					/**
					 * 선물 상세 이동
					 */
					$scope.goPresentDetail = function(item){
						var path = $scope.URLs.PRESENT_DETAIL + "?orderNo=" + item.gift_info.order_no + "&ordDtlSn=" + item.gift_info.ord_dtl_sn + "&" + baseParam;
						location.href = path;
					}

					/**
					 * 구매 상세 이동
					 */
					$scope.goPurseDetail = function(item){
						var path = $scope.URLs.PURCHASE_DETAIL + "?orderNo=" + item.gift_info.order_no + "&" + baseParam; 
						location.href = path;
					}
					
					/**
					 * 이용후기 쓰기 이동
					 */
					$scope.goCommentWrite = function(item){
						var path = $scope.URLs.WRITE_COMMENT;
						path += "?goods_no=" + item.gift_pdf_info.goods_no;
						path += "&order_no=" + item.gift_info.order_no;
						path += "&ord_dtl_sn=" + item.gift_info.ord_dtl_sn;
						path += "&" + baseParam;
						location.href = path;
					}
					/**
					 * 이용후기 수정 이동
					 */
					$scope.goCommentEdit = function(item){
						var path = $scope.URLs.EDIT_COMMENT;
						path += "?goods_no=" + item.gift_pdf_info.goods_no;
						path += "&order_no=" + item.gift_info.order_no;
						path += "&ord_dtl_sn=" + item.gift_info.ord_dtl_sn;
						path += "&" + baseParam;
						location.href = path;
					}
					
					/**
					 * 배송조회 팝업 연결
					 */
					$scope.checkDeliveryState = function(item){
						var path = item.delivery_info.url;
						
                        if(item.gift_info.status == "17" && item.gift_info.detail_status != undefined && item.gift_info.detail_status != ''){
                            //20161213 스크롤위치 기억
                            LotteStorage.setSessionStorage('presentScrollY', angular.element($window).scrollTop());   
                            LotteStorage.setSessionStorage('presentTab', $scope.UIData.presentListTab);
                            LotteStorage.setSessionStorage('sortType', $scope.sortType);                            
                            path = "/mylotte/purchase/m/smart_deli_info.do?" + $scope.baseParam + "&ord_no=" + item.gift_info.order_no + "&dlv_unit_sn="
                                    + item.gift_info.dlv_unit_sn + "&inv_no=" + item.delivery_info.invoice;
                            location.href = path;
                        }else{
                            if ($scope.appObj.isApp) {
                                openNativePopup("배송조회", path);
                            } else {
                                window.open(path);
                            }                            
                        }                                                
					}
                    
                    //20161110 주문완료&주문취소 : 알람보내기, 사유보기
                    $scope.send_alarm = false;
                    $scope.reject_pop = false;
                    $scope.selectItem = null;
                    $scope.send_diff = "";
                    $scope.send_cnt = 0;
                    $scope.sendAlarm = function(item){                        
                        if(item.gift_info.gift_msg_rmnd_trns_cnt == 0){
                            alert("선물 알람 보내기는\n최대 3번까지만 가능합니다.");
                        }else{
                            $scope.selectItem = item;
                            $scope.send_cnt = $scope.selectItem.gift_info.gift_msg_rmnd_trns_cnt;
                            $scope.send_diff = datesplit($scope.selectItem.gift_info.date) + " ~ "+ datesplit($scope.selectItem.gift_info.limit_date);
                            $scope.send_alarm = true;
                        }
                    }
                    //날짜비교
                    $scope.show_alarmbtn = function(item){
                        var todayDateTime = new Date(),
                            todayTime = todayDateTime.getTime(),
                            end_dt = new Date(item.gift_info.limit_date.substring(0, 4), parseInt(item.gift_info.limit_date.substring(4, 6)) - 1, item.gift_info.limit_date.substring(6, 8)),
                            endTime = end_dt.getTime(),
                            flag = true;
                        if(todayTime > endTime){
                            flag = false;
                        }
                        return flag;
                    }
                    //알람문자 보내기
                    $scope.sendAlarmFnc = function(){
                        $http({
                            url:     "/json/order/gift_send_alarm.json",
                            method:  'GET',
                            async:   false,
                            cache:   false,
                            headers: {'Accept': 'application/json', 'Pragma': 'no-cache'},
                            params:  {
                                ord_no : $scope.selectItem.gift_info.order_no,
                                dlvp_sn : $scope.selectItem.gift_info.dlvp_sn,
                                site_no : $scope.selectItem.gift_pdf_info.site_no
                            }
                        }).success(function (data) {
                            if(data.result_code == "0000"){
                                alert("알람이 발송되었습니다."); 
                                //카운트 증가                                
                                $scope.selectItem.gift_info.gift_msg_rmnd_trns_cnt -= 1 ;//data.gift_msg_rmnd_trns_cnt;
                                $scope.send_cnt = $scope.selectItem.gift_info.gift_msg_rmnd_trns_cnt;                                
                                location.reload();//새로고침 
                            }else{
                                alert(data.error_msg);
                            }
                            $scope.close_pop();  
                        });                        
                        /*
                        {
                        result_code : "0000",
                        gift_msg_rmnd_trns_cnt : 0, 남은 횟수
                        error_msg : "" 오류 메시지
                        }                    
                        */                        
                    }
                    $scope.close_pop = function(){
                        $scope.send_alarm = false;
                        $scope.reject_pop = false;                        
                    }
                    $scope.viewRefuse = function(item){
                        $scope.reject_pop = true;  
                        $scope.rfg_message = item.gift_info.rfg_msg;
                    }
                    var datesplit = function(str){
                        return str.substring(0, 4) + "." + str.substring(4, 6) + "." + str.substring(6, 8);                        
                    }
                    //반품교환신청 20161206
                    $scope.co_msg = PRESENT_COMMON.CHANGEORDER_MSG;
                    $scope.er_psb_case = 0;
                    $scope.er_index = -1;
                    $scope.open_er_psb = function(item, num, index){
                        $scope.er_index = index;
                        if(item.gift_info.ob_cd == null || item.gift_info.ob_cd == ''){ //신청전
                            if(num == 3){ //교환 옵션조회
                                $http({
                                    url:     LotteCommon.gift_optlist,
                                    method:  'GET',
                                    async:   false,
                                    cache:   false,
                                    headers: {'Accept': 'application/json', 'Pragma': 'no-cache'},
                                    params:  {
                                        ordNo : item.gift_info.order_no,
                                        ordDtlSn : item.gift_info.ord_dtl_sn,
                                        rel_qty : item.gift_pdf_info.rel_qty
                                    }
                                }).success(function (data) {
                                    if(data.result_code != undefined && data.result_code == "ETC"){                                        
                                        alert(data.error_msg);
                                    }else{
                                        if(data.option_list != undefined){
                                            $scope.selectOptList = data.option_list.option_list;
                                            $scope.er_psb_case = num;         
                                        }
                                    }
                                });                        
                                   
                            }else{
                                $scope.er_psb_case = num;                                
                            }                            
                        }else{ //신청중
                            if(item.gift_info.ob_cd == '114' && num == 3){
                                alert("해당 선물은 반품 진행중입니다.");
                            }else if(item.gift_info.ob_cd == '115' && num == 1){
                                alert("해당 선물은 교환 진행중입니다.");
                            }else{
                                $scope.er_psb_case = num + 1;    
                            }                            
                        }
                    }
                    $scope.close_er_psb = function(){
                        $scope.er_psb_case = 0;
                        $scope.er_index = -1;                        
                    }
                    //배송상태 메시지 변조
                    $scope.checkStatus = function(item){
                        var str = $scope.LV.DELIVER_STAT[item.gift_info.status];                        
                        if(item.gift_info.sct == "14" || item.gift_info.sct == "16"){
                            str = "교환" + str;
                        }else if(item.gift_info.sct == "15"){
                            str = "교환주문취소";
                        }else if(item.gift_info.sct == "17"){
                            str = "교환반품취소";
                        }
                        
                        if(item.gift_info.status == "17" && item.gift_info.detail_status != undefined && item.gift_info.detail_status != ''){
                            str = $scope.LV.DELIVER_DTL_STAT[item.gift_info.detail_status];                        
                        }
                        
                        return str;
                    }
                    //반품 또는 교환신청
                    $scope.send_er_psb = function(item, code, index){
                        //반품신청 114
                        var str = "", opt = "", success_msg = "";
                        if(code == "114"){
                            str = $("#rfg_select" + index).val();
                            success_msg = "선물 반품이 신청되었습니다.";
                            if(str == "0"){
                                alert("반품사유를 선택해 주세요.");
                                return;
                            }
                        }else{
                            str = $("#exch_select" + index).val();
                            opt = $("#opt_select" + index).val();
                            success_msg = "선물 교환이 신청되었습니다.";
                            if(opt == "-1"){
                                alert("상품옵션을 선택해 주세요.");
                                return;
                            }                            
                            if(str == "0"){
                                alert("교환사유를 선택해 주세요.");
                                return;
                            }                                                        
                        }
                        $http({
                            url:     LotteCommon.gift_change,
                            method:  'GET',
                            async:   false,
                            cache:   false,
                            headers: {'Accept': 'application/json', 'Pragma': 'no-cache'},
                            params:  {
                                ordNo : item.gift_info.order_no,
                                ordDtlSn : item.gift_info.ord_dtl_sn,
                                ob_job_tp_cd : code,
                                ob_rsn_cd : str,
                                item_no : opt
                            }                            
                        }).success(function (data) {
                            if(data.result_code != undefined && data.result_code == "ETC"){                                        
                                alert(data.error_msg);
                            }else{ //성공
                                alert(success_msg);
                                location.reload();//새로고침 
                            }
                        });                        
                        
                        
                    }
                    
					// 선물함 시작하기
					$timeout(function(){
						$scope.startOver();
					}, 0);
                    
				}
			};
		}]);

        app.filter('convertOrderNumber', function() {
            return function(str) {          
				if(str.indexOf("-") >= 0){
					return str;
				}
				return str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8) + "-" + str.substring(8, str.length);
            }
        });
    
		/*app.directive('wishlistNormalProductList', function() {
			return {
				restrict: 'E',
				templateUrl: '/lotte/resources_dev/mylotte/wish/m/wish_normal_list_container.html',
				replace: true,
				link: function($scope, el, attrs) {}
			};
		});*/
})(window, window.angular);