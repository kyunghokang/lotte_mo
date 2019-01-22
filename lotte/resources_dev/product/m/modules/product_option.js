(function(window, angular, undefined) {
	var app = angular.module('app');

	app.directive('productOption', ['$http', '$timeout', '$window', '$location', 'LotteForm', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'Fnproductview',
		function ($http,$timeout, $window, $location, LotteForm, LotteCommon, LotteCookie, LotteStorage, LotteUtil, Fnproductview) {
		return {
			templateUrl : "/lotte/resources_dev/product/m/modules/product_option.html",
			replace : true,
			link : function ($scope, el, attrs) {
				var $win = angular.element($window);
				$scope.calendar = {
					date: [],
					year: '2017',
					month: '01',
					dispDate: new Date(),
					today: new Date()
				};
				
				$scope.pageUI.showOrderSimple = false; // 초기 진입시 간편주문서 가리기
				$scope.pageUI.orderBreak = false; // 간편 주문서 내 오류 발생 체크
				$scope.pageUI.option.simpleOrder = false;
				$win.on('orientationchange resize', function () { // 윈도우 창 변화 감지(옵션레이어 높이값 키패드 대응)
					$scope.optLayerMaxH();
					$scope.lpayResizeH(); // 20180510 엘페이 iframe 높이 resize
				});
				$scope.flag = false; //장바구니 담기 플래그 저장
				$scope.simpleYN = 'N'; // 엘페이 체크
				$scope.LpayEnable = true; // 엘페이 사용 가능 여부 체크
				$scope.orderNo = 0; //엘페이 주문오류시 주문번호
				$scope.popShowChk = 0; // 배송방법 안내 팝업 중복 노출 방지 코드 (default : 0 | 퀵배송 : 1 | 스마트픽 : 2)
				$scope.LpayNormal = false;
				$scope.optLayerMaxH = function() { //옵션 scroll 영역 최대 높이 지정
					var winHeight = $win.height(), // 윈도우 높이
						headHeight = angular.element('header').height(), // 헤더 높이
						optLayerHeadHeight = angular.element('.optLayerHeader').height(), // 옵션 헤더 높이
						optLayerPadding = 64; // 여백(상단주소바 대비하여 40px추가)
						optPopup = 0; // 옵션레이어 maxheight 높이

					if (optLayerHeadHeight == 0) { // 옵션 헤더 none처리로 인한 값이 없을 경우
						optLayerHeadHeight = 91;
					}

					if ($scope.appObj.isApp) {
						optPopup = winHeight - optLayerHeadHeight - optLayerPadding;
					}else {
						optPopup = winHeight - headHeight - optLayerHeadHeight - optLayerPadding;
					}
					angular.element('.optPopupWrap').css({maxHeight : optPopup});
				};
				
				$scope.optLayerMaxH();
				
				$scope.getFirstDay = function(year, month) { //첫째요일
					return new Date(year, month, 1).getDay();
				};

				$scope.getLastDay = function(year, month) { //마지막날짜
						return new Date(year, month + 1, 0).getDate();
				};

				$scope.addZero = function(n) {return n < 10 ? "0" + n : n;};
				$scope.setCalender = function(year, month) {  // 옵션 달력 
					var d = null;
					if(!year) {
						d = new Date();
					} else {
						d = new Date(year, month, 1);
					}
					$scope.calendar.date = [];
					$scope.calendar.dispDate = d;
					var lastDay = $scope.getLastDay(d.getFullYear(), d.getMonth());
					$scope.calendar.year = d.getFullYear();
					$scope.calendar.month = $scope.addZero(d.getMonth()+1);
					
					for(var i=0;i < lastDay;i++) {
						var new_d = new Date(d.getFullYear(), d.getMonth(), i+1);
						var today = false;
						var isOld = false;
						if(new_d.getFullYear() == $scope.calendar.today.getFullYear() &&
							new_d.getMonth() == $scope.calendar.today.getMonth() &&	
							new_d.getDate() == $scope.calendar.today.getDate()
						) {
							today = true;
						}
						
						if(new_d < $scope.calendar.today && !today) {
							isOld = true;
						}
						$scope.calendar.date.push({d:$scope.addZero(i+1)+"", isToday: today, isOld: isOld});
					}
					var weekFirst = new Date(d.getFullYear(), d.getMonth(), 1);
					var beforeMonthLastDay = $scope.getLastDay(d.getFullYear(), d.getMonth()-1);
					for(var i=0;i < weekFirst.getDay();i++) {
						$scope.calendar.date.splice(0, 0, {d:$scope.addZero(beforeMonthLastDay-i)+"", isToday: false, isOld: true});
					}
					
					//console.log($scope.calendar.date);
				};

				$scope.setCalender();
				
				$scope.datePrev = function() { // 이전달
					$scope.setCalender($scope.calendar.dispDate.getFullYear() ,$scope.calendar.dispDate.getMonth()-1);
				};

				$scope.dateNext = function() { // 다음달
					$scope.setCalender($scope.calendar.dispDate.getFullYear() ,$scope.calendar.dispDate.getMonth()+1);
				};
				
				$scope.closeDatePicker = function() { // 달력 닫기
					$scope.pageUI.showDatePicker = false;
				};
				
				$scope.showDatePicker = function (item, index) { // 달력 열기
					$scope.pageUI.option.selectDateInputItem.idx = item.idx;
					$scope.pageUI.option.selectDateInputItem.inputIdx = index;
					$scope.pageUI.showDatePicker = true;
				};

				$scope.selectDate = function() { // 날짜 선택
					if(this.item.isOld) {
						$scope.productViewAlert({type:'alert',msg:'선택 하실수 없는 날짜 입니다.',time:2500});
						return false;
					}

					for(var i=0;i < $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length;i++) {
						var item = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i];
						if(item.idx == $scope.pageUI.option.selectDateInputItem.idx) {
							//$scope.pageUI.option.data[item.goodsNo].inputOptList.items[$scope.selectDateInputItem.inputIdx]
							$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i].inputValue[$scope.pageUI.option.selectDateInputItem.inputIdx] = $scope.calendar.year+'-'+$scope.calendar.month+'-'+this.item.d;
							//angular.element("#item_"+item.goodsNo+'_'+item.idx+'_'+$scope.pageUI.option.selectDateInputItem.inputIdx).focus();
							break;
						}
					}
					$scope.closeDatePicker();
				};
				
				// L.Pay 아이콘 닫기
				$scope.lpayClose = function() {
					var d = new Date();
					var ymd = d.getFullYear()+""+d.getMonth()+""+d.getDate();
					var initLpayIcon = {
							show: false,
							date: ymd
						}
					LotteStorage.setLocalStorage("lpayIconInfo", initLpayIcon, 'json');
					$scope.pageUI.option.lpayShow = false;
				};
				
				// 옵션창 열기 
				$scope.showOptionBox = function(flag) {
					// console.log("selectedType : "+$scope.pageUI.option.selectedType);

					//20180807 Lpay 간편결제 추가 옵션 선택시 택배에 바로구매로 변경 
					if(!$scope.pageUI.option.selectedType || $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length <= 0){
						// 옵션 선택된 상품이 없을시 택배에 바로구매로 변경
						$scope.pageUI.option.selectedType = 'buy';
						$scope.pageUI.option.deliveryMethod.buy.type = 'ship';
						$scope.pageUI.option.radioValue = 'ship';	
					}
					
					
					//배송방법 옵션 라디오 박스 항시 노출
					$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].showMethodBox = true;
					
					// 옵션 선택 박스 오픈 
					$scope.flag = (flag) ? flag : false; // 장바구니 구분값 담기 

					$scope.resetOptionSelect();
					if($scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
						// 기획전 상품 리스트 표시
						$scope.pageUI.option.selectedBox = true;
						if(!$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length) {
							$scope.pageUI.option.selectBox = true;
						}
					} else {
						if($scope.pageUI.option.data[$scope.pageUI.option.goodsNo]) {
							if(typeof($scope.pageUI.option.data[$scope.pageUI.option.goodsNo].optSelectList) == 'object') {
								$scope.pageUI.option.selectedBox = true;
								if(!$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length) {
									$scope.pageUI.option.selectBox = true;
								}
							} else {
								// 옵션 없음 상품 수량 카운트 담기 
								if($scope.pageUI.option.selectedItem['buy'].length == 0){
									$scope.setOptionLayer($scope.pageUI.option.goodsNo, 'buy');
								}
								$scope.pageUI.option.selectedBox = true;
							}
						}
					}

					if ($scope.pageUI.option.selectedBox) {
						// APP 다운 배너가 있다면 감추기
						angular.element("#wrapper").addClass("hide_appdown_bnr");
					}

					$timeout(function() { // 옵션 헤더 높이값이 block처리 되는 딜레이 위해 timeout
						$scope.optLayerMaxH();
					},100);
				};

				// 20180710 도서.문화 소득공제 chk 로직
				$scope.buyItNow = function (tclick) {
					if($scope.pageUI.data.commonInfo.goodsCmpsCd == '30' && $scope.pageUI.cultureY){
						var cultureYnI = 0,
							_chkArray = [],
							_chkBuyItem = $scope.pageUI.option.selectedItem.buy;
						for(cultureYnI;cultureYnI < _chkBuyItem.length; cultureYnI++){
							_chkArray.push(_chkBuyItem[cultureYnI].cultureIdneYn);
						}
						var strYn = _chkArray.toString(),
							 chkY = strYn.match(/Y/g),
							 chkN = strYn.match(/N/g);
						if(chkY && chkN && chkN.length > 0 && chkY.length > 0){
							alert('해당상품은 장바구니 담기로 구매 가능합니다.');
							// 20180813 간편 주문서 비활성 처리
							$scope.pageUI.option.simpleOrder = false;
							$scope.pageUI.orderLoading = false;
							return;
						}

					}
					$scope.pageUI.cultureY = true;
					$scope.buyItNowOrigin(tclick);
				}

				// 바로구매 버튼 클릭 
				$scope.buyItNowOrigin = function (tclick) {
					if($scope.pageUI.option.data.length <= 0 && $scope.pageUI.data.commonInfo.goodsCmpsCd != '30') {
						return false;
					}

					// 20180831 GA 태깅 label
					var label = "";

					//선물하기 선택된 상태에서 옵션창을 닫았을경우 다시 옵션창 띄울때 선물하기로 변경
					if($scope.pageUI.option.selectedItem['gift'] && $scope.pageUI.option.selectedItem['gift'].length > 0){
						$scope.pageUI.option.selectedType = 'gift';
						$scope.checkSubDeilvery($scope.pageUI.option.selectedType);
					}

					if($scope.pageUI.option.selectedBox && ($scope.pageUI.option.selectedType == 'buy' || $scope.pageUI.option.selectedType == 'gift' || $scope.pageUI.option.selectedType == 'cart') && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0) {
						
						//선물하기 선택시 
						if($scope.pageUI.option.selectedType == "gift"){
							//20180903 GA 태깅 추가
							$scope.logGAEvtPrdView('바로구매바','선물하기');
							$scope.buyItGift();
						}else{
							// 주문 폼 전송
							if(tclick != undefined) {
								$scope.sendTclick(tclick);

								//20180830 GA태깅 추가
								if(tclick == 'm_RDC_ProdDetail_Clk_smartpick'){
									//스마트픽 예약상품
									$scope.logGAEvtPrdView('바로구매바','스마트픽예약주문');
								}else if(tclick == 'm_RDC_ProdDetail_Clk_Counselor'){
									//렌탈상품
									$scope.logGAEvtPrdView('바로구매바','상담신청');
								}

							} else {
								if(!$scope.LpayNormal) $scope.sendTclick('m_RDC_ProdDetail_Clk_buy'); // 엘페이주문서 -> 일반주문서 티클릭 PASS
								
								//20180830 GA태깅 추가
								if(!$scope.LpayNormal && !$scope.pageUI.option.simpleOrder){ // 일반주문서 바로결제
									label = ($scope.pageUI.data.commonInfo.rsvSaleYn) ? "예약구매" : "바로구매";
									$scope.logGAEvtPrdView('바로구매바',label);
								}
							}
							
							if($scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type == 'quick') {
								var localTime = new Date($scope.pageUI.time.localTime);
								var serverTime = new Date($scope.pageUI.time.serverTime);
								var nowServerTime = new Date($scope.pageUI.time.serverTime);
								var quickTimeS = new Date($scope.pageUI.time.quickTimeS);
								var quickTimeE = new Date($scope.pageUI.time.quickTimeE);
								var term = new Date() - localTime;
								nowServerTime.setTime(serverTime.getTime() + term);

								console.log(nowServerTime);
								if(nowServerTime < quickTimeS || nowServerTime > quickTimeE) {
									$scope.productViewAlert({type:'alert',msg:'퀵 배송 주문은 09:00 ~ 16:30에만 가능 합니다.',time:2500});
									return false;
								}
							}
						}	
						
						$scope.buy();
					} else {
						//선물하기 선택시 
						if($scope.pageUI.option.selectedType == "gift"){
							$scope.buyItGift();
						}else{
							if (tclick != undefined) {
								$scope.sendTclick(tclick);
								
								//20180830 GA태깅 추가
								if(tclick == 'm_RDC_ProdDetail_Clk_Counselor'){
									//렌탈상품
									$scope.logGAEvtPrdView('바로구매바','상담신청선택');
								}

							} else {
								$scope.sendTclick('m_RDC_ProdDetail_Clk_Ordertry');
								//20180830 GA태깅 추가
								label = ($scope.pageUI.data.commonInfo.rsvSaleYn) ? "예약구매선택" : "구매하기선택";
								$scope.logGAEvtPrdView('바로구매바',label);
							}

							if($scope.pageUI.planProduct.show && $scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
								$scope.loadProductOption($scope.pageUI.planProduct.goodsNo, 'planBuy');
								return false;
							}
							$scope.pageUI.option.selectedType = 'buy';
							$scope.showOptionBox();
						}
					}
				};
				
				// 선물하기 버튼 클릭 
				$scope.buyItGift = function() {
					
					if($scope.pageUI.option.data.length <= 0 && $scope.pageUI.data.commonInfo.goodsCmpsCd != '30') {
						return false;
					}
					if( $scope.pageUI.option.selectedBox && $scope.pageUI.option.selectedType == 'gift' && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0) {
						// 선물하기 전송
						$scope.sendTclick('m_RDC_ProdDetail_Clk_gift');
						//$scope.buy(); 선물하기 옵션 선택시 체크만 동작하도록 구매 폼 전송 제거
					} else {
						$scope.sendTclick('m_RDC_ProdDetail_Clk_gifttry');
						if($scope.pageUI.planProduct.show && $scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
							$scope.loadProductOption($scope.pageUI.planProduct.goodsNo, 'planGift');
							return false;
						}
						$scope.pageUI.option.selectedType = 'gift';
						$scope.showOptionBox();
					}
				};
				
				// 키값으로 옵션 검색 
				$scope.findOptionItem = function(goodsNo, key) {
					for(var i=0;i < $scope.pageUI.option.data[goodsNo].optDtlList.items.length;i++) {
						if($scope.pageUI.option.data[goodsNo].optDtlList.items[i].optValCd == key) {
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].goodsNo = goodsNo;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].goodsNm = $scope.pageUI.option.data[goodsNo].prdInfo.goodsNm;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].price = $scope.pageUI.option.data[goodsNo].prdInfo.price;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].dlvFee = $scope.pageUI.option.data[goodsNo].prdInfo.dlvFee;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].quick = $scope.pageUI.option.data[goodsNo].prdInfo.quickPsbYn;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].quickDispYn = $scope.pageUI.option.data[goodsNo].prdInfo.quickPsbDispYn;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].entrNo = $scope.pageUI.option.data[goodsNo].prdInfo.entrNo;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].rentalYn = $scope.pageUI.option.data[goodsNo].prdInfo.rentalYn;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].minorityLimitYn = $scope.pageUI.option.data[goodsNo].prdInfo.minorityLimitYn;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].dlvInfo = {};
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].dlvInfoSetDate = {};
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].cultureIdneYn = $scope.pageUI.option.data[goodsNo].prdInfo.culture_idne_yn;
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].easyLpayYn = $scope.pageUI.option.data[goodsNo].prdInfo.easyLpayYn; // 엘페이 체크값
							$scope.pageUI.option.data[goodsNo].optDtlList.items[i].giftYn = $scope.pageUI.option.data[goodsNo].prdInfo.giftYn; //선물하기 가능여부 체크값

							angular.copy($scope.pageUI.option.data[goodsNo].dlvInfo, $scope.pageUI.option.data[goodsNo].optDtlList.items[i].dlvInfo);
							angular.copy($scope.pageUI.option.data[goodsNo].dlvInfoSetDate, $scope.pageUI.option.data[goodsNo].optDtlList.items[i].dlvInfoSetDate);
						
							if($scope.pageUI.option.data[goodsNo].prdInfo.imgUrl) {
								$scope.pageUI.option.data[goodsNo].optDtlList.items[i].imgUrl = $scope.pageUI.option.data[goodsNo].prdInfo.imgUrl;
							}
							if($scope.pageUI.option.data[$scope.pageUI.option.goodsNo].prdInfo.purQtyLmtYn) {
								$scope.pageUI.option.data[goodsNo].optDtlList.items[i].orderCnt = $scope.pageUI.option.data[goodsNo].prdInfo.minLmtQty;
							} else {
								$scope.pageUI.option.data[goodsNo].optDtlList.items[i].orderCnt = 1;
							}
							return $scope.pageUI.option.data[goodsNo].optDtlList.items[i];
						}
					}
				};
				
				// 옵션 선택 박스 초기화
				$scope.resetOptionSelect = function() {
					$scope.pageUI.option.selectOption = [];
					$scope.pageUI.option.searchKey = '';

					if($scope.pageUI.data.commonInfo.goodsCmpsCd == '30' && $scope.pageUI.option.selectedType != 'cart') {
						// 기획전 상세인경우의 체크 
						$scope.pageUI.option.selectStep = 0;
					} else {
						$scope.pageUI.option.selectStep = 1;
					}
				};
				
				// 선택 옵션 키
				$scope.getSelectKey = function(goodsNo) {
					var selectKey = "";
					if(!$scope.pageUI.option.selectOption[0]) {
						//$scope.pageUI.option.selectOption = [];
					}

					for(var i=0;i < $scope.pageUI.option.selectOption.length;i++) {

						var selectedItem = $scope.pageUI.option.data[goodsNo].optSelectList.items[i].itemList.items[$scope.pageUI.option.selectOption[i]];
						if(selectKey != "") {
							selectKey += " x ";
						}
						selectKey += selectedItem.optValCd;
					}
					return selectKey;
				};
				
				$scope.getPlanIdx = function(goodsNo) {
					if($scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
						for(var i=0;i < $scope.pageUI.data.planPrdInfo.prdList.items.length;i++) {
							if($scope.pageUI.data.planPrdInfo.prdList.items[i].goodsNo == goodsNo) {
								return $scope.pageUI.data.planPrdInfo.prdList.items[i].idx;
							}
						}
					} else {
						return 0;
					}
				};
				
				$scope.rentalCheck = function(selectedType) {
					if($scope.pageUI.option.selectedItem[selectedType].length > 0) {
						for(var i=0;i < $scope.pageUI.option.selectedItem[selectedType].length;i++) {
							if($scope.pageUI.option.selectedItem[selectedType][i].dlvInfo.gubunCd == '4') {
								$scope.productViewAlert({type:'alert',msg:'렌탈상품 옵션선택은 1개만 가능합니다.',time:2500});
								return false;
							}
						} 
					}
					return true;
				}
				
				$scope.setOptionLayer = function(goodsNo, flag) {
					//20180809 Lpay 간편결재 초기 구매방법선택이 없을시 buy 로 설정
					$scope.pageUI.option.selectedType = (!$scope.pageUI.option.selectedType) ? "buy" : $scope.pageUI.option.selectedType ;
					
					if(!$scope.pageUI.option.data[goodsNo].optSelectList) {
						$scope.pageUI.option.selectBox = false;
						$scope.pageUI.option.selectStep = 0;
						
						var prd = $scope.pageUI.option.data[goodsNo];
						var protect = ($scope.pageUI.data.commonInfo.goodsCmpsCd == '30') ? false:true;
						var selectedType = $scope.pageUI.option.selectedType;

						if(selectedType == '') {
							selectedType = 'buy';
						}


						// console.log($scope.pageUI.option.selectedItem);
						for(var i=0;i < $scope.pageUI.option.selectedItem[selectedType].length;i++) {
							if($scope.pageUI.option.selectedItem[selectedType][i].goodsNo == goodsNo) {
								if(flag != 'planCart' && flag != 'planBuy' && flag != 'buy') {
									$scope.productViewAlert({type:'alert',msg:'이미 선택된 옵션 입니다.',time:2500});
								}
								return false;
							}
						}
						
						$scope.pageUI.option.selectedIdx++;
						var item = {
							idx: $scope.pageUI.option.selectedIdx,
							planIdx: $scope.getPlanIdx(goodsNo),
							protect: protect,
							goodsNm: prd.prdInfo.goodsNm,
							goodsNo: prd.prdInfo.goodsNo,
							dlvInfo: prd.dlvInfo,
							entrNo: prd.prdInfo.entrNo,
							deptInvQty : prd.prdInfo.deptInvQty,
							invQty : prd.prdInfo.invQty,
							price: prd.prdInfo.price,
							rentalYn: prd.prdInfo.rentalYn,
							minorityLimitYn: prd.prdInfo.minorityLimitYn,
							itemNo : 0,
							optStkYn : false,
							optValCd : "",
							optValue : "",
							imgUrl: prd.prdInfo.imgUrl,
							quick: prd.prdInfo.quickPsbYn,
							quickDispYn : prd.prdInfo.quickPsbDispYn,
							smpDispYn : prd.prdInfo.smpPsbYn,
							inputValue: [],
							orderCnt: prd.prdInfo.minLmtQty,
							cultureIdneYn : prd.prdInfo.culture_idne_yn, //20180710 도서.문화 소득공제
							easyLpayYn : prd.prdInfo.easyLpayYn, // 20180814 엘페이 간편결제 가능여부
							giftYn : prd.prdInfo.giftYn // 20180823 선물하기 가능여부 
						};


					/* 20180718 Lpay 간편 결제 추가 선물하기 기획전상품 제외(goodsCmpsCd 이 30아닐때) 로직 제거 - gift 로직 배송방법 radio내 추가 option 화 하면서 상품을 2번 담는 오류 발생
						if($scope.pageUI.data.commonInfo.goodsCmpsCd != '30') {
							if(selectedType != 'cart') {
								selectedType = 'buy';
							}
							
							if(!$scope.deliveryMethodCheck(item)) {
								return false;
							}

							$scope.pageUI.option.selectedItem[selectedType].push(item);
							$scope.pageUI.option.selectedPrice[selectedType] += ($scope.pageUI.option.data[goodsNo].prdInfo.price * item.orderCnt);
							$scope.pageUI.option.selectedCnt[selectedType] += item.orderCnt;
							$scope.pageUI.option.deliveryMethod[selectedType].onOff = {};
							angular.copy($scope.getDeliveryMethod(item), $scope.pageUI.option.deliveryMethod[selectedType].onOff);
							selectedType = 'gift';
						}
					*/
						if(flag == 'planGift') {
							selectedType = 'gift';
							if($scope.pageUI.option.selectedItem[selectedType].length > 0) {
								$scope.productViewAlert({type:'alert',msg:'선물하기 옵션 선택은 1개만 가능 합니다.',time:2500});
								return false;
							}
							$scope.pageUI.option.selectedItem[selectedType] = [];
							$scope.pageUI.option.selectedPrice[selectedType] = 0;
							$scope.pageUI.option.selectedCnt[selectedType] = 0;
						} else if(flag == 'cart' && selectedType == 'gift') {
							return false;
						}

						if(!$scope.rentalCheck(selectedType)) {
							return false;
						}
						
						if(!$scope.deliveryMethodCheck(item)) {
							return false;
						}
						
						// 장바구니 담기버튼 수정
						if($scope.flag && $scope.pageUI.option.selectedItem[selectedType].length > 0){
							$scope.pageUI.option.selectedItem[selectedType] = [];
							$scope.pageUI.option.selectedPrice[selectedType] = 0;
							$scope.pageUI.option.selectedCnt[selectedType] = 0;
						}

						$scope.pageUI.option.selectedItem[selectedType].push(item);
						
						//20180807 Lpay 간편결제 추가 선택된 구매방법(buy/cart/gift 중 선택된 값) 외의 selectedItem 상품 비우기
						angular.forEach($scope.pageUI.option.selectedItem,function(val,key){
							//console.log("selectOptionType %o",$scope.pageUI.option.selectedType);
							if($scope.pageUI.option.selectedType != key){
								//console.log("selectedOptionKey %o", key);
								$scope.pageUI.option.selectedItem[key] = [];
							}						
						});
						
						$scope.pageUI.option.selectedPrice[selectedType] += ($scope.pageUI.option.data[goodsNo].prdInfo.price * item.orderCnt);
						$scope.pageUI.option.selectedCnt[selectedType] += item.orderCnt;
						// 20180823 구매 옵션 상품 선물하기 체크
						$scope.optGiftCheck();
						
					} else {
						$scope.pageUI.option.selectBox = true;
						$scope.pageUI.option.searchKey = '';
						$scope.pageUI.option.selectStep = 1;
					}	
										
				};
				
				// 옵션 선택 
				$scope.selectOption = function(parentIdx, list) {
					if(list.dtl) {
						// 품절 확인 
						if(list.soldout) {
							return false;
						}
					}
					
					if($scope.pageUI.option.selectedType == 'gift' && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0) {
						$scope.productViewAlert({type:'alert',msg:'선물하기 옵션 선택은 1개만 가능 합니다.',time:2500});
						return false;
					}
					
					$scope.pageUI.option.searchKey = '';
					$scope.pageUI.option.selectOption[parentIdx] = list.idx;
					var goodsNo = $scope.pageUI.option.goodsNo;
					var selectKey = "";
					
					if($scope.pageUI.option.data[goodsNo].optSelectList.items.length > (parentIdx+1)) {
						selectKey = $scope.getSelectKey(goodsNo);

							// 다음 옵션 재배열
						for(var i=0;i < $scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items.length;i++) {
							var item = $scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items[i];
							$scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items[i].soldout = $scope.soldOutCheck(goodsNo, selectKey + ' x ' + item.optValCd);
							if($scope.pageUI.option.data[goodsNo].optSelectList.items.length == (parentIdx+2)) {
								var optItem = $scope.findOptionItem(goodsNo, selectKey + " x " + $scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items[i].optValCd);
								if(!optItem) {
									$scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items[i].dtl = {};
									$scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items[i].soldout = true;
								} else {
									$scope.pageUI.option.data[goodsNo].optSelectList.items[parentIdx+1].itemList.items[i].dtl = optItem;
								}
							}
						}
						$scope.pageUI.option.selectStep++;
					} else {
						selectKey = $scope.getSelectKey(goodsNo);

						for(var i=0;i < $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length;i++) {
							var targetKey = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i].goodsNo + $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i].optValCd;
							if(targetKey == goodsNo+selectKey) {
								$scope.productViewAlert({type:'alert',msg:'이미 선택된 옵션 입니다.',time:2500});
								$scope.closeSelectBox();
								return false;
							}
						}
						var item = $scope.findOptionItem(goodsNo, selectKey);
						
						if($scope.pageUI.option.selectedType == 'gift') {
							$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].splice(0,$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length); 
						}
						if(!$scope.deliveryMethodCheck(item)) {
							return false;
						}

						// 담은상품의 고유키 인덱스 부여 
						$scope.pageUI.option.selectedIdx++;
						item.idx = $scope.pageUI.option.selectedIdx;
						item.planIdx = $scope.getPlanIdx(goodsNo);
						
						item.inputValue = [];
						// 샤넬 컬러칩 URL
						if(list.colorImgUrl) {
							item.colorImgUrl = list.colorImgUrl;
						}

						//장바구니 바로담기 수정
						if($scope.flag && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0){
							$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType] = [];
							$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = 0;
							$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = 0;
						}
						
						$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].push(item);

						
						//20180807 Lpay 간편결제 추가 선택된 구매방법(buy/cart/gift 중 선택된 값) 외의 selectedItem 상품 비우기
						angular.forEach($scope.pageUI.option.selectedItem,function(val,key){

							//console.log("selectOptionType %o",$scope.pageUI.option.selectedType);
							if($scope.pageUI.option.selectedType != key){
								//console.log("selectedOptionKey %o", key);
								$scope.pageUI.option.selectedItem[key] = [];
							}						
						});

						$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] += ($scope.pageUI.option.data[goodsNo].prdInfo.price * item.orderCnt);
						$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] += item.orderCnt;
						$scope.pageUI.option.inputOption[item.itemNo] = [];
						$scope.resetOptionSelect();
						$scope.closeSelectBox();
						// 20180823 구매 옵션 상품 선물하기 체크
						$scope.optGiftCheck();
					}
				};

				// 옵션창 열기 
				$scope.openSelectBox = function() {
					//20180807 Lpay 간편결제 추가 옵션 선택시 택배에 바로구매로 변경
					if(!$scope.pageUI.option.selectedType || $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length <= 0){
						// 옵션 선택된 상품이 없을시 택배에 바로구매로 변경
						$scope.pageUI.option.selectedType = 'buy';
						$scope.pageUI.option.deliveryMethod.buy.type = 'ship';
						$scope.pageUI.option.radioValue = 'ship';	
					}

					if($scope.pageUI.option.selectedType == 'gift' && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0) {
						$scope.productViewAlert({type:'alert',msg:'선물하기 옵션 선택은 1개만 가능 합니다.',time:2500});
						return false;
					}
					if(!$scope.rentalCheck($scope.pageUI.option.selectedType)) {
						return false;
					}
					
					$scope.resetOptionSelect();
					$scope.pageUI.option.selectBox = true;
				};
				
				// 옵션창 닫기 
				$scope.closeSelectBox = function() {

					$scope.resetOptionSelect();
					$scope.pageUI.option.selectBox = false;

					if($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length <= 0) {
						$scope.closeSelectedBox();
					}
				};
				
				// 선택창 닫기
				$scope.closeSelectedBox = function() {
					$scope.pageUI.cultureY = false;
					/*20180807 Lpay 간편결제 추가 결제 레이어 닫기 로직 */
					if(!$scope.pageUI.orderSuccess && $scope.pageUI.showOrderSimple){
						// 간편주문서가 열려있고 결제완료가 되지 않을때 닫힘 방지
						return; 
					}else if($scope.pageUI.orderSuccess && $scope.pageUI.showOrderSimple){
						// 간편주문서가 열려있고 결제완료가 되었을때 주문서 레이어도 같이 닫힘 
						$scope.pageUI.showOrderSimple = false;
					}
					/* // 20180807 Lpay 간편결제 추가 결제 레이어 닫기 로직 */

					if($scope.pageUI.data.commonInfo.goodsCmpsCd != '30') {
						$scope.pageUI.option.goodsNo = $scope.pageUI.data.commonInfo.goodsNo;
					}
					
					// 장바구니 담기버튼으로 담은 상품 있을때 삭제 수정
					if($scope.flag && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0){
						$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType] = [];
						$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = 0;
						$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = 0;
						$scope.flag = false;
					}

					if($scope.pageUI.option.selectedType == 'cart') {
						$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType] = [];
						$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = 0;
						$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = 0;
					}
					// 20180807 Lpay 간편결제 추가 선택창 닫을때 주문방법 비우기
					$scope.pageUI.option.selectedType = '';
					$scope.pageUI.option.selectedBox = false;
					
					// 앱다운 배너가 있다면 다시 활성화 20180125 수정
					if (!$scope.pageUI.option.selectBox && !$scope.pageUI.planProduct.show) {
						angular.element("#wrapper").removeClass("hide_appdown_bnr");
					}
                    if($scope.pageUI.planProduct.show){ //기획전형 상세에서는 안보이게
                       $scope.appDownBnrFlag = false;
					}
				
					//20180823 엘페이 스크롤 제어
					$("body, html").css({"height":"auto","overflow":"auto"});

				};	
				
				// 선택 옵션 상품 삭제
				$scope.removeSelect = function() {

					$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] -= (this.item.price * this.item.orderCnt);
					$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] -= this.item.orderCnt;
					var selectedItem = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType];
					console.log(selectedItem.length)
					for(var i=0;i < selectedItem.length;i++) {
						if(this.item.idx == selectedItem[i].idx) {
							$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].splice(i,1);
							break;
						}
					}
					// 배송 방법 라디오 버튼 재정렬
					if($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0) {
						var goodsNo = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].goodsNo;
						$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff = $scope.getDeliveryMethod($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0]);
					
						$scope.deliveryMethodCheck($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0]);
						// 20180823 구매 옵션 상품 선물하기 체크
						$scope.optGiftCheck();
					} else {

						/*if($scope.pageUI.data.commonInfo.planPrdSmpYn && $scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
							$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].showMethodBox = true;
						} else {
							$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].showMethodBox = false;
						}*/
						//20180807 Lpay 간편결제 추가 옵션 선택 상품 없을때 가격 초기화
						$scope.resetPrice();
					}
					
					if($scope.pageUI.option.selectedType == 'cart' && !$scope.pageUI.option.data[$scope.pageUI.option.goodsNo].optSelectList) {
						$scope.closeSelectedBox();
					}
				};
				
				// 최대 주문 가능 수량 체크 
				$scope.checkStock = function(item) {
					var goodsNo = item.goodsNo;
					if(item.orderCnt == '' || item.orderCnt <= 0 || !item.orderCnt  || !parseInt(item.orderCnt)) {
						item.orderCnt = $scope.pageUI.option.data[goodsNo].prdInfo.minLmtQty ? $scope.pageUI.option.data[goodsNo].prdInfo.minLmtQty : 1;
						$scope.productViewAlert({type:'alert',msg:'최소 구매 수량은 '+item.orderCnt+'개 입니다.',time:2500});
					} else if(item.orderCnt > 20 && $scope.pageUI.option.selectedType == 'gift') {
						$scope.productViewAlert({type:'alert',msg:'구매 최대 수량은 20개 입니다.',time:2500});
						item.orderCnt = 20;
					} else if($scope.pageUI.option.data[goodsNo].prdInfo.purQtyLmtYn) {
						if(item.orderCnt > $scope.pageUI.option.data[goodsNo].prdInfo.maxLmtQty) {
							$scope.productViewAlert({type:'alert',msg:'최대 구매 수량은 '+$scope.pageUI.option.data[goodsNo].prdInfo.maxLmtQty+'개 입니다.',time:2500});
							item.orderCnt = $scope.pageUI.option.data[goodsNo].prdInfo.maxLmtQty;
						} else if(item.orderCnt < 1 || item.orderCnt < $scope.pageUI.option.data[$scope.pageUI.option.goodsNo].prdInfo.minLmtQty) {
							$scope.productViewAlert({type:'alert',msg:'최소 구매 수량은 '+$scope.pageUI.option.data[goodsNo].prdInfo.minLmtQty+'개 입니다.',time:2500});
							item.orderCnt = $scope.pageUI.option.data[goodsNo].prdInfo.minLmtQty;
						}
					} else if(item.orderCnt > item.invQty) {
						$scope.productViewAlert({type:'alert',msg:'최대 구매 수량은 '+item.invQty+'개 입니다.',time:2500});
						item.orderCnt = item.invQty;
					}

					$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = 0;
					$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = 0;
					for(var i=0;i < $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length;i++) {
						var item = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i];
						$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] += (item.price * item.orderCnt);
						$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] += item.orderCnt;
					}
				};
				
				// 주문 수량 ++
				$scope.addOrderCnt = function() {
					this.item.orderCnt++;
					$scope.checkStock(this.item);
				};
				
				// 주문 수량 -- 
				$scope.subOrderCnt = function() {
					this.item.orderCnt--;
					$scope.checkStock(this.item);
				};
				
				// 옵션 단계 변경
				$scope.changeStep = function(step) {
					if($scope.pageUI.option.selectStep < step) {
						return false;
					}
					$scope.pageUI.option.searchKey = '';
					if($scope.pageUI.option.selectOption.length > 0) {
						if(step != 0) {
							var amount = $scope.pageUI.option.selectOption.length - (step-1);
							$scope.pageUI.option.selectOption.splice(step-1, amount);
							//console.log(amount+"|"+step);
							//console.log($scope.pageUI.option.selectOption);
						} else {
							$scope.pageUI.option.selectOption.splice(0, $scope.pageUI.option.selectOption.length);
						}
					}
					$scope.pageUI.option.selectStep = step;
				};
				
				$scope.replaceKeywordText = function(text) {
					if($scope.pageUI.option.searchKey != '') {
						return text.replace($scope.pageUI.option.searchKey,'<span>'+$scope.pageUI.option.searchKey+'</span>');
					}
					return text;
				};
				
				// 옵션검색 
				$scope.optionSearchKeyword = function(type) {
					if($scope.pageUI.option.searchKey != '') {
						if(type == 'prd') {
							if(this.item.goodsNm.toLowerCase().indexOf($scope.pageUI.option.searchKey.toLowerCase()) >= 0) {
								return true;
							}
						} else {
							if(this.list.optValue.toLowerCase().indexOf($scope.pageUI.option.searchKey.toLowerCase()) >= 0) {
								return true;
							}
						}
						return false;
					}
					return true;
				};
				
				// 옵션검색 
				$scope.optionEmptySearchKeyword = function(type) {
					if($scope.pageUI.option.searchKey != '') {
						if(type == 'prd') {
							for(var i=0;i < $scope.pageUI.data.planPrdInfo.prdList.items.length;i++) {
								var item = $scope.pageUI.data.planPrdInfo.prdList.items[i];
								if(item.goodsNm.toLowerCase().indexOf($scope.pageUI.option.searchKey.toLowerCase()) >= 0) {
									return false;
								}
							}
						} else {
							for(var i=0;i < $scope.pageUI.option.data[$scope.pageUI.option.goodsNo].optSelectList.items.length;i++) {
								for(var j=0;j < $scope.pageUI.option.data[$scope.pageUI.option.goodsNo].optSelectList.items[i].itemList.items.length;j++) {
									var list = $scope.pageUI.option.data[$scope.pageUI.option.goodsNo].optSelectList.items[i].itemList.items[j];
									if(list.optValue.toLowerCase().indexOf($scope.pageUI.option.searchKey.toLowerCase()) >= 0) {
										return false;
									}
								}
							}
						}
						return true;
					}
					return false;
				};
				
				// 기획전형 상품 선택 
				$scope.selectPlanProduct = function() {
					if(this.item.soldOutYn) {
						return false;
					}
					// 기획전형 선물하기 불가 상품 차단
					if($scope.pageUI.data.commonInfo.goodsCmpsCd == '30' && ($scope.pageUI.option.selectedType == 'gift' && !this.item.giftYn)) {
						return false;
					}
					console.log("기획전 상품 선택");
					$scope.loadProductOption(this.item.goodsNo, 'select');
				};
				
				$scope.cartPlanProduct = function(goodsNo, idx) {
					console.log("기획전 상품 장바구니 선택");
					$scope.loadProductOption(goodsNo, 'planCart');
				};

				// 퀵배송 가능 시간대 체크 로직 09:00:00 - 16:30:59
				$scope.quickTimeCheck = function() {
					// $scope.pageUI.option.quickDisp = true;
					var localTime = new Date($scope.pageUI.time.localTime);
					var serverTime = new Date($scope.pageUI.time.serverTime);
					var nowServerTime = new Date($scope.pageUI.time.serverTime);
					var quickTimeS = new Date($scope.pageUI.time.quickTimeS);
					var quickTimeE = new Date($scope.pageUI.time.quickTimeE);
					var term = new Date() - localTime;
					nowServerTime.setTime(serverTime.getTime() + term);
					
					if(nowServerTime < quickTimeS || nowServerTime > quickTimeE) {
						return false;
					}
					return true;
				}
				
				// 이인성 이사님 오시면 물어봐야 하는 항목
				$scope.getDeliveryMethod = function(optItem) {
					var goodsNo = optItem.goodsNo;
					var smartpicOnly = $scope.pageUI.option.data[goodsNo].prdInfo.smpOnlyYn;
					var smartpic = optItem.smpDispYn;
					var smartpicFlag = $scope.pageUI.option.data[goodsNo].prdInfo.smpPsbYn;
					var crossPic = $scope.pageUI.option.data[goodsNo].prdInfo.crspkPsbYn;
					var quick = optItem.quick;
					var quickDisp = optItem.quickDispYn;
					var method = {ship:true, quick:quick, smartpic: smartpic, smartpicFlag:smartpicFlag ,crosspicFlag: crossPic, smartCrossPic: (smartpicFlag && crossPic)};

					if(crossPic) {
						method.ship = true;
						method.quick = false;
						method.smartpic = true;
					}
					if(smartpic) {
						method.quick = true;
						method.smartpic = true;
					}
					if(smartpicOnly && smartpic) {
						method.ship = false;
						method.quick = true;
						method.smartpic = true;
					}
					if(!smartpicOnly && smartpic) {
						method.ship = true;
						method.quick = true;
						method.smartpic = true;
					}
					if(smartpicOnly || smartpic || crossPic) {
						method.smartpic = true;
					}
					if(!quick || !quickDisp) {
						method.quick = false;
					}
					if(quickDisp) {
						method.quick = true;
					}
					if(method.quick && optItem.deptInvQty < 1) {
						method.quick = false;
					}
					// e쿠폰 상품 
					if($scope.pageUI.option.data[goodsNo].dlvInfo.gubunCd == '9') {
						method.ship = true;
						method.quick = false;
						method.smartpic = false;
					}
					
					return method;
				};
				
				$scope.showDeliveryMethodBox = function() {
					var showCnt = 0;
					var selectedType = ($scope.pageUI.option.selectedType!='') ? $scope.pageUI.option.selectedType:'buy';
					
                    var dmethod = $scope.pageUI.option.deliveryMethod[selectedType];
					if(selectedType == 'gift') {
						// 20180807 Lpay 간편결제 추가 선물하기 라디오 박스 노출 처리 및 배송방법 바꿈  
						$scope.pageUI.option.deliveryMethod[selectedType].type = 'ship';
						$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = ($scope.pageUI.data.commonInfo.giftYn) ? true : false;
					} else if(($scope.pageUI.option.deliveryMethod[selectedType].onOff.ship && $scope.pageUI.option.deliveryMethod[selectedType].onOff.quick) ||
						($scope.pageUI.option.deliveryMethod[selectedType].onOff.quick && $scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic) ||
						($scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic && $scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic)) {
						$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = true;
					} else if($scope.pageUI.option.deliveryMethod[selectedType].onOff.ship && !$scope.pageUI.option.deliveryMethod[selectedType].onOff.quick && !$scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic) {
						dmethod.type = 'ship';
						// 20180807 Lpay 간편결제 추가 선물하기 있을때 옵션바 보여주기
						dmethod.showMethodBox = ($scope.pageUI.data.commonInfo.giftYn) ? true : false;
					} else if((dmethod.onOff.ship && dmethod.onOff.quick) ||
						(dmethod.onOff.quick && dmethod.onOff.smartpic) ||
						(dmethod.onOff.smartpic && dmethod.onOff.smartpic)) {
						dmethod.showMethodBox = true;
					} else if(dmethod.onOff.ship && !dmethod.onOff.quick && !dmethod.onOff.smartpic) {
						// console.log($scope.pageUI.data.commonInfo.planPrdSmpYn,$scope.pageUI.data.commonInfo.goodsCmpsCd);
						if($scope.pageUI.data.commonInfo.planPrdSmpYn && $scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
							$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = true;
						} else {
							if($scope.pageUI.data.prdInfo.flag) {
								for(var i=0;i < $scope.pageUI.data.prdInfo.flag.length;i++) {
									if($scope.pageUI.data.prdInfo.flag[i] == 'smartpick') {
										$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = true;
										return true;
									}
								}
							}
							//20180523 선물하기 있을시 배송방법 활성화
							if($scope.pageUI.data.commonInfo.giftYn){
								$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = true;
							}else{
								$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = false;
							}
							
							dmethod.showMethodBox = false;
						}
					} else {
						$scope.pageUI.option.deliveryMethod[selectedType].showMethodBox = true;
					}
					// 배송방법 가능한 선택 값으로 셀렉팅 하기
					if(selectedType !='gift'){
						$scope.pageUI.option.radioValue  = $scope.pageUI.option.deliveryMethod[selectedType].type;
					}
				};
				
				// 배송방법 버튼 3개 활성화 정책
				$scope.deliveryMethodCheck = function(optItem) {
					// 처음 상품 선택
					var goodsNo = optItem.goodsNo;
					var deliveryMethod = $scope.getDeliveryMethod(optItem);
					var selectedType = ($scope.pageUI.option.selectedType!='') ? $scope.pageUI.option.selectedType:'buy';

					if ($scope.pageUI.option.selectedItem[selectedType].length <= 0) { // 기존 담긴 단품이 없을때
						$scope.pageUI.option.deliveryMethod[selectedType].onOff = {};
						angular.copy(deliveryMethod, $scope.pageUI.option.deliveryMethod[selectedType].onOff);
						
						if(deliveryMethod.quick) {
							$scope.pageUI.option.quickDisp = true;
							if(!$scope.quickTimeCheck()) {
								$scope.pageUI.option.deliveryMethod[selectedType].onOff.quick = false;
							}
						}
						if($scope.pageUI.option.deliveryMethod[selectedType].type == 'ship' && !deliveryMethod.ship) {
							if(deliveryMethod.quick) {
								$scope.pageUI.option.deliveryMethod[selectedType].type = 'quick';
							} else if(deliveryMethod.smartpic) {
								$scope.pageUI.option.deliveryMethod[selectedType].type = 'smartpic';
							}
						} else if($scope.pageUI.option.deliveryMethod[selectedType].type == 'quick' && !deliveryMethod.quick) {
							if(deliveryMethod.ship) {
								$scope.pageUI.option.deliveryMethod[selectedType].type = 'ship';
							} else if(deliveryMethod.smartpic) {
								$scope.pageUI.option.deliveryMethod[selectedType].type = 'smartpic';
							}
						} else if($scope.pageUI.option.deliveryMethod[selectedType].type == 'smartpic' && !deliveryMethod.smartpic) {
							if(deliveryMethod.ship) {
								$scope.pageUI.option.deliveryMethod[selectedType].type = 'ship';
							} else if(deliveryMethod.quick) {
								$scope.pageUI.option.deliveryMethod[selectedType].type = 'quick';
							}
						}
						/*20180823 엘페이간편결제 배송방법 선택 라디오 영역 항시 노출을 위해 체크 로직 제거*/
						//$scope.showDeliveryMethodBox();
						return true;
					}

					var masterDeliveryMethod = $scope.getDeliveryMethod($scope.pageUI.option.selectedItem[selectedType][0]);

					switch($scope.pageUI.option.deliveryMethod[selectedType].type) {
						case 'ship':
							if(deliveryMethod.ship != $scope.pageUI.option.deliveryMethod[selectedType].onOff.ship) {
								$scope.productViewAlert({type:'alert',msg:'택배가 불가한 상품입니다.',time:2500});
								$scope.closeSelectBox();
								return false;
							}
							break;
						case 'quick':
							if(deliveryMethod.quick != $scope.pageUI.option.deliveryMethod[selectedType].onOff.quick) {
								$scope.productViewAlert({type:'alert',msg:'퀵배송이 불가한 상품입니다.',time:2500});
								$scope.closeSelectBox();
								return false;
							}
							break;
						case 'smartpic':
							if(deliveryMethod.smartpic != $scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic) {
								$scope.productViewAlert({type:'alert',msg:'스마트픽이 불가한 상품입니다.',time:2500});
								$scope.closeSelectBox();
								return false;
							}
							if((!masterDeliveryMethod.smartpicFlag && masterDeliveryMethod.crosspicFlag && deliveryMethod.smartpicFlag && !deliveryMethod.crosspicFlag) ||
								(masterDeliveryMethod.smartpicFlag && !masterDeliveryMethod.crosspicFlag && !deliveryMethod.smartpicFlag && deliveryMethod.crosspicFlag) ||
								(masterDeliveryMethod.smartpicFlag && masterDeliveryMethod.crosspicFlag && !deliveryMethod.smartpicFlag && !deliveryMethod.crosspicFlag))
							{
								$scope.productViewAlert({type:'alert',msg:'구매가 함께 불가한 스마트픽 상품입니다.',time:2500});
								$scope.closeSelectBox();
								return false;
							} 
							
							break;
					}
					
					$scope.pageUI.option.quickDisp = false;
					$scope.pageUI.option.deliveryMethod[selectedType].onOff = {};
					angular.copy(masterDeliveryMethod, $scope.pageUI.option.deliveryMethod[selectedType].onOff);

					var smartPic = masterDeliveryMethod.smartpicFlag;
					var crossPic = masterDeliveryMethod.crosspicFlag;
					$scope.pageUI.option.minorityLimit[selectedType] = false; // 성인상품 체크 로직
					for(var i=0;i <= $scope.pageUI.option.selectedItem[selectedType].length;i++) {
						var itemDeliveryMethod = null;
						var item = null;
						if(i == $scope.pageUI.option.selectedItem[selectedType].length) {
							item = optItem;
							itemDeliveryMethod = deliveryMethod;
							$scope.pageUI.option.minorityLimit[selectedType] = ($scope.pageUI.option.minorityLimit[selectedType] || optItem.minorityLimitYn) ? true:false;
						} else {
							item = $scope.pageUI.option.selectedItem[selectedType][i];
							itemDeliveryMethod = $scope.getDeliveryMethod(item);
							$scope.pageUI.option.minorityLimit[selectedType] = ($scope.pageUI.option.minorityLimit[selectedType] || item.minorityLimitYn) ? true:false;
						}
						$scope.pageUI.option.deliveryMethod[selectedType].onOff.ship = ($scope.pageUI.option.deliveryMethod[selectedType].onOff.ship && itemDeliveryMethod.ship) ? true:false;
						$scope.pageUI.option.deliveryMethod[selectedType].onOff.quick = ($scope.pageUI.option.deliveryMethod[selectedType].onOff.quick && itemDeliveryMethod.quick) ? true:false;
						$scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic = ($scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic && itemDeliveryMethod.smartpic) ? true:false;
						
						if($scope.pageUI.option.deliveryMethod[selectedType].onOff.quick) {
							if(item.deptInvQty < 1) {
								$scope.pageUI.option.deliveryMethod[selectedType].onOff.quick = false;
							}
						}
						
						if((!itemDeliveryMethod.smartpicFlag && itemDeliveryMethod.crosspicFlag && !crossPic && smartPic) || 
							(itemDeliveryMethod.smartpicFlag && !itemDeliveryMethod.crosspicFlag && crossPic && !smartPic)) {
							$scope.pageUI.option.deliveryMethod[selectedType].onOff.smartpic = false;
						}
						smartPic = (smartPic && itemDeliveryMethod.smartpicFlag) ? true:false;
						crossPic = (crossPic && itemDeliveryMethod.crosspicFlag) ? true:false;
					}
					
					if($scope.pageUI.option.deliveryMethod[selectedType].onOff.quick) {
						$scope.pageUI.option.quickDisp = true;
						if(!$scope.quickTimeCheck()) {
							$scope.pageUI.option.deliveryMethod[selectedType].onOff.quick = false;
						}
					}
					
					/*20180823 엘페이간편결제 배송방법 선택 라디오 영역 항시 노출을 위해 체크 로직 제거*/
					//$scope.showDeliveryMethodBox();
					//console.log($scope.pageUI.option.deliveryMethod);
					return true;
				};
				
				$scope.showSoldOutClick = function(tclick) {
					$scope.sendTclick(tclick);
				}
				
				$scope.shipClick = function(tclick) {
					$scope.sendTclick(tclick);
				}
				
				// 퀵배송 안내 레이어  & 퀵배송 주문 가능시간
				$scope.popupQuickInfoClick = function(tclick) {
					if(!$scope.pageUI.option.quickDisp || $scope.pageUI.popupQuickInfo) {
						return false;
					}
					$scope.sendTclick(tclick);
					var isDisabledCk = $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.quick;
					
					if(isDisabledCk){ // 퀵배송 안내 레이어
						$scope.dimmedOpen({
							target: "popupQuickInfo",
							//dimmedOpacity : "0.6",
							callback: this.popupQuickInfoClose
						});
						$scope.pageUI.popupQuickInfo = true;
					} else { //퀵배송 주문 가능시간
						$scope.dimmedOpen({
							target: "popupQuickInfo2",
							//dimmedOpacity : "0.6",
							callback: this.popupQuickInfoClose
						});
						$scope.pageUI.popupQuickInfo2 = true;
					}
					$scope.LotteDimm.dimmedOpacity = "0.6";
					$timeout(function() {
						angular.element("#lotteDimm").css("z-index", "110");
					});
					
				};

				$scope.popupQuickInfoClose = function() {
					$scope.pageUI.popupQuickInfo = false;
					$scope.pageUI.popupQuickInfo2 = false;
					$scope.dimmedClose();
				};

				// 스마트픽 안내 레이어
				$scope.popupSmartPickInfoClick = function(tclick) {

					if(!$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.smartpic || $scope.pageUI.popupSmartPickInfo) {
						return false;
					}
					$scope.sendTclick(tclick);
					$scope.dimmedOpen({
						target: "popupSmartPickInfo",
						//dimmedOpacity : "0.6",
						callback: this.popupSmartpicInfoClose
					});
					$scope.LotteDimm.dimmedOpacity = "0.6";
					$timeout(function() {
						angular.element("#lotteDimm").css("z-index", "110");
					});
					$scope.pageUI.popupSmartPickInfo = true;
				};

				$scope.popupSmartpicInfoClose = function() {
					$scope.pageUI.popupSmartPickInfo = false;
					$scope.dimmedClose();
				};
				
				/**
				 * NSM 로그 수집 스크립트
				 */
				function sendNSMLogging() {
					var mem = $scope.loginInfo.mbrNo + "_MO";
					var tot = 0;
					var pno = "";
					var qty = 0;
					var prc = 0;
					var cat = "";
					var etc = "";
					
					var len, i, prd;
					
					// category
					// var shd = angular.element(".titLocation");
					// if(shd.length > 0 && shd.scope().cateNaviList){
					// 	var cates = shd.scope().cateNaviList;
					// 	len = cates.length;
					// 	if(len > 1 && cates[1].cur_disp_no != undefined){
					// 		cat = cates[1].cur_disp_no;
					// 	}
					// }
					cat = $scope.pageUI.data.commonInfo.collectDispSmlNm || ""; // 소카테고리명

					// products
					len = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length;

					for (var i = 0; i < len; i++) {
						prd = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i];
						qty = prd.orderCnt;
						tot = prd.price * prd.orderCnt;
						prc = prd.price;
						pno = prd.goodsNo + "_" + prd.goodsNm;
						etc = i;

						nsmConvert(mem, tot, pno, qty, prc, cat, etc);
					}
				}

				/**
				 * NSM (Cosem) 수집 스크립트
				 * @param {string} rn = mem 회원 MBRNO
				 * @param {*} amt = tot 총가격 (가격 * 수량)
				 * @param {*} pc = pno 상품번호_상품명
				 * @param {*} pa = qty 수량
				 * @param {*} pp = prc 상품가격
				 * @param {*} pg = cat 상위 카테고리
				 * @param {*} etc = 상품순번 (장바구니 담는 순번)
				 */
				function nsmConvert( rn, amt, pc, pa, pp, pg, etc ) {
					var nsmProtocol = ( location.protocol=="https:" )? "https:" :"http:";
					var nsmX = new Image();
					var accountId = "10051";
					var imageURL = nsmProtocol + "//" + "ntracker.nsm-corp.com" ;

					imageURL += "/c/rcv.php" + "?code=520&id=" + accountId + "&trans=" + encodeURI(rn) ;
					imageURL += "&value=" + amt + "&pc=" + encodeURI(pc) + "&pa=" + pa + "&pp=" + pp + "&pg=" + encodeURI(pg) + "&etc=" + encodeURI(etc) ;
					nsmX.src = imageURL;
				}
				
				// 장바구니 담기
				$scope.cartAddProc = function (cartOnly) {
					var sendInfo = {};
					angular.copy($scope.pageUI.option.orderSendInfo, sendInfo);
					delete sendInfo.common;
					LotteForm.FormSubmitForAjax(LotteCommon.cartCartInsData,sendInfo)
					.success(function (data) {
						// 선택한 옵션 초기화 및 옵션창 닫기 
						try {
							angular.element($window).trigger("refreshCartCount");
						} catch (e) {}
						
						// buzzni script
						if ($scope.sendBuzzni) $scope.sendBuzzni("cart", [$scope.pageUI.reqParam.goods_no]);

						$scope.productViewAlert({type:'cart',time:2500});

						if (!cartOnly) {
							$scope.closeSelectBox();
							$scope.closeSelectedBox();
						}
						$scope.alidoCollectLog('prdCartAdd', $scope.pageUI); // ALIDO 수집스크립트 호출(장바구니 담기)
					})
					.error(function (ex) {
						console.log(ex);

						if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert(ex.error.response_msg);
							// $scope.loginProc('N');
							Fnproductview.goToLogin($window, $scope, LotteCommon.loginUrl);
						} else if (ex.error.response_code == 'M000200') {
							alert(ex.error.response_msg);
						} else {
							alert("프로그램 오류로 인해 처리되지 않았습니다." );
							console.log('[Error]Cart Save Fail', ex.error.response_msg);
						}
					});

					if (!cartOnly) {
						sendNSMLogging();
					}
				};

				// 재입고 알림
				$scope.StockRechargeCall = function (goods_no, item_no,tclick) {
					$scope.sendTclick(tclick);						
					var mbrNo = $scope.loginInfo.mbrNo;

					if (!$scope.loginInfo.isLogin) {
						alert("로그인을 해주세요.");
						Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						return;
					}

					$http.get('/json/system/restock_alram.json', {params:{
						mbr_no: mbrNo,
						goods_no: goods_no,
						spdp_goods_no: '',
						item_no: item_no,
						channel: '1' // 1:상품상세,2:장바구니,3:위시리스트
					}})
					.success(function (data) {
						if (data.RESPONSE_CODE == '0000') {
							$scope.productViewAlert({type:'stockRechargeAlarm',time:2500, data: data});
						} else if (data.RESPONSE_CODE == '1001') {
							$scope.productViewAlert({type:'alert',msg:'상품정보가 없습니다.',time:2500});
						} else if (data.RESPONSE_CODE == '1003') {
							$scope.productViewAlert({type:'alert',msg:'신청 정보가 이미 존재 합니다.',time:2500});
						} else if (data.RESPONSE_CODE == '1004') {
							alert("로그인을 해주세요.");
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						} else {
							$scope.productViewAlert({type:'alert',msg:'상품정보가 없습니다.',time:2500});
						}
					})
					.error(function (ex) {
						if(ex.error) {
							if (ex.error.response_code == '1001') {
								$scope.productViewAlert({type:'alert',msg:'상품정보가 없습니다.',time:2500});
								return true;
							} else if (ex.error.response_code == LOGIN_EXCEPTION) {
								alert("로그인을 해주세요.");
								Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
								return true;
							}
						}
						$scope.productViewAlert({type:'alert',msg:'프로그램 오류로 인해 처리되지 않았습니다.',time:2500});
					});
				};
				
				$scope.initOrderSendInfo = function() {
					$scope.pageUI.option.orderSendInfo = { // (:^:)이 있는 것은 담은 상품이 여러개일 경우 구분자로 붙여야함
						goods_no: "", // 상품번호 (:^:) *****
						item_no: "", // 단품번호 (:^:) *****
						goods_cmps_cd: "", // 상품구성코드 : (10: 패키지상품, 20: 맞춤형상품, 30: 선택형상품 - 묶음형, 40: 추가구성형상품, 50: 일반상품 - 일반형) (:^:) *****
						goods_choc_desc: "", // (:^:)
						ord_qty: "", // 주문수량 (:^:) *****
						mast_disp_no: "", // 대표전시번호 -> 상품의 세분류 (:^:) *****
						infw_disp_no: "", // 유입전시번호 (curDispNo) -> 상품의 대분류 (:^:) *****
						infw_disp_no_sct_cd: "", // 유입전시번호구분코드 (curDispSctCd) (:^:) *****
						master_goods_yn: "", // 마스터 상품여부 Y/N (:^:) *****
						cart_sn: "", // 장바구니 일련번호 (:^:)
						cmps_qty: "", // 상품구성수량 (:^:)
						shop_memo_tp_cd: "", // 매장전단메모유형코드 (:^:)
						shop_memo_cont: "", // 매장전달메모설명 (:^:)

						// 키값 상이함 확인필요
						smp_vst_shop_no: "", // 스마트픽방문매장번호 (:^:)
						smp_vst_rsv_dtime: "", // 스마트픽방문예정일시 (:^:)

						conr_no: "", // 코너번호 (:^:)
						std_goods_no: "", // 마스터상품번호 (:^:) *****
						smp_tp_cd: "", // 스마트픽 픽업 유형 (10: 매장, 20: 데스크, 30: 락커) (:^:)
						smp_deli_loc_sn: "", // 스마트픽 인도장소 일련번호 (:^:)
						smartOrd: "", // (:^:) *****
						smp_prod_yn: "", // (:^:) *****
						smp_entr_no: "", // (:^:)
						smp_shop_no: "", // (:^:)

						// 아래 항목들 기존값에 없음...
						is_ecoupon: "", 
						entr_no: "", // 
						pImg: "", // 
						pTitle: "", // 
						pPrice: "", // 
						crspk_yn: "", // 
						crspk_psb_yn: "", // 
						crspk_corp_cd: "", // 
						crspk_corp_str_sct_cd: "", // 
						crspk_str_no: "", // 
						crspk_store: "", // 
						smp_only_yn: "", // 

						qs_yn: "" // 
					}
				};

				$scope.buildCommonOrderForm = function(goodsNo) {
					$scope.pageUI.option.orderSendInfo.common = {};
					var item = {};
					if($scope.pageUI.option.selectedType == 'cart') {
						item = $scope.pageUI.option.data[goodsNo];
					} else {
						angular.copy($scope.pageUI.data,item);
						item.prdInfo.cartType = item.commonInfo.cartType;
						item.prdInfo.mdGsgrNo = item.commonInfo.mdGsgrNo;
						item.prdInfo.tdfSctCd = item.commonInfo.tdfSctCd;
						item.prdInfo.imgUrl = $scope.pageUI.data.imgInfo.imgList[0];
						item.prdInfo.mfcpNm = item.commonInfo.mfcpNm;
					}
					$scope.pageUI.option.orderSendInfo.common.goodsNm = item.prdInfo.goodsNm;
					$scope.pageUI.option.orderSendInfo.common.cartType = item.prdInfo.cartType;
					$scope.pageUI.option.orderSendInfo.common.mdGsgrNo = item.prdInfo.mdGsgrNo;
					$scope.pageUI.option.orderSendInfo.common.maxLmtQty = item.prdInfo.maxLmtQty;
					$scope.pageUI.option.orderSendInfo.common.minLmtQty = item.prdInfo.minLmtQty;
					$scope.pageUI.option.orderSendInfo.common.tdfSctCd = item.prdInfo.tdfSctCd;
					$scope.pageUI.option.orderSendInfo.common.saveWishYn = item.prdInfo.saveWishYn;
					$scope.pageUI.option.orderSendInfo.common.imgUrl = item.prdInfo.imgUrl;
					$scope.pageUI.option.orderSendInfo.common.mfcpNm = item.prdInfo.mfcpNm;
					$scope.pageUI.option.orderSendInfo.common.brndNm = item.prdInfo.brndNm;					
				}
				
				/*
					* obj {[
					* 		goodsNo: 
					* 		itemNo:
					* 		cnt: 
					* 		curDispNo:
					* 		curDispNoSctCd:
					* 		smpPsbYn: true/false
					* 		crspkPsbYn: true/false
					* 		smpOnlyYn: true/false
					* 		quickPsbYn: true/false
					* ]}
					*/
				// 함께구매한 상품 장바구니용
				$scope.buildCartForm = function(obj) {
					$scope.initOrderSendInfo();
					if($scope.pageUI.option.selectedType == 'cart') {
						$scope.buildCommonOrderForm(obj[0].goodsNo);
					} else {
						$scope.buildCommonOrderForm($scope.pageUI.reqParam.goods_no);
					}
					for(var i=0;i < obj.length;i++) {
						var gbn_str = "";
						if(i != 0) {
							gbn_str = LOTTE_CONSTANTS['SPLIT_GUBUN_1'];
						}
						$scope.pageUI.option.orderSendInfo.goods_no += gbn_str + obj[i].goodsNo;
						$scope.pageUI.option.orderSendInfo.item_no += gbn_str + (obj[i].itemNo ? obj[i].itemNo:"0");
						$scope.pageUI.option.orderSendInfo.goods_cmps_cd += gbn_str + "50";
						$scope.pageUI.option.orderSendInfo.goods_choc_desc += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.ord_qty += gbn_str + (obj[i].cnt ? obj[i].cnt:1); //장바구니 수량 파라메터
						
						$scope.pageUI.option.orderSendInfo.infw_disp_no += gbn_str + ($scope.pageUI.reqParam.curDispNo ? $scope.pageUI.reqParam.curDispNo:$scope.pageUI.data.commonInfo.curDispNo);				// curdispNo
						$scope.pageUI.option.orderSendInfo.infw_disp_no_sct_cd += gbn_str + ($scope.pageUI.reqParam.curDispNoSctCd ? $scope.pageUI.reqParam.curDispNoSctCd:$scope.pageUI.data.commonInfo.curDispNoSctCd); // disp_stc_cd
						
						$scope.pageUI.option.orderSendInfo.master_goods_yn += gbn_str + 'N';			// 대표상품 Y/N
						$scope.pageUI.option.orderSendInfo.cart_sn += gbn_str + "";							// 장바구니번호 
						$scope.pageUI.option.orderSendInfo.cmps_qty += gbn_str + "0";									// -- 무슨겟수인지 모르나 0으로 세팅 
						$scope.pageUI.option.orderSendInfo.mast_disp_no += gbn_str + "";		// 대표 전시 번호 
						$scope.pageUI.option.orderSendInfo.shop_memo_tp_cd += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.shop_memo_cont += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.smp_vst_shop_no += gbn_str + "";								// 방문 매장 번호
						$scope.pageUI.option.orderSendInfo.smp_vst_rsv_dtime += gbn_str + "";							// 방문 일자
						$scope.pageUI.option.orderSendInfo.conr_no += gbn_str + "";										// -- 코너번호 사용안하는듯함 
						$scope.pageUI.option.orderSendInfo.std_goods_no += gbn_str + $scope.pageUI.reqParam.goods_no;	// 진입 상품 번호 
						$scope.pageUI.option.orderSendInfo.smp_tp_cd += gbn_str + "";									// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_deli_loc_sn += gbn_str + "";							// 스마트픽
						$scope.pageUI.option.orderSendInfo.smartOrd += gbn_str + "";					// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_prod_yn += gbn_str + "N";		// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_entr_no += gbn_str + "";					// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_shop_no += gbn_str + "";					// 스마트픽
						$scope.pageUI.option.orderSendInfo.is_ecoupon += gbn_str + "";					// E쿠폰 여부 필요함
						$scope.pageUI.option.orderSendInfo.crspk_yn += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_psb_yn += gbn_str + "N";
						$scope.pageUI.option.orderSendInfo.crspk_corp_cd += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_corp_str_sct_cd += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_str_no += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_store += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.smp_only_yn += gbn_str + "N";	// 스마트픽 전용
						//퀵배송 추가
						$scope.pageUI.option.orderSendInfo.qs_yn += gbn_str + "N";	// 퀵배송 가능여부 
					}
				};
				
				$scope.buildOrderForm = function() {
					$scope.initOrderSendInfo();
					if($scope.pageUI.option.selectedType == 'cart') {
						$scope.buildCommonOrderForm($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].goodsNo);
					} else {
						$scope.buildCommonOrderForm($scope.pageUI.reqParam.goods_no);
					}
					for(var i=0;i < $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length;i++) {
						var gbn_str = "";
						if(i != 0) {
							gbn_str = LOTTE_CONSTANTS['SPLIT_GUBUN_1'];
						}
						var item = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][i];
						var goodsNo = item.goodsNo;
						$scope.pageUI.option.orderSendInfo.goods_no += gbn_str + goodsNo;
						$scope.pageUI.option.orderSendInfo.item_no += gbn_str + item.itemNo;
						$scope.pageUI.option.orderSendInfo.goods_cmps_cd += gbn_str + ($scope.pageUI.option.data[goodsNo].prdInfo.goodsCmpsCd ? $scope.pageUI.option.data[goodsNo].prdInfo.goodsCmpsCd:"50");
						$scope.pageUI.option.orderSendInfo.goods_choc_desc += gbn_str + "";
						if ($scope.pageUI.option.data[goodsNo].inputOptList != undefined) {
							for (var j = 0; j < $scope.pageUI.option.data[goodsNo].inputOptList.items.length; j++) {
								var inputItem = $scope.pageUI.option.data[goodsNo].inputOptList.items[j];
								
								if(!item.inputValue.length || item.inputValue[j] == '' || item.inputValue[j] == undefined) {
									// $scope.productViewAlert({type:'alert',msg:inputItem.optNm,time:2500});
									$scope.productViewAlert({type:'alert',msg:'입력이 누락된 항목이 있습니다',time:2500});
									if(inputItem.valueType == '20') {
										$scope.showDatePicker(item,j);
									} else {
										angular.element("#item_"+goodsNo+'_'+item.idx+'_'+j).focus();
									}
									return false;
								}
								var opt_value = item.inputValue[j].replace(/-/gi, "");

								if (j > 0) {
									$scope.pageUI.option.orderSendInfo.goods_choc_desc += LOTTE_CONSTANTS['SPLIT_GUBUN_3'];
								}

								$scope.pageUI.option.orderSendInfo.goods_choc_desc += inputItem.valueType;
								$scope.pageUI.option.orderSendInfo.goods_choc_desc += ":"+inputItem.optNm;
								$scope.pageUI.option.orderSendInfo.goods_choc_desc += ":"+opt_value;
							}
						}
						$scope.pageUI.option.orderSendInfo.ord_qty += gbn_str + item.orderCnt; //장바구니 수량 파라메터
						
						if($scope.pageUI.option.selectedType == 'cart') {
							$scope.pageUI.option.orderSendInfo.infw_disp_no += gbn_str + ($scope.pageUI.option.data[goodsNo].prdInfo.curDispNo ? $scope.pageUI.option.data[goodsNo].prdInfo.curDispNo:"");				// curdispNo
							$scope.pageUI.option.orderSendInfo.infw_disp_no_sct_cd += gbn_str + ($scope.pageUI.option.data[goodsNo].prdInfo.curDispNoSctCd ? $scope.pageUI.option.data[goodsNo].prdInfo.curDispNoSctCd:""); // disp_stc_cd
						} else {
							$scope.pageUI.option.orderSendInfo.infw_disp_no += gbn_str + ($scope.pageUI.reqParam.curDispNo ? $scope.pageUI.reqParam.curDispNo:$scope.pageUI.option.data[goodsNo].prdInfo.curDispNo);				// curdispNo
							$scope.pageUI.option.orderSendInfo.infw_disp_no_sct_cd += gbn_str + ($scope.pageUI.reqParam.curDispNoSctCd ? $scope.pageUI.reqParam.curDispNoSctCd:$scope.pageUI.option.data[goodsNo].prdInfo.curDispNoSctCd); // disp_stc_cd
						}
						
						$scope.pageUI.option.orderSendInfo.master_goods_yn += gbn_str + 'N';			// 대표상품 Y/N
						$scope.pageUI.option.orderSendInfo.cart_sn += gbn_str + "";							// 장바구니번호 
						$scope.pageUI.option.orderSendInfo.cmps_qty += gbn_str + "0";									// -- 무슨겟수인지 모르나 0으로 세팅 
						$scope.pageUI.option.orderSendInfo.mast_disp_no += gbn_str + $scope.pageUI.option.data[goodsNo].prdInfo.mastDispNo;		// 대표 전시 번호 
						$scope.pageUI.option.orderSendInfo.shop_memo_tp_cd += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.shop_memo_cont += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.smp_vst_shop_no += gbn_str + "";								// 방문 매장 번호
						$scope.pageUI.option.orderSendInfo.smp_vst_rsv_dtime += gbn_str + "";							// 방문 일자
						$scope.pageUI.option.orderSendInfo.conr_no += gbn_str + "";										// -- 코너번호 사용안하는듯함 
						$scope.pageUI.option.orderSendInfo.std_goods_no += gbn_str + $scope.pageUI.reqParam.goods_no;	// 진입 상품 번호 
						$scope.pageUI.option.orderSendInfo.smp_tp_cd += gbn_str + "";									// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_deli_loc_sn += gbn_str + "";							// 스마트픽
						$scope.pageUI.option.orderSendInfo.smartOrd += gbn_str + "";					// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_prod_yn += gbn_str + ($scope.pageUI.option.data[goodsNo].prdInfo.smpPsbYn ? "Y":"N");		// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_entr_no += gbn_str + "";					// 스마트픽
						$scope.pageUI.option.orderSendInfo.smp_shop_no += gbn_str + "";					// 스마트픽
						$scope.pageUI.option.orderSendInfo.is_ecoupon += gbn_str + "";					// E쿠폰 여부 필요함
						//렌탈상품용
						if($scope.pageUI.option.data[goodsNo].prdInfo.rentalYn){
							$scope.pageUI.option.orderSendInfo.entr_no += gbn_str + $scope.pageUI.option.data[goodsNo].prdInfo.entrNo;
							$scope.pageUI.option.orderSendInfo.pImg += gbn_str + $scope.pageUI.option.data[goodsNo].prdInfo.imgUrl;
							$scope.pageUI.option.orderSendInfo.pTitle += gbn_str + $scope.pageUI.option.data[goodsNo].prdInfo.goodsNm;
							$scope.pageUI.option.orderSendInfo.pPrice += gbn_str + $scope.pageUI.option.data[goodsNo].prdInfo.price;
						}
						//크로스픽 추가
						$scope.pageUI.option.orderSendInfo.crspk_yn += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_psb_yn += gbn_str + ($scope.pageUI.option.data[goodsNo].prdInfo.crspkPsbYn ? "Y":"N");
						$scope.pageUI.option.orderSendInfo.crspk_corp_cd += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_corp_str_sct_cd += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_str_no += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.crspk_store += gbn_str + "";
						$scope.pageUI.option.orderSendInfo.smp_only_yn += gbn_str + ($scope.pageUI.option.data[goodsNo].prdInfo.smpOnlyYn ? "Y":"N");	// 스마트픽 전용
						//퀵배송 추가
						var deliveryMethod = "";
						if($scope.pageUI.option.selectedType != "") {
							deliveryMethod = $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type;
						} else {
							deliveryMethod = "";
						}
						$scope.pageUI.option.orderSendInfo.qs_yn += gbn_str + (deliveryMethod == 'quick' ? "Y":"N");	// 퀵배송
					}
					return true;
				};
				
				$scope.checkImall = function() {
					var ENTRNO_IMALL = "13145"; // imall 코드
					var isImall = ($scope.pageUI.data.commonInfo.entrNo == ENTRNO_IMALL);  //홈쇼핑상품인지 여부
					if($scope.pageUI.option.selectedType == 'cart') {
						isImall = ($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].entrNo == ENTRNO_IMALL);
					}
					return isImall;
				};

				// 아이몰 재고 수량 체크 
				$scope.imallProc = function(gubun) {
					var goods_no  = $scope.pageUI.option.orderSendInfo.goods_no;
					var item_no   = $scope.pageUI.option.orderSendInfo.item_no;
					var ord_qty   = $scope.pageUI.option.orderSendInfo.ord_qty; //장바구니 수량 파라메터

					$http({
						url:     LotteCommon.productImallStockCheckData,
						method:  'GET',
						async:   false,
						cache:   false,
						headers: {'Accept': 'application/json', 'Pragma': 'no-cache'},
						params:  {
							ord_qty : ord_qty,
							goods_no : goods_no,
							item_no : item_no
						}
					}).success(function (data) {
						if (gubun == 'cartAdd') {
							$scope.cartAddProc();
						} else {
							var goUrl;

							if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우
								var minorityLimitYn = $scope.pageUI.option.minorityLimit[$scope.pageUI.option.selectedType] ? 'Y':'N'; // 성인상품여부
								goUrl = LotteCommon.loginUrl + "?"+$scope.baseParam+"&fromPg="+LOTTE_CONSTANTS['IMALL_BUY_LOGIN']+"&minority_yn="+minorityLimitYn +"&smp_prod_yn=N&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8')+ '&imallYN=Y&orderTclick=m_RDC_ProdDetail_Clk_order';
							} else {
								goUrl = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam+'&imallYN=Y&tclick=m_RDC_ProdDetail_Clk_order';
							}

							var frm_send = el.find("#frm_send");
							frm_send.attr("action", goUrl);
							LotteForm.FormSubmit(frm_send);
						}
					}).error(function (ex) {
						if (ex.error.response_code == '1000') {
							alert(ex.error.response_msg);
						} else {
							alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
						} 
						$scope.hideStayLoading();
					});
				};
				
				$scope.optionValueCheck = function() {
					// 망고 상품 체크
					var entrNo = $scope.pageUI.data.commonInfo.entrNo;
					if($scope.pageUI.option.selectedType == 'cart') {
						entrNo = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].entrNo;
					}

					if (entrNo == "443808" && ($scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] > 30 || $scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] > 1500000)) {
						alert("망고 상품의 경우 구매수량이 30개 이상 혹은 판매금액이 150만원 이상인 경우 구매가 제한되오니 구매를 원하시면 나눠서 구매해주세요!");
						return false;
					}
					return true;
				};
				
				// 장바구니 담기 클릭 시
				$scope.cartAdd = function(tclick) {
					$scope.sendTclick(tclick); // 티클릭 전송
					//20180830 GA태깅 추가
					$scope.logGAEvtPrdView('바로구매바','장바구니');

					if ($scope.pageUI.option.selectedBox && // 옵션 선택창 활성화 여부
						($scope.pageUI.option.selectedType == 'buy' || // 옵션 선택창 타입 여부가 바로구매일때
						$scope.pageUI.option.selectedType == 'cart') && // 옵션 선택창 타입 여부가 장바구니일때
						$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length > 0) {
						if (!$scope.buildOrderForm()) {
							return false;
						}

						if (!$scope.optionValueCheck()) {
							return false;
						}
						
						if ($scope.checkImall()) {
							$scope.imallProc('cartAdd'); // 아이몰 주문
						} else {
							var isSmp = (($scope.pageUI.option.orderSendInfo.smartOrd != null && $scope.pageUI.option.orderSendInfo.smartOrd.indexOf('Y') >= 0) || $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type == 'smartpic') ? true : false; // 스마트픽 주문 여부
							if (isSmp){ // 스마트픽 예약주문이면..
								var frm_send = el.find("#frm_smart_send");
								var goUrl = LotteCommon.baseUrl + "/smartpick/m/smartpick_booking.do?" + $scope.baseParam;
								goUrl += "&url_div=C";

								//if ($scope.BasicData.product.spick_app_yn == "Y") {
								goUrl += "&spick_app_yn=N";
								//}
								//goUrl += '&tclick=m_DC_ProdDetail_Clk_Btn_4';

								$scope.pageUI.option.orderSendInfo.back_url = encodeURIComponent(window.location.href,'UTF-8');
								frm_send.attr("action", goUrl);
								LotteForm.FormSubmit(frm_send);
							} else {
								$scope.cartAddProc();
							}
						}
					} else {
						if ($scope.pageUI.planProduct.show && // 기획전 상품 자세히 보기 레이어 활성화 여부
							$scope.pageUI.data.commonInfo.goodsCmpsCd == '30') { // 기획전 상품 여부
							$scope.loadProductOption($scope.pageUI.planProduct.goodsNo, 'planBuy');
							return false;
						}

						$scope.pageUI.option.selectedType = 'buy';
						$scope.showOptionBox();
					}
				};
				
				$scope.buy = function() {
					// 주문 폼 생성
					if(!$scope.buildOrderForm()) {
						return false;
					}
					
					if(!$scope.pageUI.data.commonInfo.saleMobileYn) {
						alert("본 상품은 모바일 주문 불가능 상품 입니다.");
						return false;
					}

					if(!$scope.optionValueCheck()) {
						return false;
					}

					//선물하기 갯수에서 막음
					if($scope.pageUI.option.selectedType == 'gift' && $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length != 1){  
						alert("선물하기는 한개의 상품만 주문 가능 합니다.");
						return false;
					}
					
					// 로딩 화면 
					$scope.showStayLoading();

					if ($scope.checkImall()) {
						$scope.imallProc(); // 아이몰 주문
					} else {
						var isSmp = (($scope.pageUI.option.orderSendInfo.smartOrd != null && $scope.pageUI.option.orderSendInfo.smartOrd.indexOf('Y') >= 0) || $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type == 'smartpic') ? true : false; // 스마트픽 주문 여부
						
						//smartpick_new
						//isSmp = $("#method10:checked").length > 0;
						var goUrl;
						var frm_send = el.find("#frm_send");

						var minorityLimitYn = $scope.pageUI.option.minorityLimit[$scope.pageUI.option.selectedType] ? 'Y':'N'; // 성인상품여부
						console.log("주문 체크 로그인값 ", $scope.loginInfo.isLogin);
						
						if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우 !$scope.loginInfo.isLogin eung 임시 로 막음
							console.log("주문 체크 로그인 안한경우 ", $scope.loginInfo.isLogin);
							goUrl = LotteCommon.loginUrl + "?" + $scope.baseParam + "&fromPg=" + LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] + "&smp_buy_yn=" + (isSmp ? 'Y' : 'N') + "&minority_yn=" + minorityLimitYn + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');

							if($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].rentalYn){ //렌탈상품인경우
								frm_send = el.find("#frm_rent_send");
								goUrl = LotteCommon.loginUrl + "?" + $scope.baseParam + "&fromPg=" + LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] + "&isRental=Y&smp_buy_yn=N&minority_yn=" + minorityLimitYn + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
							}
							if (isSmp) { // 스마트픽 예약주문 이거나 크로스픽인 경우 
								frm_send = el.find("#frm_smart_send");
							}							
							//선물하기
							if($scope.pageUI.option.selectedType == 'gift'){ //비회원주문 막음
								goUrl = LotteCommon.loginUrl + "?" + $scope.baseParam + "&fromPg=" + LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] + "&fromGift=1&isRental=N&smp_buy_yn=N&minority_yn=" + minorityLimitYn + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
							}
						} else {
							console.log("주문 체크 로그인 한경우 ", $scope.loginInfo.isLogin);
							var rentalYn = $scope.pageUI.data.commonInfo.rentalYn;
							if($scope.pageUI.option.selectedType == 'cart') {
								rentalYn = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].rentalYn;
							}
							if (isSmp) { // 스마트픽 예약주문 이거나 크로스픽인 경우 
								frm_send = el.find("#frm_smart_send");
								goUrl = LotteCommon.baseUrl + "/smartpick/m/smartpick_booking.do?" + $scope.baseParam +"&gno=direct";
								if (LotteCommon.isTestFlag){                                    
									goUrl = "/smartpick/m/smartpick_booking_dev.html?" + $scope.baseParam;// +"&gno="+ $scope.BasicData.goods_no;
								}
								goUrl += "&spick_app_yn=N";
							}else if(rentalYn){ //렌탈상품
								frm_send = el.find("#frm_rent_send");
								goUrl = LotteCommon.secureUrl + "/product/m/product_rent.do?" + $scope.baseParam;
							} else {
								var tclickcd = Fnproductview.getTclickCd('N',"selectorder");
								
								// 간편주문서내 일반 주문서 버튼 클릭시 간편주문서 이동 방지 
								var normalYn = ""; 
								if($scope.LpayNormal){
									normalYn = "&normal_yn=Y"; // 일반주문서 구분값
									$scope.LpayNormal = false;
								}

								goUrl = LotteCommon.secureUrl + "/order/m/order_form.do?" + $scope.baseParam + normalYn;
							}
						}

						if ($scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type != 'smartpic' && !rentalYn && goUrl.indexOf(LotteCommon.loginUrl) == -1) {
							goUrl += '&tclick=m_RDC_ProdDetail_Clk_order';
						} else if ($scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type != 'smartpic' && !rentalYn && goUrl.indexOf(LotteCommon.loginUrl) > -1) { // 이동되는 페이지가 로그인 페이지라면
							goUrl += '&orderTclick=m_RDC_ProdDetail_Clk_order';
						}
						
						/* 20180502 간편 주문서 추가 */
						// 간편주문서 구분값 $scope.simpleOrder : true  =  간편주문서  
						if($scope.pageUI.option.simpleOrder){
							goUrl = (LotteCommon.isTestFlag) ? "/HTML/product/order_simple.html" : LotteCommon.secureUrl + "/order/m/order_form.do?" + $scope.baseParam; // 간편편주문서 iframe src 
							$scope.simpleYN ='Y'; // 엘페이 주문서 true
							
						}else{
							$scope.simpleYN ='N'; // 엘페이 주문서 false로 변경
							$scope.pageUI.targetFrame = ""; // 기존 주문서 호출시 target 비우기
						}
						/* // 20180502 간편 주문서 추가 */
						$scope.pageUI.option.orderSendInfo.back_url = encodeURIComponent(window.location.href,'UTF-8');
						//alert(goUrl);
						frm_send.attr("action", goUrl);
						LotteForm.FormSubmit(frm_send);
					}
				};
				
				/**
				 * @ngdoc function
				 * @name optGiftCheck
				 * @description
				 * 상품 옵션 선택하여 구매 상품리스트에 담을 시 담긴 상품 선물하기 가능여부 체크(담긴 상품이 1개일때만 체크)
				*/
				$scope.optGiftCheck = function(){

					if($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length  == 1){
						$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.giftYn = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0].giftYn;
					}else{
						$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.giftYn = false;
					}

					
					// 옵션값 재정의 (필요한 값만 = 택배,퀵배송,스마트픽,선물 가능 값만 체크)					
					$scope.selectedDil = {
						ship : $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.ship,
						quick : $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.quick,
						smartpic : $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.smartpic,
						giftYn : $scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].onOff.giftYn
					}

					//배송방법 옵션 리셋 체크
					$scope.optCheck($scope.selectedDil);
				}	

				/**
				 * @ngdoc function
				 * @name optCheck
				 * @description
				 * 상품 옵션 선택시 배송방법 라디오버튼 리셋
				 * @param {object} optList // 라디오 버튼(ship,quick,smartpic,giftYn 만 담긴 obj)
				 * @param {String} value // 가능한 체크값이 아닐경우 담는 선택값
				*/
				$scope.optCheck = function(optList,value){
					
					if(!value){
						var firstChk = true,
							firstKey = "";

						// 선택 가능 첫번째 값 담기 	
						angular.forEach(optList,function(val,key){
							if(val && firstChk){
								firstKey = key;
								firstChk = false;
							}
						});

						$scope.optCheck(optList,firstKey);
					}else{

						if(!value) return ;

						// 라디오 버튼 진입시 세팅 변경 	
						angular.forEach(optList,function(val,key){
							if($scope.pageUI.option.radioValue == key && !val){
								$scope.pageUI.option.radioValue = value;
							}
						});
					}
				}

				/**
				 * @ngdoc fucntion
				 * @name checkSubDeilvery
				 * @description
				 * 배송방법 및 선물하기 선택 함수
				 * @param {string} val - 선택된 radio value
				*/

				$scope.checkSubDeilvery = function(val){
					if($scope.pageUI.option.selectedType != "gift"){
						//선물하기 이전 타입 저장
						$scope.pageUI.option.holdingType = $scope.pageUI.option.selectedType;
					}
					switch(val){
						case 'gift':
							 //선물하기 선택시 배송방법 ship 고정
							$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type = 'ship';
							$scope.sendTclick('m_RDC_ProdDetail_Clk_Btn05');
							$scope.popShowChk = 0; // 팝업 코드 초기화

							if($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType].length <= 1){
							
								// 선물하기(상품1개만 가능) 상품 개수 1개 이하만 담기
								$scope.pageUI.option.selectedItem["gift"] = $scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType];
								$scope.pageUI.option.selectedPrice["gift"] = $scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType];
								$scope.pageUI.option.selectedCnt["gift"] = $scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType];
								$scope.pageUI.option.selectedType = "gift";
							}
						break;
						case 'quick':
						
							$scope.pageUI.option.selectedType = $scope.pageUI.option.holdingType; // 이전 선택된 주문방법으로 세팅
							$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type = val;
				
							if($scope.popShowChk != 1){ // 중복 팝업 노출 방지
								$scope.popupQuickInfoClick('m_RDC_ProdDetail_Clk_Btn02');
							}
								$scope.popShowChk = 1; // 퀵배송 팝업 코드
						
							//기존 타입이 선물하기에서 변경된 경우 선물하기 상품 옵션 선택된 타입에 담기
							if($scope.pageUI.option.holdingType !='gift' && $scope.pageUI.option.selectedCnt["gift"] > 0){
								//변경된 옵션값 옮기기 위한 처리
								$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedItem["gift"];
								$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedPrice["gift"];
								$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedCnt["gift"];

								// 선물하기 비우기
								$scope.pageUI.option.selectedItem["gift"] = [];
								$scope.pageUI.option.selectedPrice["gift"] = 0;
								$scope.pageUI.option.selectedCnt["gift"] = 0;
							}
						break;
						case 'smartpic':
							$scope.pageUI.option.selectedType = $scope.pageUI.option.holdingType; // 이전 선택된 주문방법으로 세팅
							$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type = val;
							
							if($scope.popShowChk != 2){ // 중복 팝업 노출 방지
								$scope.popupSmartPickInfoClick('m_RDC_ProdDetail_Clk_Btn03');
							}
								$scope.popShowChk = 2; //스마트픽 팝업 코드
							
							//기존 타입이 선물하기에서 변경된 경우 선물하기 상품 옵션 선택된 타입에 담기
							if($scope.pageUI.option.holdingType !='gift' && $scope.pageUI.option.selectedCnt["gift"] > 0){
								
								//변경된 옵션값 옮기기 위한 처리
								$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedItem["gift"];
								$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedPrice["gift"];
								$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedCnt["gift"];
								
								// 선물하기 비우기
								$scope.pageUI.option.selectedItem["gift"] = [];
								$scope.pageUI.option.selectedPrice["gift"] = 0;
								$scope.pageUI.option.selectedCnt["gift"] = 0;
							}

						break;
						case 'ship':
							$scope.pageUI.option.selectedType = $scope.pageUI.option.holdingType;
							$scope.pageUI.option.deliveryMethod[$scope.pageUI.option.selectedType].type = val;
							$scope.shipClick('m_RDC_ProdDetail_Clk_Btn01');
							$scope.popShowChk = 0; // 팝업 코드 초기화
							//기존 타입이 선물하기에서 변경된 경우 선물하기 상품 옵션 선택된 타입에 담기
							if($scope.pageUI.option.holdingType !='gift' && $scope.pageUI.option.selectedCnt["gift"] > 0){

								//변경된 옵션값 옮기기 위한 처리
								$scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedItem["gift"];
								$scope.pageUI.option.selectedPrice[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedPrice["gift"];
								$scope.pageUI.option.selectedCnt[$scope.pageUI.option.selectedType] = $scope.pageUI.option.selectedCnt["gift"];
								
								// 선물하기 비우기
								$scope.pageUI.option.selectedItem["gift"] = [];
								$scope.pageUI.option.selectedPrice["gift"] = 0;
								$scope.pageUI.option.selectedCnt["gift"] = 0;
							}
						break;
					}
				
					// 배송방법 활성화 재처리
					$scope.deliveryMethodCheck($scope.pageUI.option.selectedItem[$scope.pageUI.option.selectedType][0]);
					// 20180823 구매 옵션 상품 선물하기 체크
					$scope.optGiftCheck();
				}

				/**
				 * @ngdoc function
				 * @name resetPrice
				 * @description
				 * 옵션 상품 선택된게 없고, 옵션선택 레이어가 노출되어 있을때 선택 상품 금액/수량 초기화
				*/
				$scope.resetPrice = function(){
					var priceData = $scope.pageUI.option;
					
					angular.forEach(priceData,function(value,key){

						switch(key){
							case 'selectedCnt':
							case 'selectedPrice':
							value.gift = value.buy = value.cart = 0;
							break;
							case 'selectedItem' :
							value.gift = value.buy = value.cart = [];
							break;
						}

					});
				}

				/**
				 * @ngdoc function
				 * @name simpleOrderShow
				 * @description
				 * 간편주문서 레이어 컨트롤 함수
				 * @param {boolen} show - 주문서 레이어 보기/닫기
				 * 간편 주문서 레이어 보이기 및 아이프레임 타켓 설정
				*/
				$scope.simpleOrderShow = function(){
					$scope.sendTclick("m_RDC_ProdDetail_Clk_Lpaytry");
					//20180830 GA태깅 추가
					$scope.logGAEvtPrdView('바로구매바','LPAY');

					$scope.enableLpay(); // 엘페이 가능 여부 체크
					if($scope.LpayEnable){ // 엘페이 사용 가능 여부 체크
				
						var frameEl = angular.element("#simpleOrder_form"); //iframe element
						$scope.pageUI.targetFrame = frameEl.attr("name"); // 타겟 프레임 네임 찾기
						$scope.pageUI.orderLoading = true; // 간편결제 로딩 문구 노출
						$scope.simpleOrderLoad();
						//리사이즈 이벤트
						$scope.lpayResizeH();
						// 스크롤 방지
						$("body, html").css({"height":"100%","overflow":"hidden"});	
					}
				}

				/**
				 * @ngdoc function
				 * @description
				 * 간편주문서 레이어 닫기 콜백함수
				 * @param code // 주문 성공/실패/에러 코드값  - 0: 주문성공 / 1:주문서닫기 / 2:주문서 에러 - 일반주문로직변경 / 3 : 주문서에러(주문서 진입 재고 체크시) - 주문서 레이어 오픈 방지 
				 */
				$scope.orderOffCallback = function(code){

					var tClick = "";
					var code = (code) ? code.toString() : "0"; 
					

					$scope.pageUI.targetFrame = ""; //타켓네임 제거
					$scope.pageUI.orderSuccess = (code == "0") ? true : false; // 주문 성공 여부 체크
					$scope.pageUI.showOrderSimple = $scope.pageUI.option.simpleOrder = false; // 주문서 구분 값(일반 주문서로 변경) 및 레이어 비노출 처리
					$("body, html").css({"height":"auto","overflow":"auto"});

					switch(code){
						case "0":
							$scope.sendTclick("m_RDC_ProdDetail_Lyr_Ofclose");
							$scope.closeSelectedBox();
							$scope.resetPrice(); //옵션 선택값 초기화
							$scope.pageUI.orderSuccess = false; //옵션 레이어 닫기 초기화
						break;
						case "1":
							$scope.sendTclick("m_RDC_ProdDetail_Lyr_Lpay");
						break;
						case "2":
							$scope.buyItNowOrigin(); // 주문서 구문값(일반 주문서로 변경) 후 일반 주문서 로직 타기 - > 로그아웃시 로그인페이지이동 - > 로그인 -> 일반주문서
						break;
						case "3":
							$scope.pageUI.orderBreak = true;
						break;
					}
				}
				
				/**
		 		 * @ngdoc function
		 		 * @name simpleOrderLoad
		 		 * @description
		 		 * 간편주문서 iframe 주문서 로드 및 데이터 전송 (buyItNowOrigin : 기본 구매 함수 활용)
		 		 * @example
		 		 * $scope.simpleOrderLoad();
		 		*/
				$scope.simpleOrderLoad = function(){

						$scope.pageUI.option.simpleOrder = ($scope.loginInfo.isLogin) ? true : false; // 로그인 체크 후 주문서 구분 값 (간편 주문서 : true 이외의 주문서 호출시 : false)
						$scope.buyItNow(); // 주문서 체크 기본 함수 호출 
						if(!angular.element("#wrapper").hasClass("hide_appdown_bnr")){
							//앱다운 배너가 노출되어있고 엘페이결제창 올라와있을때 
							angular.element("#wrapper").addClass("hide_appdown_bnr");
						}

						var scroll = $(window).scrollTop();
						var onceEvt = true; // iframe 로드시 레이어 오픈 한번만 실행 구분값
						// iframe 로드 완료후 레이어 오픈 및 로딩dimm 비노출 처리
						$("#simpleOrder_form").on("load",function(){
							if(!$scope.pageUI.orderSuccess && onceEvt){
								$timeout(function(){
									$scope.hideStayLoading();
									$scope.pageUI.orderLoading = false;
									$scope.pageUI.showOrderSimple = ($scope.pageUI.orderBreak) ? false : true;
									$scope.pageUI.orderBreak = false; // 주문 오류 확인코드 초기화
								//$(window).scrollTop(scroll+1);
								},2500);
							}
							onceEvt = false; // 로드시 한번 실행후 false 처리
						});
				
				}
				
				/**
				 * $scope.lpayResizeH
				 * 가로모드시 간편결제 팝업 높이 컨트롤
				 */	
				$scope.lpayResizeH =function(){
					var winHeight = $win.height(), // 윈도우 높이
						headHeight = angular.element('header').height(),
						reHeight = 0; // 헤더 높이

					if($window.orientation == 0){ //세로모드
						angular.element(".iframe_wrap").css("height","500px");

						if(winHeight <= 550){ // 디바이스 높이가 550 보다 작거나 같을때 
							angular.element(".iframe_wrap").css("height","410px");
						}

					}else{ // 가로모드
						reHeight = winHeight - headHeight; 
						angular.element(".iframe_wrap").css("height",reHeight+"px");
					}
					
				}
				
				// 일반주문서 바로가기 콜백
				$scope.normalOrder = function(){
					$scope.sendTclick("m_RDC_ProdDetail_Clk_Order");
					$scope.pageUI.option.simpleOrder = false; // 주문서 구분 값 (간편 주문서 : true 이외의 주문서 호출시 : false)
					$scope.LpayNormal = true; // 일반주문서 호출 구분값
					//일반 구매 로직 호출
					$scope.buyItNowOrigin();
				}
				
				//IOS frame width 계산 
				$scope.frameWid = function(){
					return $win.width();
				}

				// 주문완료 홈으로 가기 버튼 callBack 함수
				$scope.LpayGoHome = function(){
					
					$scope.sendTclick("m_RDC_ProdDetail_Clk_Hm");
					$scope.gotoMain(); // 공통 홈으로 가기 함수 호출

				}
				
				/**
		 		 * @ngdoc function
		 		 * @name PurchaseCallBack
		 		 * @description
		 		 * 간편주문서 주문완료 주문배송조회 이동
		 		 * @example
		 		 * $scope.PurchaseCallBack(주문번호);
				 * @param {Number} orderNo - 주문번호
		 		*/
				$scope.PurchaseCallBack = function(orderNo){
					$scope.orderNo = orderNo;		
					var frm_purchase = el.find("#frm_purchase"),
					actionUrl = LotteCommon.purchaseViewUrl + "?" + $scope.baseParam;

					frm_purchase.attr("action", actionUrl);
					LotteForm.FormSubmit(frm_purchase);
				
				}

				/**
				 * @ngdoc function
				 * @name enableLpay
				 * @description
				 * 엘페이 가능 상품 여부 확인 
				 * @example
				 * $scope.enableLpay()
				*/
				$scope.enableLpay = function(){
					
					// 엘페이 구매 여부 기본 세팅 (lpay : easyLpayYn 체크 / book : cultureIdneYn 체크)
					var enableItem = {
						lpay : {
							cnt : 0,
							prdNm : ""
						},
						book : {
							cnt : 0,
							prdNm : ""
						}
					};
					
					angular.forEach($scope.pageUI.option.selectedItem.buy,function(item){
						//엘페이 가능여부 체크
						if(!item.easyLpayYn){
							if(enableItem.lpay.cnt <= 0){
								enableItem.lpay.prdNm = item.goodsNm;
							}
							enableItem.lpay.cnt++;
						}
						
						//도서 상품 여부 체크
						if(item.cultureIdneYn == 'Y'){
							if(enableItem.book.cnt <= 0){
								enableItem.book.prdNm = item.goodsNm;
							}
							enableItem.book.cnt++;
						}
					});

					// 엘페이 구매 불가 얼럿 호출 함수
					$scope.enableLpayAlert(enableItem);
				}

				/**
				 * @ngdoc function
				 * @name enableLpayAlert
				 * @description
				 * 엘페이 구매 불가 상품 얼럿 처리
				 * @example
				 * $scope.enableLpayAlert(items)
				 * @param {Object} items - 엘페이 구매 불가 상품 확인값
				*/
				$scope.enableLpayAlert = function(items){
					var type = "", // 엘페이/ 도서 상품 체크 구분값
						title = "",
						msg = ""; // 구매 불가 얼럿 문구 

					if(items.lpay.cnt > 0 ){ // 도서 이거나 엘페이가 안되는 상품 개수가 있는경우
						type = "lpay";
						items.lpay.cnt -= 1;
					}else if( items.book.cnt > 0){
						type = "book";
						items.book.cnt -= 1;
					}

					// 얼럿 문구 체크 
					switch(type){
						case "lpay":
							title = (items.lpay.cnt >= 1) ? items.lpay.prdNm + "상품외 " + items.lpay.cnt + "건은" : items.lpay.prdNm + "상품은 ";
							msg = title + " \nL.pay 결제서비스 이용이 불가능합니다. \n다른 결제 수단을 이용해주세요.";
						break;
						case "book":
							title = (items.book.cnt >= 1) ? items.book.prdNm +"상품외 " + items.book.cnt + "건은" : items.book.prdNm + "상품은 "; 
							msg = title + " \n도서·공연비 소득공제 대상 상품으로 바로 구매로 주문 가능합니다.";
							 
						break;	
					}
					// 엘페이 가 안되는 상품이 있거나 도서 인상품이 존재할때
					if(type && type != ""){
						alert(msg); // 엘페이 사용 불가 얼럿 노출
						$scope.LpayEnable =  false; // 엘페이 페이지 load 불가능
					}else{
						$scope.LpayEnable =  true; // 엘페이 페이지 load 가능
					}
				}

				//20180824 엘페이 카드등록 마이페이지 카드등록 페이지로 보내기
				$scope.LpayCardAdd = function(){
					$window.location.href = LotteCommon.baseUrl + "/mylotte/sub/lpay_web_mng.do?" + $scope.baseParam;
				}

				//iframe 콜백 함수 
				window.normalOrder = $scope.normalOrder; //일반주문서 호출
				window.orderOffCallback = $scope.orderOffCallback; //간편결제창 닫기 호출
				window.frameWid = $scope.frameWid; // IOS 카드선택 슬라이드 넓이 변경 
				window.goMain = $scope.LpayGoHome; // 홈으로 가기 호출
				window.PurchaseCallBack = $scope.PurchaseCallBack; // 주문배송조회상세 호출
				window.LpayCardAdd = $scope.LpayCardAdd; // 엘페이 카드등록 가기
			}
		}
	}]);
})(window, window.angular);


$(document).ready(function(){
	window.addEventListener("message",callBackReceiveFn,false);

});

// 엘페이 간편결제 창 버튼 이벤트 받기 (event :구분코드 )
function callBackReceiveFn(event){
	
	var evt = event.data;

	if(evt.length > 1 && evt > 6 ){
		// 주문배송조회 바로가기
		window.PurchaseCallBack(evt);

	}else{
		
		//넘어온 값 문자열 형변환
		//evt = evt.toString();
		switch(evt){
			// 간편 결제 창 닫기 
			case "0" : // 0: 주문성공  
			case "1" : // 1:주문실패
			case "2" : // 2:주문서 에러 - 일반주문로직변경
			case "3" : // 3 : 주문서에러(주문서 진입 재고 체크시) - 주문서 레이어 오픈 방지
	
				window.orderOffCallback(evt);
			break;
			case "4" : // 일반주문서 호출
				window.normalOrder();
			break;
			case "5" : // 엘페이 카드등록 바로가기
				window.LpayCardAdd();
			break;
			case "6" : //홈 바로가기
				window.goMain();
			break;
		}
	
	}

}