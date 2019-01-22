angular.module("app", [ 'Logger' ]).run(function($rootScope, $log) {
	var loopNum = 1;
	$rootScope.$watch(function() {
		$log.getLogger("app.run").info("digest loop executed[" + loopNum++ + "]");
	});
}).controller("appCtrl", function($scope, $timeout, $log) {
	var logger = $log.getLogger("appCtrl");
	logger.debug("start ctrl");

	$scope.appTitle = "헬로 월드";

	setTimeout(function() {
		$scope.appTitle = "updated from setTimeout";
		logger.debug($scope.appTitle);
	}, 2000);

	$timeout(function() {
		$scope.appTitle = "updated from $timeout";
		logger.debug($scope.appTitle);
	}, 4000);

	setTimeout(function() {
		$scope.appTitle = "updated from setTimeout";
		logger.debug($scope.appTitle);
		// $apply는 $digest()를 실행시키는 trigger에 해당한다.
		$scope.$apply();
	}, 6000);

	setTimeout(function() {
		$scope.$apply(function() {
			// $apply에 실행로직을 function argument로 전달하는 것이 좋다.
			// $apply에 전달되는 function을 실행시킬 때 angularjs는 try/catch 블럭내에서
			// 실행시킴에 따라 exception이 발생할 경우 이에 따른 에러처리를 할 수 있지만,
			// 바로 위의 예처럼 별도의 로직으로 실행할 경우 angularjs는 에러가 발생했음을 알 수 없으며,
			// 따라서 $apply도 실행되지 못한다.
			$scope.appTitle = "updated from setTimeout";
			logger.debug($scope.appTitle);
		});
	}, 8000);

	$scope.updateTitle = function() {
		$scope.appTitle = "updated from ng-click event";
		logger.debug($scope.appTitle);
	}

	logger.debug("end ctrl");
});