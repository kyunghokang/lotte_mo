(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('findHead', ['$window', 'LotteCommon', 'commInitData',
    	function($window, LotteCommon, commInitData) {
        return {
        	restrict: 'AEC',
            templateUrl : '/lotte/resources_dev/login/find_ellotte_head.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.more_param = "";
                $scope.fromEllotte = commInitData.query['ellotte_join']!= null?true:false;                                 
                //console.log($scope.test);
                if($scope.fromEllotte){
                    angular.element('body').addClass("ellotte");
                    $scope.more_param = "&ellotte_join=Y"; //추후변경
                    setTimeout(function(){
                        $scope.actionbarHideFlag = true;
                    }, 100);
                    $("#lotteActionbar").hide();
                    $(".quick_btn").hide();
                }
                $scope.head_link = "http://m.ellotte.com";    
                //$scope.head_link ="http://m.tellotte.com";
                
                angular.element('#wrapper').css("display", "block");
                $scope.head_type = el.attr("page");
            }
        };
    }]);
})(window, window.angular);