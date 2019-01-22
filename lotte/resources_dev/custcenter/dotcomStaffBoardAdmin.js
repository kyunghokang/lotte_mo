(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);

	app.controller('dotcomStaffBoardCtrl', ['$http', '$scope', 'LotteCommon', 'LotteForm', 'LotteUserService', 
		function($http, $scope, LotteCommon, LotteForm, LotteUserService) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "다고쳐 모바일"; //서브헤더 타이틀

		($scope.screenDataReset = function () {
			$scope.pageOptions = {
				bbsmessage: '',
				replyShowIdx: -1,
				replyContent: []
			};

			$scope.screenData = {
				page: 1,
				pageSize: 30,
				pageEnd: false,
				totalCnt: 0,
				boardList: []
			};
		})();

		LotteUserService.loadLoginInfoComplete.then(function () {
			// 닷컴 임직원 여부 확인
			if (!$scope.loginInfo.isLogin || !$scope.loginInfo.isDotStaff) {
				alert("임직원 전용 서비스 입니다.\r\n임직원 ID로 로그인 후 이용해 주세요.");

				if($scope.appObj.isNativeHeader) {
					appSendBack();
				} else {
					history.go(-1);
				}
			} else {
				// 게시판 리스트 로드
				$scope.getBBSData();
			}
		});

		// // 닷컴 임직원 여부 확인
		// if (!LotteUserService.getLoginInfo().isLogin || !LotteUserService.getLoginInfo().isDotStaff) {
		// 	alert("임직원 전용 서비스 입니다.\r\n임직원 ID로 로그인 후 이용해 주세요.");

		// 	if($scope.appObj.isNativeHeader) {
		// 		appSendBack();
		// 	} else {
		// 		history.go(-1);
		// 	}
		// }

		// 게시판 리스트 로드
		$scope.getBBSData = function () {
			var url = LotteCommon.dotcomStaffBoardData + "?" + $scope.baseParam + "&evt_no=275960";

			if ($scope.screenData.page) {
				url += "&page=" + $scope.screenData.page;
			}

			if ($scope.screenData.pageSize) {
				url += "&display_cnt=" + $scope.screenData.pageSize;
			}

			$http.get(url)
			.success(function (data) {
				$scope.screenData.boardList = $scope.screenData.boardList.concat(data.boardList);
				$scope.screenData.totalCnt = data.totalCnt;
			})
			.finally(function (data) { // Success던 Error던 항상 실행
				$scope.productListLoading = false;
				$scope.$parent.LotteSuperBlockStatus = false;
				$scope.pageLoading = false;
			});
		};

		// 글쓰기
		$scope.staffBoardWrite = function () {
			var msg = "";

			if ($scope.pageOptions.bbsmessage) {
				msg = ($scope.pageOptions.bbsmessage + "").replace(/ /ig, "");
			}

			if (msg && msg != "") {
				var postData = {
					evt_no: "275960",
					bbc_fcont: $scope.pageOptions.bbsmessage
				};

				LotteForm.FormSubmitForAjax(LotteCommon.dotcomStaffBoardWrite, postData)
				.success(function (data) {
					if (data.commonResponseEntity.response_code != "0000") {
						alert(data.commonResponseEntity.response_msg);
					} else {
						alert("등록 되었습니다.");
						$scope.screenDataReset();
						$scope.getBBSData();
						//location.reload();
					}
				});
			} else {
				alert("결함 내용을 입력해 주세요.");
			}
		};

		// 글삭제
		$scope.deleteContent = function (item) {
			if (confirm("삭제 하시겠습니까?")) {
				var postData = {
					evt_no: "275960",
					bbc_sn: item.bbcSn,
					is_admin: "Y"
				};

				LotteForm.FormSubmitForAjax(LotteCommon.dotcomStaffBoardDelete, postData)
				.success(function (data) {
					if (data.commonResponseEntity.response_code != "0000") {
						alert(data.commonResponseEntity.response_msg);
					} else {
						alert("삭제 되었습니다.");
						$scope.screenDataReset();
						$scope.getBBSData();
						// location.reload();
					}
				});
			}
		};

		// 댓글 등록
		$scope.regReplyContent = function (item) {
			var msg = "";

			if ($scope.pageOptions.replyContent[this.$index]) {
				msg = ($scope.pageOptions.replyContent[this.$index] + "").replace(/ /ig, "");
			}

			if (msg != "") {
				var postData = {
					evt_no: "275960",
					bbc_sn: item.bbcSn, 
					bbc_fcont: $scope.pageOptions.replyContent[this.$index]
				};

				LotteForm.FormSubmitForAjax(LotteCommon.dotcomStaffBoardReply, postData)
				.success(function (data) {
					if (data.commonResponseEntity.response_code != "0000") {
						alert(data.commonResponseEntity.response_msg);
					} else {
						alert("등록 되었습니다.");
						$scope.screenDataReset();
						$scope.getBBSData();
						// location.reload();
					}
				});
			} else {
				alert("댓글 내용을 입력해 주세요.");
			}
		};

		// 리스트 더보기
		$scope.moreContentShow = function () {
			if ($scope.screenData.totalCnt != $scope.screenData.boardList.length && !$scope.pageLoading) {
				$scope.pageLoading = true;
				$scope.$parent.LotteSuperBlockStatus = true;
				$scope.screenData.page++;
				$scope.getBBSData();
			}
		};
	}]);
	
	app.directive('lotteStaffContainer', ['LotteCommon', function(LotteCommon){
		return {
			templateUrl: '/lotte/resources_dev/custcenter/dotcomStaffBoardAdmin_container.html',
			replace: true,
			link: function($scope, el, attrs) {
				$scope.toggleReplyContent = function () {
					$scope.pageOptions.replyShowIdx = $scope.pageOptions.replyShowIdx == -1 ? this.$index : -1;
				}
			}
		};
	}]);
})(window, window.angular);