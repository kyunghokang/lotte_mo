angular.module("app", [ 'Logger' ])
.run(function($rootScope, $log) {
	var loopNum = 1;
	$rootScope.$watch(function() {
		$log.getLogger("app.run").info("digest loop executed[" + loopNum++ + "]");
	});
})
/**
 * app service
 */
.service('appService', function($filter, $log, $http) {
  var logger = $log.getLogger('appService');

  // GET: 상품 items
  this.get = function(request, $scope) {
    $http(request)
    .success(function(data){
      $scope.items = data.items;
    })
    .error(function(data){
      var msg = "샘플 데이터 조회중 에러발생:"+$filter('json')(data);
      logger.error(msg);
    });
  };
  
  // GET: 유저 정보
  this.getUser = function(params, $scope) {
  	var req = {
  		method: "GET",
  		url: "./user.json",
  		params: params
  	};
    $http(req)
    .success(function(data){
      $scope.user = data.user;
    })
    .error(function(data){
      var msg = "샘플 데이터 조회중 에러발생:"+$filter('json')(data);
      logger.error(msg);
    });
  };
})
/**
 * a-nineteen-check-link: 19금 처리 link directive
 */
.directive('aNineteenCheckLink', function($log, $filter) {
	var logger = $log.getLogger("aNineteenCheckLink");
	return {
		restrict: 'E',
		scope: false,
		templateUrl: "./link.tpl.html",
		link: function(scope, element, attrs) {
			// scope.user는 아직 서버로부터 데이터를 가져오지 못한 상태이므로 if (scope.user.age > 19) 와 같은 조건식은 undefined 에러를 일으킨다.
			logger.debug("scope.type:"+scope.item.type+", scope.user:"+scope.user);
//			if (scope.user.age < 19) {
//				// TypeError: Cannot read property 'age' of undefined 가 발생한다.
//			}
			scope.$watch('user', function() {
				logger.debug("scope.type:"+scope.item.type+", scope.user:"+$filter('json')(scope.user));
				if (!scope.user) {
					return;
				}
				if (scope.item.type == "19" && scope.user.age < 19) {
					element.html(scope.item.name);
				}
			});
		}
	};
})
/**
 * a-nineteen-check-compile: 19금 처리 compile directive
 */
.directive('aNineteenCheckCompile', function($log, $filter) {
	var logger = $log.getLogger("aNineteenCheckCompile");
	return {
		restrict: 'E',
		templateUrl: "./link.tpl.html",
		compile: function(element, attrs) {
			logger.debug("compile executed");
			return {
				pre: function preLink(scope, element, attrs, controller) {
					logger.debug("scope.item:"+scope.item);
					scope.$watch('user', function() {
						logger.debug("scope.type:"+scope.item.type+", scope.user:"+$filter('json')(scope.user));
						if (!scope.user) {
							return;
						}
						if (scope.item.type == "19" && scope.user.age < 19) {
							element.html(scope.item.name);
						}	
					});
				}
			}
		}
	};
})
/**
 * app controller
 */
.controller("appCtrl", function($scope, $log, $location, appService) {
	var logger = $log.getLogger("appCtrl");
	logger.debug("start ctrl");

	appService.getUser({delay: 3000}, $scope);
	appService.get({method: 'GET', url: "./data.json", params: $location.search()}, $scope);
	
	$scope.get = function(item) {
		appService.get({method: 'GET', url: "./data.json", params: {type: item.type}}, $scope);
	}
	
	logger.debug("end ctrl");
});