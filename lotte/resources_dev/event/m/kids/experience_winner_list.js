(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('ExperienceWinnerListCtrl', ['$http', '$scope', 'LotteCommon', function($http, $scope, LotteCommon) {
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "체험단 당첨 확인"; // 서브헤더 타이틀
        $scope.evt_no = '', // 이벤트 번호
        $scope.screenID = "체험단 당첨 확인"; // 스크린 아이디 
        
        $scope.EventInfo = [];
        $scope.WinnerList = [];
        // 이벤트 리스트 data url
        
        //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }	
        
        $scope.evt_no = getParameterByName('evt_no');
        
        // Data Load
        $scope.loadScreenData = function() {
        	var url = LotteCommon.kidsExperienceWinnerData+'?evt_no=' + $scope.evt_no;
			$http.get(url)
	        .success(function(data) {
	        	// maxData
	        	$scope.maxData = data;
	        	$scope.EventInfo = data.experience_info;
	        	$scope.info_cont = data.info_cont;
	        	$scope.WinnerList = data.winner_list.items;
	        	// 당첨날짜 가공처리 가공처리
        		data.experience_info.winner_dtime =  data.experience_info.winner_dtime.split("/").join('.');
        		data.experience_info.winner_dtime =  data.experience_info.winner_dtime.split("17").join('2017');
				data.experience_info.winner_dtime =  data.experience_info.winner_dtime.split("16").join('2016');
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        $scope.loadScreenData();
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/event/m/kids/experience_winner_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);