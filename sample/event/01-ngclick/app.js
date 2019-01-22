var parking = angular.module("app", ['Logger'])
.service('appService', function($log, $http) {
  this.logger = $log.getLogger('appService');

  this.list = function(request, $scope) {
    $http(request)
    .success(function(data){
      $scope.cars = data.cars;
    })
    .error(function(data){
      var msg = "샘플 데이터 조회중 에러발생:"+$filter('json')(data);
      logger.error(msg);
    });
  }
})
.controller("appCtrl", function ($scope, $location, appService) { 
  $scope.appTitle = "AngularJS Sample App";
  $scope.cars = [];
  
  var req = {
      method: 'GET',
      url: "./data.json",
      params: $location.search()
    };
  appService.list(req, $scope);
  
  $scope.park = function (car) { 
      car.entrance = new Date(); 
      $scope.cars.push(car); 
      delete $scope.car;
  };
});