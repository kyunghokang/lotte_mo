/*
 * SimpleBoard app for AngularJS sample
 * 편의상 service와 controller를 별도의 파일로 분리하지는 않았으나, 재사용을 목적으로 하는 service의 경우 별도의 js 파일로 정의해야 한다.
 * MVW(model-view-whatever) 기반의 AngularJS client app 작성시 servide/controller/directive에 대한 역할을 다음과 같이 구분하도록 한다.
 *
 * service : business logic 정의(ex:서버와 데이터 통신, 외부 서비스 등)
 *           service는 template 제어 로직이 들어가서는 안된다.
 *           service는 다른 service에 대해 dependency를 가질 수 있으나, controller나 directive에 dependency를 가져서는 안된다.
 *           service는 기본적으로 scope에 의존적이지 않으므로 argument를 통해 scope를 전달하는 것도 바람직하지 않으며, scope에 바인딩할 객체를 return 하도록 한다.
 *           service의 처리 결과가 async일 때는 callback 함수를 argument로 전달하여 반영되도록 한다.
 * controller : scope control을 통한 template 제어
 *              template에 바인딩된 변수 처리를 위한 scope 바인딩, DOM event 처리를 위한 function 정의, module로 제공되는 service 호출 등.
 * directive : 재사용을 목적으로 정의하는 custom tag 정의
 *             link는 custom tag가 호출될 때 마다 실행되고, controller는 전체 angular appliation에서 유일하게 실행되므로,
 *             link 정의는 중복 적용되는 custom tag 각각에 대한 처리를 별도로 해야할 때만 사용하도록 한다.
 *             isolated scope를 정의함으로써 다른 directive나 controller의 scope에 영향을 받지 않도록 한다.
 *
 * error 처리 : service, factory 내에 정의하는 function은 전체를 try/catch 처리하고 exception에 대해 logging처리를 하도록 한다.
 *             controller의 $scope에 바인딩하는 함수가 service의 함수와 같을 경우 별도의 try/catch 처리는 하지 않아도 된다.
 *             controller는 $scope의 binding 처리가 주된 역할이므로 별도의 try/catch 처리가 필요하지 않으며, 필요한 경우는 service로 로직 이전을 검토해야한다.
 *             angularjs에서 제공되는 함수들에 대한 call은 내부에서 모두 try/catch 처리가 되어 있으므로 별도의 try/catch 처리를 하지 않아도 된다.
 * logging : service, controller, directive의 시작과 종료 라인에 start/end를 debug level로 출력한다.
 * comment : 자체 정의하는 함수와 argument, return 객체에 대한 기술은 AngularJS jsdoc annoation을 따르도록 한다.
 */
//////////////////////////////////////////////////////////////////////////////////
// utility function
// 특정 라이브러리에 의존적이지않고 단순하지만 자주 반복 호출되는 기능들은 global function을 별도의 utility script로 정의하는 것이 보다 유용하다.
// Array.isArray definition for older browser(ex: ie8, 9, 10)
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

/**
 * javascript form object를 url query string으로 변환
 * @param {Object} obj - {key1: value, key:[value, value]}
 */
var transformJsonToParam = function(obj) {
  var str = [];
  for (var p in obj) {
    if (Array.isArray(obj[p])) {
      for(var i=0; i<obj[p].length; i++) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
      }
    } else {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  return str.join("&");
}

/**
 * toggle 전역 실행중 화면 
 * @param {boolean} isOpen true: 실행 dimm open, false: 실행 dimm close
 */
function toggleExecuteDimm(isOpen) {
  if (isOpen) {
    document.querySelector('div.executeDimm').style.display = 'block';
  } else {
    document.querySelector('div.executeDimm').style.display = 'none';
  }
  
}
/**
 * toggle 전역 오류 화면 
 *
 * @function toggleErrorDimm
 * @param {boolean} isOpen true: 오류 dimm open, false: 오류 dimm close
 */
function toggleErrorDimm(isOpen) {
  if (isOpen) {
    document.querySelector('div.errorDimm').style.display = 'block';
  } else {
    document.querySelector('div.errorDimm').style.display = 'none';
  }
  
}

function toString(obj) {
  //return JSON.stringify(obj);
  return angular.toJson(obj);
  // return $filter('json')(obj);
}
//////////////////////////////////////////////////////////////////////////////////
var app = angular.module("app", ['ng', 'ngRoute', 'ngFileUpload', 'directives.pagination'])
.constant('baseHref', '/sample/simpleBoard/')
.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/list/:page', {
        templateUrl: 'list.tpl.html',
        controller: 'ListCtrl'
      })
      .when('/view/:page/:no', {
        templateUrl: 'view.tpl.html',
        controller: 'ViewCtrl'
      })
      .when('/write/:page', {
        templateUrl: 'write.tpl.html',
        controller: 'WriteUpdateCtrl'
      })
      .when('/update/:page/:no', {
        templateUrl: 'write.tpl.html',
        controller: 'WriteUpdateCtrl'
      })
      .otherwise({
        redirectTo: '/list/1'
      });

    // $http 호출에 대한 공통 에러 화면 처리 등록
    $httpProvider.interceptors.push(function($q) {
      return {
        'responseError' : function(rejection) {
          toggleErrorDimm(true);

          return $q.reject(rejection);
        }
      };
    });

    //$locationProvider.html5Mode(true).hashPrefix('!');
}])
.factory('$log', function() {
    var consoleAppender, logger;
    var logger = log4javascript.getRootLogger();

    logger.getLogger = function(category) {
      var getLogger = log4javascript.getLogger(category);
      getLogger.getChildLogger = function(category) {
        return log4javascript.getLogger(getLogger.name+"."+category);
      }

      return getLogger;
    }

    // var popUpLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %c - %m{1}%n");
    var popUpLayout = new log4javascript.PatternLayout("%d{ABSOLUTE} [%25c] %-5p %m");
    var consoleAppender = new log4javascript.BrowserConsoleAppender();
    consoleAppender.setLayout(popUpLayout);
    logger.addAppender(consoleAppender);
    return logger;
})
/**
 * SimpleBoard app for AngularJS sample
 *
 * @memberof app
 * @ngdoc service
 * @name SimpleBoardService
 * @param {service} Upload ng-file-upload service
 */
.service('SimpleBoardService', function($log, $http, $location, $filter, $timeout, Upload) {
  var logger = $log.getLogger('SimpleBoardService');
  logger.debug("start");
  var SimpleBoardService = this;
  /**
   * current simpleBoard instance
   * 
   * @property {Hash} current_simpleBoard collection og objects that belongs to this map
   */
  this.current_simpleBoard = {};

  // paging에 의한 list 전환시 직전 simpleBaord 객체 return
  this.getCurrentSimpleBoard = function() {
    return this.current_simpleBoard;
  };

  /**
   * 목록<br>
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/list?json.schema=Y">./data/list</a>
   * 
   * @memberof SimpleBoardService
   * @function list
   * @param {string} params - url parameter
   * @param {callback} successCallback - callback function on success
   */
  this.list = function(params, successCallback) {
    var log = logger.getChildLogger("list");
    try {
      log.debug("params", toString(params));
      var req = {
        method: "GET",
        url: "./data/list",
        params: params
      };
      $http(req)
      .success(function(data){
        if (successCallback) {
          successCallback(data.simpleBoard);
        }      
      })
      .error(function(data){
        var msg = "샘플 데이터 조회중 에러발생:"+toString(data);
        log.error(msg);
      });
    } catch(e) {
      log.error(e.message, e);
    }
  }

  /**
   * 등록<br>
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/write?json.schema=Y">./data/write</a>
   * 
   * @memberof SimpleBoardService
   * @function writeUpdate
   * @param {Object} simpleBoardEntity - scope의 simpleBoardEntity(필수: name, subject, content)
   * @param {Object[]} files - upload file 객체에 대한 array(file.no가 존재하는 것만을 upload된 것으로 간주하고 board entity에 attach 시킴)
   * @param {callback} successCallback - callback function on success
   * @param {callback} errorCallback - callback function on error
   */
  this.writeUpdate = function(simpleBoardEntity, files, successCallback, errorCallback) {
    var log = logger.getChildLogger("writeUpdate");
    log.debug("simpleBoardEntity", toString(simpleBoardEntity));
    log.debug("files", toString(files));
    try {
      // files의 file.no를 files_no에 ,를 delimeter로 해서 concat 시킴
      var files_no = "";
      angular.forEach(files, function(file) {
        if (file.no) {
          files_no += file.no+",";
        }
      });

      var req = {
        method: "POST",
        url: "./data/writeUpdate",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: transformJsonToParam,
        data: {
          no: simpleBoardEntity.no,
          name: simpleBoardEntity.name,
          subject: simpleBoardEntity.subject,
          content: simpleBoardEntity.content,
          files_no: files_no
        }
      };
      $http(req)
      .success(function(data){
        if(successCallback) {
          successCallback(data.simpleBoardEntity);
        }
      })
      .error(function(data){
        var msg = "샘플 데이터 등록중 에러발생:"+toString(data);
        log.error(msg);
        if (errorCallback) {
          errorCallback();
        }
      });
    } catch(e) {
      log.error(e);
    }
  }

  /**
   * 조회<br>
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/view?json.schema=Y">./data/view</a>
   *
   * @memberof SimpleBoardService
   * @function get
   * @param {Object} params - scope의 simpleBoardEntity(필수: no)
   * @param {callback} successCallback - callback function on success
   */
  this.get = function(params, successCallback) {
    var log = logger.getChildLogger("get");
    log.debug("params", toString(params));

    try {
      var req = {
        method: "GET",
        url: "./data/view",
        params: params
      };
      $http(req)
      .success(function(data){
        if (successCallback) {
          successCallback(data.simpleBoardEntity);
        }
      })
      .error(function(data){
        var msg = "샘플 데이터 조회중 에러발생:"+$filter('json')(data);
        log.error(msg);
      });
    } catch(e) {
      log.error(e);
    }
  }

  /**
   * 삭제<br>
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/remove?json.schema=Y">./data/remove</a>
   *
   * @memberof SimpleBoardService
   * @function remove
   * @param {Object} simpleBoardEntity - scope의 simpleBoardEntity(필수: no)
   * @param {callback} successCallback - callback function on success
   */
  this.remove = function(params, successCallback) {
    var log = logger.getChildLogger("remove");
    log.debug("params", toString(params));

    try {
      var req = {
        method: "POST",
        url: "./data/remove",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: transformJsonToParam,
        data: params
      };
      $http(req)
      .success(function(data){
        if (successCallback) {
          successCallback();
        }
      })
      .error(function(data){
        var msg = "샘플 데이터 삭제중 에러발생:"+$filter('json')(data);
        logger.error(msg);
      });
    } catch(e) {
      log.error(e);
    }
  }

  /**
   * 파일 업로드 
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/fileUpload?json.schema=Y">./data/fileUpload</a>
   *
   * @memberof SimpleBoardService
   * @function uploadFile
   * @param {Object[]} files - ng-file-upload file object에 대한 array. file 객체 개별로 upload를 수행한다.
   * @param {callback} errorCallback - callback function on error
   */
  this.uploadFile = function(files, errorCallback) {
    var log = logger.getChildLogger("uploadFile");
    log.debug("files", toString(files));

    angular.forEach(files, function(file) {
      try {
        if (file || !file.error) {
          file.upload = Upload.upload({
            url: './data/fileUpload',
            method: 'POST',
            headers: {
              'my-header': 'my-header-value'
            },
            //fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'myFile'
          });

          file.upload.then(function (response) {
            $timeout(function () {
              file.result = response.data;
              file.no = response.data.uploadFiles[0].no;
            });
          }, function (response) {
            if (errorCallback) {
              file.progress = 0;
              errorCallback(response);
            }
          });

          file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      } catch(e) {
        log.error(e);
      }
    });
  }

  /**
   * 파일 제거 
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/removeFile?json.schema=Y">./data/removeFile</a>
   *
   * @memberof SimpleBoardService
   * @function removeFile
   * @param {Object} file - ng-file-upload file object. 업로드된 경우는 file.no에 file_no를 할당한다.
   * @param {string} board_no - board에 attach된 파일을 제거하는 경우 (=SimpleBoardEntity.no)
   * @param {callback} successCallback - callback function on success
   * @param {callback} errorCallback - callback function on error
   */
  this.removeFile = function(file, board_no, successCallback, errorCallback) {
    var log = logger.getChildLogger("removeFile");
    log.debug("file", toString(file));

    try {
      if (!file) { // 파일 객체가 존재하지 않으면 return
        return;
      }
      if (!file.no) { // 업로드가 되지 않아 file.no가 없는 경우는 객체 제거만 수행
        successCallback(null);
        return;
      }
      var req = {
        method: "POST",
        url: "./data/removeFile",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: transformJsonToParam,
        data: {
          file_no: file.no,
          no: board_no
        }
      };
      $http(req)
      .success(function(data){
        if(successCallback) {
          successCallback(data.simpleBoardEntity);
        }
      })
      .error(function(data){
        var msg = "샘플 데이터 등록중 에러발생:"+$filter('json')(data);
        log.error(msg);
        if (errorCallback) {
          errorCallback();
        }
      });
    } catch(e) {
      log.error(e);
    }
  }

  /**
   * 샘플 데이터 생성
   * json 호출 url : <a href="http://localhost:8080/sample/simpleBoard/data/createSampleData?json.schema=Y">./data/createSampleData</a>
   *
   * @memberof SimpleBoardService
   * @function createSampleData
   * @param {callback} successCallback - callback function on success
   * @param {callback} errorCallback - callback function on error
   */
  this.createSampleData = function(successCallback, errorCallback) {
    var log = logger.getChildLogger("createSampleData");
    
    try {
      $http.get("./data/createSampleData")
      .success(function(data){
        if(successCallback) {
          successCallback();
        }
      })
      .error(function(data){
        log.error("샘플 데이터 생성중 에러 발생", data);
        if (errorCallback) {
          errorCallback();
        }
      });
    } catch(e) {
      log.error(e);
    }
  }

  /**
   * 에러 호출 (공통 에러에 대한 테스트 목적)
   * 호출 url : ./data/error
   */
  /**
   * 에러 호출 (공통 에러에 대한 테스트 목적)
   * json 호출 url : ./data/error
   *
   * @memberof SimpleBoardService
   * @function callErrorForSample
   * @param {callback} successCallback - callback function on success
   * @param {callback} errorCallback - callback function on error
   */
  this.callErrorForSample = function(successCallback) {
    $http.get("./data/callError")
    .success(function(data){
      if (successCallback) {
        successCallback();
      }
    })
    .error(function(data){
      var msg = "샘플 데이터 삭제중 에러발생:"+$filter('json')(data);
      logger.error(msg);
    });
  }

  logger.debug("end");
})
/**
 * controller: 목록 화면
 *
 * @memberof app
 * @ngdoc controller
 * @name ListCtrl
 * @param SimpleBoardService {service} simple board service
 */
.controller("ListCtrl", function ($scope, $log, $location, $routeParams, SimpleBoardService) { 
  var logger = $log.getLogger('ListCtrl');
  logger.debug("start");
  // UI flickering 방지
  $scope.simpleBoard = SimpleBoardService.getCurrentSimpleBoard();

  var params = $location.search();
  params.page = $scope.simpleBoard.currentPage;
  SimpleBoardService.list(params, function(simpleBoard) {
    if (simpleBoard) {
      $scope.simpleBoard = simpleBoard;
    }    
  });

  /**
   * 등록 화면 호출
   * @memberof ListCtrl
   * @function openWriteView
   */
  $scope.openWriteView = function() {
    $location.url("/write/"+$routeParams.page );
  };
  /**
   * 상세 화면 호출
   * @memberof ListCtrl
   * @function openGetView
   */
  $scope.openGetView = function(simpleBoardEntity) {
    $location.path('/view/'+$routeParams.page+'/'+simpleBoardEntity.no).search({});
  };
  /**
   * list.tpl.html에 정의된 pagination element의 on-select-page type에 정의한 callback 함수 implement
   * @memberof ListCtrl
   * @function selectPageHandler
   */
  $scope.selectPageHandler = function(page) {
    logger.getChildLogger("selectPageHandler").debug("page:", page);
    SimpleBoardService.current_simpleBoard = $scope.simpleBoard;
    $location.path("/list/"+page).search({});
  };
  /**
   * 삭제 실행 후 목록 전환
   * @memberof ListCtrl
   * @function remove
   */
  $scope.remove = function() {
    var checkedNos = {checked_no: []};
    for (var i=0; i < $scope.simpleBoard.items.length; i++) {
      if ($scope.simpleBoard.items[i].checked == true) {
      checkedNos.checked_no.push($scope.simpleBoard.items[i].no);
        logger.getChildLogger("remove").debug("remove: checked_no:"+$scope.simpleBoard.items[i].no);
      }
    }
    SimpleBoardService.remove(checkedNos, function() {
      SimpleBoardService.list(params, function(simpleBoard) {
        if (simpleBoard) {
          $scope.simpleBoard = simpleBoard;
        }    
      });
    });
  };
  /**
   * 샘플을 위해 서버 오류 호출
   * @memberof ListCtrl
   * @function error
   */
  $scope.error = function() {
    SimpleBoardService.callErrorForSample();
  };
  /**
   * 샘플 데이터 생성
   * @memberof ListCtrl
   * @function createSampleData
   */
  $scope.createSampleData = function() {
    toggleExecuteDimm(true);
    SimpleBoardService.createSampleData(function() {
      toggleExecuteDimm(false);
      $location.path("/list/").search({});
    }, function() {
      toggleExecuteDimm(false);
    });
  }

  logger.debug("end");
})
/**
 * controller: 상세 화면
 *
 * @memberof app
 * @ngdoc controller
 * @name ViewCtrl
 * @param SimpleBoardService {service} simple board service
 */
.controller("ViewCtrl", function ($scope, $log, $location, $routeParams, SimpleBoardService) { 
  var logger = $log.getLogger('ViewCtrl');
  logger.debug("start");
  var params = $location.search();
  params.no = $routeParams.no

  SimpleBoardService.get(params, function(simpleBoardEntity) {
    if (simpleBoardEntity) {
      $scope.simpleBoardEntity = simpleBoardEntity
    }    
  });

  /**
   * go 조회 화면
   * @memberof ViewCtrl
   * @function openListView
   */
  $scope.openListView = function() {
    $location.path('/list/'+$routeParams.page).search({});
  }
  /**
   * go 수정 화면
   * @memberof ViewCtrl
   * @function update
   */
  $scope.update = function(simpleBoardEntity) {
    $location.path("/update/"+$routeParams.page+'/'+$routeParams.no).search(params);;
  }

  logger.debug("end");
})
/**
 * controller: 등록/수정 화면
 *
 * @memberof app
 * @ngdoc controller
 * @name WriteUpdateCtrl
 * @param SimpleBoardService {service} simple board service
 */
.controller("WriteUpdateCtrl", function ($scope, $log, $location, $routeParams, SimpleBoardService) { 
  var logger = $log.getLogger('UpdateCtrl');
  logger.debug("start");

  var params = {};
  if ($routeParams.no) {
    params = $location.search();
    params.no = $routeParams.no
    SimpleBoardService.get(params, function(simpleBoardEntity) {
      if (simpleBoardEntity) {
        $scope.simpleBoardEntity = simpleBoardEntity
      } 
    });      
  }

  $scope.item = {};
  //$scope.picFiles = [];

  /**
   * 파일 추가(업로드 X)
   * @memberof WriteUpdateCtrl
   * @function addInputFile
   */
  $scope.addInputFile = function() {
    var idx = $scope.picFiles.length-1;
    $scope.picFiles[idx].idx = idx;
  }

  /**
   * 추가된 파일에 대해 업로드 실행
   * @memberof WriteUpdateCtrl
   * @function uploadFile
   */
  $scope.uploadFile = function(files) {
    SimpleBoardService.uploadFile(files, function(response) {
      // 서버 업로드 중 발생시 에러 메시지 출력 이외에 별도의 처리를 하지는 않는다.
      $scope.errorMsg = response.data.errorMsg;
    });
  };

  /**
   * 업로드되어 attach된 파일 제거
   * @memberof WriteUpdateCtrl
   * @function removeAttachedFile
   */
  $scope.removeAttachedFile = function(file) {
    SimpleBoardService.removeFile(file, $scope.simpleBoardEntity.no, function() {
      var idx = -1;
      for (var i=0; i<$scope.simpleBoardEntity.attachedFiles.length; i++) {
        if (file.no == $scope.simpleBoardEntity.attachedFiles[i].no) {
          idx = i;
        }
      }
      if (idx > -1) {
        logger.getChildLogger("removeAttachedFile").debug("idx", idx);
        logger.getChildLogger("removeAttachedFile").debug("attachedFiles", $scope.simpleBoardEntity.attachedFiles);
        $scope.simpleBoardEntity.attachedFiles.splice(idx, 1)
      }      
    });
  };

  /**
   * 추가된 파일 제거
   * @memberof WriteUpdateCtrl
   * @function removeFile
   */
  $scope.removeFile = function(file) {
    SimpleBoardService.removeFile(file, null, function() {
      var idx = -1;
      for (var i=0; i<$scope.picFiles.length; i++) {
        if (file.idx == $scope.picFiles[i].idx) {
          idx = i;
        }
      }
      if (idx > -1) {
        logger.getChildLogger("removeFile").debug("idx", idx);
        logger.getChildLogger("removeFile").debug("picFiles", picFiles);
        $scope.picFiles.splice(idx, 1);
      }
    });
  };

  /**
   * 취소시 직전 화면 으로 이동
   * @memberof WriteUpdateCtrl
   * @function cancel
   */
  $scope.cancel = function() {
    window.history.back();
  };
  /**
   * 등록/수정 요청 시간 동안 dimm 처리는 별도의 div에 대한 style을 변경하기만 하는 것이므로 dom을 직접 수정해도 무방하다.
   * @memberof WriteUpdateCtrl
   * @function execute
   */
  $scope.execute = function() {
    toggleErrorDimm(true);
    if (!$scope.simpleBoardEntity.no) {
      $scope.simpleBoardEntity.no = "";
    }
    SimpleBoardService.writeUpdate($scope.simpleBoardEntity, $scope.picFiles, function(simpleBoardEntity) {
      toggleErrorDimm(false);
      $location.url("/view/"+$routeParams.page+'/'+simpleBoardEntity.no).search(params);
    }, function() {
      toggleErrorDimm(false);
    });
  };

  logger.debug("end");
})
.controller("appCtrl", function ($scope, $log, $location, $route, $routeParams, SimpleBoardService) { 
  var logger = $log.getLogger('appCtrl');
  logger.debug("start");

  logger.debug("end");
});