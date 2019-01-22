(function(window, angular, undefined) {
		'use strict';

		var app = angular.module('app', [
				'lotteComm',
				'lotteSrh',
				'lotteSideCtg',
				// 'lotteSideMylotte',
				'lotteCommFooter',
				'lotteUtil',
				'addressInfo'
		]);

		app.controller('presentDetailCtrl', ['$scope', '$http', '$filter', 'LotteCommon', 'LotteCookie', 'LotteUtil', '$timeout', '$window', 'LotteStorage', 'commInitData', function($scope, $http, $filter, LotteCommon, LotteCookie, LotteUtil, $timeout, $window, LotteStorage, commInitData) {
			//----------------------------------------------------------------------------------------------------
			// 변수 선언
			//----------------------------------------------------------------------------------------------------
			$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)

			$scope.isWishDebug = false; // UI 디버깅용
			$scope.showWrap = true;
			$scope.contVisible = true;
			$scope.subTitle = '받은 선물 상세'; // 서브헤더 타이틀
			$scope.screenId = 'present_detail'; // 화면ID

			$scope.itemCountPerPage = 20; // 페이지당 상품 출력 개수(디폴트:20)
			$scope.currentPageNo = 0; // 현재 페이지 번호(최초 상품 로딩 시 1로 셋팅되어서 호출됨)

			// UI data object
			$scope.UIData = {}
			$scope.UIData.orderNo	= "" + commInitData.query.orderNo;
			$scope.UIData.ordDtlSn	= "" + commInitData.query.ordDtlSn;
			$scope.UIData.enableOptionList	= [];

			// UI state variables
			$scope.UIStatus = {
				isOptionChanging	: false,
				isAddressChanging	: false,
				isCouponSending		: false,
				isDataLoading		: false
			};

			
			// local variables
			$scope.LV = {
				SESSION_ID		: "PRESENT_DETAIL",
				HASH_STRING		: "prsdtl"
			}
			$scope.LV.DELIVER_STAT	= PRESENT_COMMON.DELIVER_STAT;
            $scope.LV.DELIVER_DTL_STAT	= PRESENT_COMMON.DELIVER_DTL_STAT;
			$scope.LV.DELIVER_MSG	= PRESENT_COMMON.DELIVER_MSG;
			
			// url variables
			$scope.URLs = {
				PRESENT_DETAIL	: LotteCommon.presentDetailData,
				WRITE_COMMENT	: LotteCommon.presentWriteCommentUrl,
				PRODUCT_VIEW	: LotteCommon.prdviewUrl,
				PRESENT_OPTION	: LotteCommon.presentDetailOption,
				PRESENT_ADDRESS	: LotteCommon.presentDetailAddress,
				MAIN_URL		: LotteCommon.mainUrl
			}
			
			$scope.convertOrderNumber = function(str){
				if(str.indexOf("-") >= 0){
					return str;
				}
				return str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8) + "-" + str.substring(8, str.length);
			}
		}]);

		app.directive("lotteContainer", ["LotteStorage", "$timeout", "$http", "$window","LotteCommon", function(LotteStorage, $timeout, $http, $window,LotteCommon) {
			return {
				templateUrl: '/lotte/resources_dev/mylotte/present/present_detail_container.html',
				replace: true,
				link: function($scope, el, attrs) {
					
					/**
					 * 선물함 시작하기
					 */
					$scope.startOver = function(){
						if($scope.UIData.orderNo == undefined || $scope.UIData.orderNo == "" || $scope.UIData.ordDtlSn == undefined || $scope.UIData.ordDtlSn == ""){
							console.warn("조회할 데이터가 없습니다.")
							return false;
						}
						
						$scope.loadDetailData();
					};
					
					$scope.loadDetailData = function(){
						$scope.UIStatus.isDataLoading = true;
						var url = $scope.URLs.PRESENT_DETAIL;
						var params = {
							orderNo		: $scope.UIData.orderNo,
							ordDtlSn	: $scope.UIData.ordDtlSn,
							mbr_no		: $scope.loginInfo.mbrNo
						}
						$http.get(url, {params:params})
							.success(function(data){
								var n;
								if(data.gift_info != undefined){
									if(data.gift_info.status != undefined){// 배송상태
										n = parseInt(data.gift_info.status);
										if(isNaN(n)){
											data.gift_info.status_no = 0;
										}else{
											data.gift_info.status_no = n;
										}
									}
									if(data.gift_info.use_yn != undefined){// 쿠폰상태
										n = parseInt(data.gift_info.use_yn);
										if(isNaN(n)){
											data.gift_info.use_yn_no = 0;
										}else{
											data.gift_info.use_yn_no = n;
										}
									}
									
									var status = data.gift_info.status + "";
									data.gift_info.canceled		= false;
									data.gift_info.commentable	= false;
									data.gift_info.optionable	= false;
									switch(status){
										case "12":
											data.gift_info.canceled = true;
											break;
										case "10":
										case "11":
										//case "13":
											data.gift_info.optionable = true;
											break;
										case "17":
										case "18":
											data.gift_info.commentable	= true;
										break;
									}
									if(data.gift_info.type != "01" || data.gift_prd_info.opt_list == undefined){
										data.gift_info.optionable = false;
									}
								}
								if(data.gift_msg_info != undefined){
									if(data.gift_msg_info.msg != undefined){
										data.gift_msg_info.msg = data.gift_msg_info.msg.replace(/\n/g, "<br />");
									}
								}
								
								if(data.recom_prd_lst != undefined && data.recom_prd_lst.length > 9){
									data.recom_prd_lst.length = 9;
								}
								
								$scope.UIData.detail_data = data;
								$scope.sortDisableOptionList();
								$scope.UIStatus.isDataLoading = false;
								
								// for 배송지검색 address-info DIRECTIVE
								$scope.giftData = $scope.UIData.detail_data;
								$scope.giftData.orderNo = $scope.UIData.orderNo;
								$scope.giftData.ordDtlSn = $scope.UIData.ordDtlSn;
								
							})
							.error(function(){
								console.log('Data Error : 받은 선물함');
								$scope.UIStatus.isDataLoading = false;
							});
					};
					
					/**
					 * 옵션변경 레이어 열기/닫기
					 */
					$scope.showOptionChange = function(){
						$scope.UIStatus.isOptionChanging = ! $scope.UIStatus.isOptionChanging;
						
						if($scope.UIStatus.isOptionChanging){
							$timeout(function(){
								var dl, nm, sel;
								$(".list_option dl:not(.opt_txt)").each(function(idx, itm){
									dl = $(itm);
									nm = dl.find("dt").text();
									sel = dl.find("dd select");
									sel.val($scope.getSelectedOption(nm));
									
									$scope.UIStatus.previousOption = $scope.getOptionItemNo().item_no;
								});
								
								$scope.checkSoldoutOption();
							}, 1);
						}
					};
					
					$scope.hideOptionChange = function(){
						if($scope.UIStatus.isOptionChanging){
							$scope.showOptionChange();
						}
					}
					
					/**
					 * 선택불가 옵션 배열 구하기
					 */
					$scope.sortDisableOptionList = function(){
						$scope.UIData.enableOptionList.length = 0;
						if($scope.UIData.detail_data.gift_prd_info == undefined || $scope.UIData.detail_data.gift_prd_info.opt_item_lst == undefined){
							return;
						}
						var arr = $scope.UIData.detail_data.gift_prd_info.opt_item_lst;
						var len = arr.length;
						var opt, n;
						for(var i=0; i<len; i++){
							opt = arr[i];
							n = parseInt(opt.item_no, 10);
							if(opt.inv_qty > 0){
								$scope.UIData.enableOptionList[n] = opt.opt_tval;
							}
						}
					}
					
					/**
					 * 선택불가 옵션 체크하기
					 */
					$scope.checkSoldoutOption = function(){
						try{
							var opts = [];
							var sels = [];
							var vals = [];
							var lens = [];
							var i, len, k, klen;
							len = $scope.UIData.detail_data.gift_prd_info.opt_list.length;
							for(i=0; i<len; i++){
								var sel = $("#prod_option_" + i);
								sels.push(sel);
								vals.push(sel.val());
								lens.push(sel.find("option").length);
							}
							
							var arr, str, opt;
							for(i=0; i<len; i++){
								sel = sels[i];
								opts = sel.find("option");
								klen = lens[i];
								arr = [].concat(vals);
								for(k=0; k<klen; k++){
									opt = opts.eq(k);
									arr[i] = opt.val();
									str = arr.join(" x ");
									if($scope.UIData.enableOptionList.indexOf(str) >= 0){
										opt.removeClass("na");
									}else{
										opt.addClass("na");
									}
								}
								
								if(opts.eq(sel.prop("selectedIndex")).hasClass("na")){
									sel.addClass("na");
								}else{
									sel.removeClass("na");
								}
							}
						}catch(e){}
					}
					
					/**
					 * 선택된 옵션 값 구하기
					 */
					$scope.getSelectedOption = function(name){
						if($scope.UIData.detail_data.gift_prd_info.selected_opt != undefined){
							var opt;
							var len = $scope.UIData.detail_data.gift_prd_info.selected_opt.length;
							for(var i=0; i<len; i++){
								opt = $scope.UIData.detail_data.gift_prd_info.selected_opt[i];
								if(opt.opt_name == name){
									return opt.opt_value;
									break;
								}
							}
						}
						return "";
					};
					
					$scope.getOptionString = function(){
						try{
							var opts = [];
							var sel;
							var len = $scope.UIData.detail_data.gift_prd_info.opt_list.length;
							for(var i=0; i<len; i++){
								sel = $("#prod_option_" + i);
								//opts.push(sel.prop("selectedIndex") + 1);
								opts.push(sel.val());
							}
							return opts.join(" x ");
						}catch(e){
							return "";
						}
					}
					
					$scope.getOptionItemNo = function(){
						var opt = $scope.getOptionString();
						var no = -1;
						var arr = $scope.UIData.detail_data.gift_prd_info.opt_item_lst;
						var len = arr.length;
						var item;
						for(var i=0; i<len; i++){
							item = arr[i];
							//if(item.opt_val_cd == opt){
							if(item.opt_tval == opt){
								return item;
								break;
							}
						}
						
						return {
							"item_no":-1,
							"opt_val_cd":"",
							"inv_qty":0
						};
					}
					
					/**
					 * 옵션 셀렉트 변경 
					 */
					$scope.changeOption = function(){
						if($scope.UIData.detail_data.gift_prd_info.opt_item_lst == undefined){ return; }
						
						var item = $scope.getOptionItemNo();
						var no = item.item_no;
						var old_no = $scope.UIStatus.previousOption;
						
						if(no < 0){
							//alert("옵션을 선택해 주세요.");
							alert("재고 수량이 부족합니다.");
							return;
						}
						if(no == old_no){
							alert("동일한 옵션을 선택하셨습니다.");
							//$scope.hideOptionChange();
							return;
						}
						if(item.inv_qty != undefined && item.inv_qty==0){
							alert("재고 수량이 부족합니다.");
							return;
						}
						
						var path = $scope.URLs.PRESENT_OPTION;
						var param = {
							ord_no		: $scope.UIData.orderNo,
							ord_dtl_sn	: $scope.UIData.ordDtlSn,
							goods_no	: $scope.UIData.detail_data.gift_prd_info.goods_no,
							chg_item_no	: no,
							rel_qty		: $scope.UIData.detail_data.gift_prd_info.rel_qty,
							item_no		: old_no
						};
						
						$scope.UIStatus.isDataLoading = true;
						$http.get(path, {params:param})
						.success(function(data){
							$scope.UIStatus.isDataLoading = false;
							if(data.result_code == "0000"){
								// 조회 성공
								$scope.UIData.ordDtlSn = data.ord_dtl_sn;
								$scope.updateSelectedOption();
							}else{
								// 조회 실패
								var err_msg = data.error_msg;
								if(err_msg == undefined || err_msg == ""){
									err_msg = "변경 사항을 저장하지 못했습니다.";
								}
								alert(err_msg);
							}
						})
						.error(function(){
							console.log('Data Error : 옵션 변경');
							$scope.UIStatus.isDataLoading = false;
						});
					};
					
					/**
					 * 변경된 옵션 적용
					 */
					$scope.updateSelectedOption = function(){
						var sel_opt = $scope.UIData.detail_data.gift_prd_info.selected_opt;
						var len = sel_opt.length;
						var dl, nm, opt, i, sopt;
						$(".list_option .opt_select").each(function(idx, itm){
							dl = $(itm);
							nm = dl.find("dt").text();
							opt = dl.find("dd select").val();
							
							for(i=0; i<len; i++){
								sopt = sel_opt[i];
								if(sopt.opt_name == nm){
									sopt.opt_value = opt;
									break;
								}
							}
						});
						
						$scope.UIStatus.previousOption = $scope.getOptionItemNo().item_no;
					};
					
					/**
					 * 옵션 셀렉트박스 체인지 이벤트
					 */
					$scope.optionChangeListener = function(e){
						$timeout(function(){
							$scope.checkSoldoutOption();
						}, 0);
					}
					$window.optionChangeListener = $scope.optionChangeListener;
					
					/**
					 * 배송지 변경 레이어 열기/닫기
					 */
					$scope.showAddressChange = function(){
						$scope.UIStatus.isAddressChanging = ! $scope.UIStatus.isAddressChanging;
					};
					
					$scope.hideAddressChange = function(){
						$scope.UIStatus.isAddressChanging = false;
					}
					
					/**
					 * 배송지 변경 저장
					 */
					$scope.saveAddressChange = function(){
						var addr = angular.element("#addressInfoCtrlContainer").scope().getlastAddress();
						
						if(addr.addr1 == undefined){ return; }
						
						if(addr.dlvp_sn == undefined){ addr.dlvp_sn = ""; }
						if(addr.message == undefined){ addr.message = ""; }
						addr.post_no = addr.addr_post;
						//if(addr.add_list_flag != 1){ addr.add_list_flag = 0; }
						
						var path = $scope.URLs.PRESENT_ADDRESS;
						/*var param = {
							orderNo		:$scope.UIData.orderNo,
							ordDtlSn	:$scope.UIData.ordDtlSn
						};*/
						addr.ord_no		= $scope.UIData.orderNo;
						addr.ordDtlSn	= $scope.UIData.ordDtlSn;
						addr.goods_no	= $scope.UIData.detail_data.gift_prd_info.goods_no;

						$scope.UIStatus.isDataLoading = true;
						$http.get(path, {params:addr})
						.success(function(data){
							$scope.UIStatus.isDataLoading = false;
							if(data.result && data.result.result_code == "0000"){
								// 조회 성공
                                /*
								$scope.UIData.detail_data.addr_info.addr_name = addr.addr_name;
								$scope.UIData.detail_data.addr_info.r_name = addr.r_name;
								$scope.UIData.detail_data.addr_info.addr_detail = addr.addr1 + " " + addr.addr2;
								$scope.UIData.detail_data.addr_info.addr_tel = addr.addr_tel;
								$scope.UIData.detail_data.addr_info.addr_phone = "";
								$scope.UIData.detail_data.addr_info.addr_msg = addr.message;
								
								$scope.hideAddressChange();
                                */
								//20180130 데이타 갱신을 위해서 리로드 
                                location.reload();
							}else{
								// 조회 실패
								var err_msg = data.result.error_msg;
								if(err_msg == undefined || err_msg == ""){
									err_msg = "배송지를 저장하지 못했습니다.";
								}
								alert(err_msg);
							}
						})
						.error(function(){
							console.log('Data Error : 배송지 변경');
							$scope.UIStatus.isDataLoading = false;
						});
					}

					
					/**
					 * 교환권 다시 보내기 레이어 열기
					 */
					$scope.showSendCouponLayer = function(){
						$scope.UIStatus.isCouponSending = ! $scope.UIStatus.isCouponSending;
					}
					
					/**
					 * 교환권 메시지 보내기
					 */
					$scope.sendCouponMsg = function(){
						alert("send coupon");
					}
					
					
					/**
					 * 선물후기 쓰기
					 */
					$scope.goCommentWrite = function(){
						//URLs.WRITE_COMMENT+'?'+baseParam+'&goods_no='+UIData.detail_data.gift_prd_info.goods_no
						var path = $scope.URLs.WRITE_COMMENT;
						path += "?goods_no=" + $scope.UIData.detail_data.gift_prd_info.goods_no;
						path += "&order_no=" + $scope.UIData.detail_data.gift_info.order_no;
						path += "&ord_dtl_sn=" + $scope.UIData.detail_data.gift_info.ord_dtl_sn;
						path += "&" + baseParam;
						location.href = path;
					}
					
					
					/**
					 * 추천 선물 링크 클릭
					 */
					$scope.thankProductClick = function(item){
						var path = $scope.URLs.PRODUCT_VIEW + "?" + $scope.baseParam + "&goods_no=" + item.goods_no;
						window.location.href = path;
					}
					
					
					/**
					 * 배송조회 팝업 연결
					 */
					$scope.checkDeliveryState = function(){                        
                        var deli_info = $scope.UIData.detail_data.delivery_info;
                        var gift_info = $scope.UIData.detail_data.gift_info;
						var path = deli_info.url;                        
                        if(gift_info.status == "17" && gift_info.detail_status != undefined && gift_info.detail_status != ''){
                            path = "/mylotte/purchase/m/smart_deli_info.do?" + $scope.baseParam + "&ord_no=" + gift_info.order_no + "&dlv_unit_sn=" + gift_info.dlv_unit_sn + "&inv_no=" + deli_info.invoice;
                            location.href = path;
                        }else{
                            if ($scope.appObj.isApp) {
                                openNativePopup("배송조회", path);
                            } else {
                                window.open(path);
                            }                            
                        }                        						
					}
                    //반품교환신청 20161206
                    $scope.co_msg = PRESENT_COMMON.CHANGEORDER_MSG;
                    $scope.er_psb_case = 0;
                    $scope.er_index = -1;
                    $scope.open_er_psb = function(item, num){
                        if(item.gift_info.ob_cd == null || item.gift_info.ob_cd == ''){ //신청전
                            if(num == 3){ //교환 옵션조회
                                $scope.selectOptList = null;
                                $scope.er_psb_case = num;                                            
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
                    $scope.send_er_psb = function(code){
                        //반품신청 114
                        var str = "", opt = "", success_msg = "";
                        if(code == "114"){
                            str = $("#rfg_select").val();
                            success_msg = "선물 반품이 신청되었습니다.";
                            if(str == "0"){
                                alert("반품사유를 선택해 주세요.");
                                return;
                            }
                        }else{
                            str = $("#exch_select").val();
                            opt = $("#opt_select").val();
                            success_msg = "선물 교환이 신청되었습니다.";
                            if(opt == "0"){
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
                                ordNo : $scope.UIData.detail_data.gift_info.order_no,
                                ordDtlSn : $scope.UIData.detail_data.gift_info.ord_dtl_sn,
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

		/*app.directive('wishlistNormalProductList', function() {
			return {
				restrict: 'E',
				templateUrl: '/lotte/resources_dev/mylotte/wish/m/wish_normal_list_container.html',
				replace: true,
				link: function($scope, el, attrs) {}
			};
		});*/
		
})(window, window.angular);