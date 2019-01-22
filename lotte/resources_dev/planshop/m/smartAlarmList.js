(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);

	app.controller('smartAlarmListCtrl', ['$scope', 'LotteCommon', '$http', '$filter', 'LotteUtil', '$window', '$location', 'LotteStorage', function ($scope, LotteCommon, $http, $filter, LotteUtil, $window, $location, LotteStorage) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = '알림'; /* 서브헤더 타이틀 */
		
		$scope.pushConfirm = true; // PUSH 허용여부
		$scope.app = LotteUtil.isApp();
		$scope.tabControl = $scope.app ? 'first' : 'second';

		if ($scope.locationHistoryBack) {
			// 뒤로가기로 왔을경우 이전에 보고 있던 탭으로
			var tab = LotteStorage.getSessionStorage('smartAlarmListTabControl');
			if (tab != null && typeof tab != 'undefined') {
				$scope.tabControl = tab;
			}
		}

		$scope.startledNewAlarm = false;
		$scope.smartNewAlarm = false;
		
		$scope.switchTab = function (which) {
			$scope.tabControl = which;
			LotteStorage.setSessionStorage('smartAlarmListTabControl', $scope.tabControl);

			if (which == 'first') {
				$scope.smartNewAlarm = false;
			} else if (which == 'second') {
				$scope.startledNewAlarm = false
			} else if (which == 'third') {
				$scope.startledNewAlarm = false;
				$scope.smartNewAlarm = false
			}    		
		};
		
		// setAmlist()
		$scope.setAlarmList = function (alarmTxt) {
			LotteStorage.setLocalStorage('amlist', alarmTxt);
			
			if (LotteUtil.isApp() && LotteUtil.boolAndroid(navigator.userAgent)) {
				// 안드로이드는 로컬스토리지에 접근할 수 없어 API로 넘겨준다.
				try {
					window.JsObject.callAndroid("amlist=" + alarmTxt);
				} catch (e) {}
			}

			// http/https 간 Local (session) Storage 호환 되지 않는 문제 해결을 위한 스크립트 추가
			$scope.shareStorage("local", "amlist", alarmTxt);
		};
		
		// getStartledAlarmList(): 깜짝알림 목록 조회
		$scope.getStartledAlarmList = function () {
			$scope.startledAlarmLoading = true;
			$http.get(
				LotteCommon.startledAlarmListData + '?' + $scope.baseParam + '&amlist=' + encodeURIComponent(LotteStorage.getLocalStorage('amlist'))
			).success(function (data) {
				if (data.startled_alarm_list.ntc_rcv_yn) {
					$scope.startledAlarmEmpty = (!data.startled_alarm_list.alarm_list.total_count);
					$scope.startledAlarmList = data.startled_alarm_list.alarm_list.items;
					$scope.startledNewAlarm = data.startled_alarm_list.new_alarm;
					$scope.setAlarmList(data.startled_alarm_list.alarm_txt);
				} else {
					$scope.pushConfirm = false;
				}
				$scope.getSmartAlarmList(); // 스마트알림 목록조회는 항상 깜짝알림 조회 후 실행한다.
				$scope.startledAlarmLoading = false;
			}).error(function(ex) {
				$scope.getSmartAlarmList(); // 에러 발생해도 스마트알림은 조회함
				ajaxResponseErrorHandler(ex);
				$scope.startledAlarmLoading = false;
			});
		};
		
		// getStartledAlarmList(): 깜짝알림 목록 조회
		$scope.getSmartAlarmList = function() {
			$scope.smartAlarmLoading = true;
			$http.get(
				LotteCommon.smartAlarmListData + '?' + $scope.baseParam + '&amlist=' + encodeURIComponent(LotteStorage.getLocalStorage('amlist'))
			).success(function(data) {
				$scope.smartAlarmEmpty = (!data.smart_alarm_list.alarm_list.total_count);
				$scope.smartAlarmList = data.smart_alarm_list.alarm_list.items;
				$scope.smartNewAlarm = data.smart_alarm_list.new_alarm;
				$scope.setAlarmList(data.smart_alarm_list.alarm_txt);
				LotteStorage.setLocalStorage('smart_alarm_view_time', data.smart_alarm_list.alarm_view_time); // 알림메시지 오픈 시간 20160315
				$scope.smartAlarmLoading = false;
			}).error(function(ex) {
				ajaxResponseErrorHandler(ex);
				$scope.smartAlarmLoading = false;
			});
		};
		
		if ($scope.pushConfirm && $scope.app) { 
			/*
			앱이며 PUSH 여부가 허용일때만 깜짝알림을 조회한다. 
			단, 깜짝알림과 스마트알림을 동시에 조회할 경우 amlist의 값이 꼬일 수 있으므로 순차 호출한다.
			순차 호출에 대한 구현은 getStartledAlarmList() 내부에 있다.
			 */
			$scope.getStartledAlarmList();
		} else {
			// 앱이 아닐때 깜짝알림 조회 없이 스마트알림만 조회
			$scope.getSmartAlarmList();
		}
		
		// 쇼핑사서함 목록 조회 (앱/웹 구분 없음)
		try {
			$scope.emailBargainLoading = true;
			$http.get(
				LotteCommon.emailBargainListData + '?' + $scope.baseParam
			).success(function(data) {
				$scope.emailBargainEmpty = (!data.email_bargain_list.email_list.total_count);
				$scope.emailBargainList = data.email_bargain_list.email_list.items;
				$scope.emailBargainLoading = false;
			}).error(function(ex) {
				ajaxResponseErrorHandler(ex);
				$scope.emailBargainLoading = false;
			});
		} catch (e) {
			console.error(e);
		}
		
		// linkToStartledAlarm(): 깜짝알림 링크 이동
		$scope.linkToStartledAlarm = function($index, $event) {
			var url = $scope.startledAlarmList[$index].app_link;
			url += (url.indexOf('?') != -1 ? '&' : '?') + $scope.baseParam;
			var element = $scope.startledAlarmList[$index];
			element.read_yn = 'Y'; // 읽음 표시(회색)
			$http({
				url : LotteCommon.startledAlarmReadData + '?' + $scope.baseParam,
				data : 'user_msg_id=' + element.user_msg_id + '&msg_id=' + element.msg_id,
				method : 'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
			}).success(function(data) {
				location.href = url;
			}).error(function(ex) {
				location.href = url;
			});
			$event.preventDefault(); // a태그 기본 기능 차단
		};
		
		// getSmartAlarmLinkUrl(): 스마트알림 링크 URL 생성
		$scope.getSmartAlarmLinkUrl = function($index) {
			var element = $scope.smartAlarmList[$index];
			if (element.sum_tgt_sct_cd == 'NTC_CART') {
				// 재입고알림 중 장바구니
				return LotteCommon.cateLstUrl + '?' + $scope.baseParam;
			} else {
				// 재입고알림 중 위시리스트와 상품상세 + 할인 알림
				return '/product/product_view.do?' + $scope.baseParam + '&goods_no=' + element.goods_no;
			}
		};
		
		// showAppConfig(): native 설정 화면
		$scope.showAppConfig = function() {
			$scope.sendTclick("m_DC_MyPage_Clk_Btn_24");

			if (LotteUtil.boolAndroid(navigator.userAgent)) { // 안드로이드
				window.lottebridge.opensetting('on');
			} else if (LotteUtil.boolAppInstall(navigator.userAgent)) { // IOS
				location.href = 'lottebridge://opensetting';
			}
		};
	}]);

	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/planshop/m/smartAlarmList_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});
	
	
})(window, window.angular);

/**
 * 비동기 서비스 요청 후 실패 시 핸들러
 * 		- 응답을 정상(500)으로 받은 후
 * 		  리턴된 결과로 호출됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseFailHandler = function(errorCallback) {
	alert('처리중 오류가 발생하였습니다.');
	if (errorCallback) errorCallback();
};

/**
 * 비동기 서비스 요청 후 에러 시 핸들러
 * 		- 응답을 서버수행에러(500)으로 받은 후 호출 됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseErrorHandler = function(ex, errorCallback) {
	if (ex.error) {
		var errorCode = ex.error.response_code;
		var errorMsg = ex.error.response_msg;
		if (typeof movePage != 'undefined' && movePage) {
			return;
		}
		if ('9004' == errorCode) {
			movePage = true; // global object
			// TODO ywkang2 : lotte_svc.js 를 참조해야함
			var targUrl = 'targetUrl='+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};