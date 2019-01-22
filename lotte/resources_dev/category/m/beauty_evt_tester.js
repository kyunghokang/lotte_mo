(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteSns'
	]);

	app.controller('evtTesterCtrl', ['$http', '$scope', '$window', 'commInitData', 'LotteCommon', 'LotteUtil', 'LotteCookie', function($http, $scope, $window, commInitData, LotteCommon, LotteUtil, LotteCookie) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "테스터 이벤트 신청하기"; //서브헤더 타이틀
		$scope.pageLoading = true; //페이지 첫 로딩
		$scope.isShowThisSns = true;
	
		$scope.evtNo = '';
		//$scope.addrRe = true;
		$scope.TesterApplyFlag = false;

		var easyJoinCookie = LotteCookie.getCookie("SIMPLESIGNYN");
		var side_big = LotteUtil.getLoginSeed().toUpperCase();
		
		var return_url = '';
		
		// 앱/웹 분기처리
		if($scope.schema == "") {
		 	return_url = encodeURIComponent(window.location.href, "UTF-8");
		}else{
			return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
		}

		var family_url;

		/*
		 * 스크린 데이터 로드
		 */
		if(commInitData.query['evtNo'] != undefined) {
			$scope.evtNo = commInitData.query['evtNo'];
		}

		$scope.roadData = function(){
			$http.get(LotteCommon.beautyEvtTesterData+'?evt_no='+$scope.evtNo)
			.success(function(data) {
				/* 세션 */
				$scope.evtData = data.tester_evt;
				$scope.select_addr = data.user_addr_info.addr_list[0];
				$scope.dlvp_sn = $scope.select_addr.dlvp_sn;
				$scope.evtData.evtStrDate = $scope.evtData.evtStrDate.replace(/(\d{4})(\d{2})/,'$1.$2.');
				$scope.evtData.evtEndDate = $scope.evtData.evtEndDate.replace(/(\d{4})(\d{2})/,'$1.$2.');
				$scope.evtData.winDate = $scope.evtData.winDate.replace(/(\d{4})(\d{2})/,'$1.$2.')
				family_url = LotteCommon.changeMyInfoUrl + "?sid=" + side_big + "&returnurl=" + return_url + "&custid=" + $scope.evtData.seedCustId + "&loginid=" + LotteCookie.getCookie('LOGINID') + "&pageflag=I" + "&opentype=P" + "&sch=" + $scope.schema;

				$scope.pageLoading = false;
			}).error(function(data) {
				$scope.pageLoading = false;
			});
		}
		$scope.roadData();

		$scope.testerPrdClk = function(no){
			var url = LotteCommon.prdviewUrl+'?goods_no='+no+'&'+$scope.baseParam;
			location.href = url;
		}

		$scope.memeberChange = function(){
			if($scope.loginInfo.isLogin){
				if(easyJoinCookie == "Y"){
					alert("간편회원의 정보변경은 PC에서만 가능합니다.");
					return false;
				} else {
					// 회원정보 수정
					if ($scope.appObj.isApp) { //앱 분기처리
						if($scope.appObj.isIOS){ //IOS
							outLink(family_url);
							//location.href = 'lottebridge://popup?title=회원정보수정&url=' + family_url;
							//openNativePopup('회원정보수정',family_url);
						}else{//Android
							outLink(family_url);
							//openNativePopup('회원정보수정',family_url);
							$scope.popupClose();
						}
					}else{
						outLink(family_url);
						$scope.popupClose();
					}
					//$scope.addrRe = false;
					
				}
			}else{
				alert("로그인 후 이용 가능합니다.");
			}
		}

	/*	20180910 배송지 변경 로직 삭제
		$scope.changeAddr = function(road){
			if(road){
				$scope.roadData();
				$scope.addrRe = true;
			}else{
				if($scope.loginInfo.isLogin){
					if(easyJoinCookie == "Y"){
						alert("간편회원의 정보변경은 PC에서만 가능합니다.");
						return false;
					} else {
						// 회원정보 수정
						outLink(family_url);
						$scope.addrRe = false;
					}
				}else{
					alert("로그인 후 이용 가능합니다.");
				}
			}
		}
	*/

		$scope.tstSubmit = function(){

			var writeAgree = angular.element("#request_agree");

			if($scope.evt_tit=='' || $scope.evt_tit==undefined){
				alert('제목을 작성해주세요.');
				return false;
			}

			if($scope.evt_tit.length < 4){
				alert('제목을 한글 3자 이상 입력하세요.');
				return false;
			}
			
			if($scope.evt_con=='' || $scope.evt_con==undefined){
				alert('사연을 반드시 등록해주세요.');
				return false;
			}
			if($scope.loginInfo.isSimple){
				alert('응모 가능 회원 구분이 아닙니다.\nL.POINT 통합 회원으로 가입해주세요.');
				return false;
			}

			/* 20181126 체험단이벤트 개인정보처리 위탁 동의방법 변경 */
			if(!writeAgree.is(":checked")){
				if(confirm('개인정보 활용에 동의하셔야만\n이벤트에 응모하실 수 있습니다.')){
					writeAgree.prop("checked",true);
				}
				return false;
			}
			
			var postParams = {
				evt_no : $scope.evtNo,
				bbc_tit_nm : $scope.evt_tit,
				bbc_fcont : $scope.evt_con,
				dlvp_sn : $scope.dlvp_sn
			};

			$.ajax({
				type: 'post' // test 시 get - 운영 post
				, async: false
				, url: LotteCommon.beautyEvtTesterSave
				, data: (postParams)
				, success: function(data) {
					//if(data.code.indexOf('0000')>-1){ // test 용
					if(data.indexOf('0000')>-1){
						
						$scope.TesterApplyFlag = true;
						$scope.dimmedOpen({
							target: "finish_pop",
							callback: this.popupClose
						});

						//alert("신청이 완료되었습니다.");
						//location.replace(LotteCommon.cateMidBeauty +'?'+ $scope.baseParam);
					}else if(data.indexOf('dup.err')>-1){
						alert("이미 신청하셨습니다.");
						$scope.TesterApplyFlag = false;
					}
				}
			 });
		}
			
    	$scope.popupClose = function(){
			$scope.TesterApplyFlag = false;
    		location.replace(LotteCommon.cateMidBeauty + '?' + $scope.baseParam);		    	
    	}

		
		$scope.goBeautyMainClick =function(){
			$window.location.href = LotteCommon.cateMidBeauty + "?" + $scope.baseParam;	
		}
	}]);

	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/category/m/beauty_evt_tester_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				
			}
		};
	});
})(window, window.angular);