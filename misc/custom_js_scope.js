// Custom Javascript for Websites 2 (크롬 익스텐션)

// RegExp Pattern :  /(m|mo|mo2|mt|mt2).*lotte.com/

function tmpLoadedEvent(){
    try{
        $scope = getScope();//angular.element(document.body).scope();
        $srhScope = angular.element("#searchForm").scope();
        injector = angular.element(document.body).injector();
        LotteCommon = injector.get("LotteCommon");
        LotteUtil = injector.get("LotteUtil");
        LotteStorage = injector.get("LotteStorage");
        LotteCookie = injector.get("LotteCookie");
        LotteLink = injector.get("LotteLink");
        commInitData = injector.get("commInitData");
        $window = injector.get("$window");
        $timeout = injector.get("$timeout");
        $http = injector.get("$http");
        $location = injector.get("$location");
        console.warn("%c ANGULER DEBUG MODE ACTIVATED ", "background:#f96;color:white;font-size:18px;font-weight:bold;");
    }catch(e){}
}

var use_cjs = sessionStorage.getItem("USE_CJS");
if(use_cjs === null){
  use_cjs = location.href.indexOf("USE_CJS=Y") >= 0;
  sessionStorage.setItem("USE_CJS", use_cjs);
}

if(use_cjs === true || use_cjs === "true"){
  setTimeout(tmpLoadedEvent, 1000);
}

function disableCJS(){
  sessionStorage.setItem("USE_CJS", "false");
  location.reload();
}

function enableCJS(){
  sessionStorage.setItem("USE_CJS", "true");
  location.reload();
}