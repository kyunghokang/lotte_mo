/**
 * pagination module
 */
angular.module('directives.pagination', ['Logger'])
.controller('paginationCtrl', function ($scope, $log) {
  var logger = $log.getLogger('paginationCtrl');
  logger.debug("start");

  $scope.noPrevious = function() {
    return $scope.currentPage  === 1;
  };
  $scope.noNext = function() {
    return $scope.endPage >= $scope.totalPages;
  };
  $scope.isActive = function(page) {
    return $scope.currentPage === page;
  };
  $scope.selectPage = function(page) {
    if ( ! $scope.isActive(page) ) {
      $scope.currentPage = page;
      $scope.onSelectPage({ page: page });
    }
  };
  $scope.selectPrevious = function() {
    if ( !$scope.noPrevious() ) {
      $scope.selectPage($scope.currentPage-1);
    }
  };
  $scope.selectNext = function() {
    if ( !$scope.noNext() ) {
      $scope.selectPage($scope.currentPage+1);
    }
  };

  // startPage에 대해 watch를 걸게 되면, 삭제의 결과로 페이지 수가 변하는 일이 있다 하더라도
  // startPage는 항상 1이여서 페이징 템플릿이 변경되지 않는 문제가 있다.
  $scope.$watch('endPage', function(value) {
    $scope.pages = [];
    for(var i=$scope.startPage;i<=$scope.endPage;i++) {
      $scope.pages.push(i);
    }
  });


  logger.debug("end");
})
.directive('pagination', function($log) {
  var logger = $log.getLogger('directives.pagination');
  logger.debug("start");

  return {
    restrict: 'E',
    /*
    isolated scope 정의시 @, =, & 세가지 indicator가 존재한다.
    @ : parent scope -> child scope (parent에 바인딩된 값을 child에게 단순히 전달할 경우. template에서는 '{{}}'를 사용해 전달하면 된다)
    = : parent scope <-> child scope (parent에 바인딩 변수와 child에 바인딩 변수가 two way databinding 되어야 할 경우)
    & : parent scope <- child scope (child의 변경을 parent에 통지하려 할 경우. callback에 사용)
    */
    scope: {
      totalPages: '=',
      startPage: '=',
      endPage: '=',
      currentPage: '=',
      onSelectPage: '&' // callback : scope에 binding된 함수 호출
    },
    templateUrl: '../common/pagination.tpl.html',
    controller: 'paginationCtrl',
    replace: true
   /// link: function($scope, element, attrs) {    //   // do nothingg
   /// }
  }
});