(function(window, angular, undefined) {
    'use strict';

    var commFootModule = angular.module('lotteCommFooter', []);

    commFootModule.directive('lotteCommFooter', [function() {
        return {
            templateUrl : '/lotte/resources_dev/common/comm_footer.html',
            replace:true
        }
    }]);

})(window, window.angular);