angular.module('app', ['Logger'])
.config(function($locationProvider) {
  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
  	})
    .hashPrefix('#');
})
.service('appService', function($filter, $log, $http) {
  this.logger = $log.getLogger('appService');
  
  /*
   * request : $http(request) 
   */
  this.update = function(request, $scope) {
    $http(request)
    .success(function(data){
      $scope.customer = data.customer
    })
    .error(function(data){
      var msg = "샘플 데이터 조회중 에러발생:"+$filter('json')(data);
      logger.error(msg);
    });
  }
})
.controller('appCtrl', function($scope, $location, $log, appService) {
  var logger = $log.getLogger('app');
  logger.debug('start ctrl');
  // default value를 정의하지 않는 경우 서버 응답에 따라 화면에 템플릿이 의도한대로 출력되지 않을 수 있다.
  $scope.customer = {
    name: '',
    address: ''
  };

  var req = {
      method: 'GET',
      url: "./data.json",
      params: $location.search()
    };
  appService.update(req, $scope);
  
  $scope.update = function() {
    var req = {
      method: 'GET',
      url: "./data.json",
      params: {type: 1, delay:1000}
    };
    appService.update(req, $scope);
  }
})
.directive('myCustomer', function($log) {
  $log.getLogger('myCustomer').debug('start directive');
  return {
    templateUrl: function(elem, attr){
      $log.getLogger('myCustomer').debug('return directive:'+attr.type);
      return 'customer-'+attr.type+'.tpl.html';
    }
  };
});