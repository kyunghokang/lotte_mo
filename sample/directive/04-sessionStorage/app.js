var app = angular.module("app", ['Logger', 'ng', 'ngRoute', 'ngStorage'])
.config(['$routeProvider', '$locationProvider', '$sessionStorageProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $sessionStorageProvider, $httpProvider) {
	  $sessionStorageProvider.set('sample', {max:0, size:0, items:[]});
  }
])

//$sessionStorageProvider.set('SimpleBoard', {max:0, size:0, items:[]});

