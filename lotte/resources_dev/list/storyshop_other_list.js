(function(window, angular, undefined) {
    'use strict';

    var stsListModule = angular.module('lotteStsList', []);

    stsListModule.directive('lotteOtherStory', ['$window', 'LotteCommon', 'LotteUtil', function($window, LotteCommon, LotteUtil) {
        return {
            templateUrl : '/lotte/resources_dev/list/storyshop_other_list.html',
            replace : true,
            link : function($scope) {
                $scope.isStsLstOpen = false;
                $scope.toggleStsListOpen = function() {
                    $scope.isStsLstOpen = !$scope.isStsLstOpen;
                    if($scope.isStsLstOpen) {
                        angular.element('#cover').show();
                        angular.element('#cover').on('click', function(){
                            $scope.toggleStsListOpen();
                            $scope.$apply();
                        })
                    } else {
                        angular.element('#cover').hide();
                        angular.element('#cover').off('click');
                    }
                };

                $scope.moveStLst = function(type){
                    var pos = 0;
                    if(type=='down') {
                        pos = $scope.contents.stsLst.length * 45;
                    }
                    angular.element('.stss_cont').scrollTop(pos);
                };

                $scope.goOtherStoryShop = function(idx) {
                    $window.location.href = LotteUtil.setUrlAddBaseParam($scope.contents.stsLst[idx].linkUrl, $scope.baseParam + "&ss_yn=Y");
                };
            }
        };
    }]);

})(window, window.angular);