(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg', 
        //  'lotteSideMylotte', 
         'lotteCommFooter'
    ]);

    app.controller('findIdAfterCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon', 'LotteUtil', 'commInitData', function($scope, $filter, $sce, $http, $window, LotteCommon, LotteUtil, commInitData ){
        
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = '계정 찾기'; // 서브헤더 타이틀
        $scope.actionBar = true; // 액션바         
                
        $scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";
        $scope.mbr_name = decodeURIComponent(commInitData.query['mbr_name']!= null?commInitData.query['mbr_name']:"");
        $scope.hpno_1 = commInitData.query['hpno_1']!= null?commInitData.query['hpno_1']:"";
        $scope.hpno_2 = commInitData.query['hpno_2']!= null?commInitData.query['hpno_2']:"";
        $scope.hpno_3 = commInitData.query['hpno_3']!= null?commInitData.query['hpno_3']:"";
        
                
	   	$.ajax({
			type: 'post'
			, async: false
			, url:  LotteCommon.simpleSignMemberIdFindAfterUrl
			, data: {
	   			"mbr_name": $scope.mbr_name
	   			, "hpno_1" : $scope.hpno_1
	   			, "hpno_2" : $scope.hpno_2
	   			, "hpno_3" : $scope.hpno_3
	   		}, success: function(data) {
	   			$scope.returnMap = data.returnMap;
	   			$scope.web_scheme = data.requestScheme;	   			
	   			$scope.requestContextPath = data.requestContextPath;
	   			$scope.requestUri = data.requestUri;
	   			$scope.requestSecure = data.reqeustSecure;
	   			$scope.requestReferer = data.requestReferer;
	   			$scope.requestUserAgent = data.requestUserAgent;

	   			console.log($scope.returnMap);
			}, error: function(data) {
				alert(data);
			}
	   	});
        
	   	var uagent = $scope.requestAgent;        

        
    }]);
    
    app.directive('lotteContainer',['LotteUtil', 'LotteCommon',  function(LotteUtil, LotteCommon){
        return {
            templateUrl: '/lotte/resources_dev/login/find_id_after_container.html',
            replace:true,
            link:function($scope, el, attrs){
        	
        		if($scope.returnMap.length == 0) {
        			$("#fail").show();
        			$("#success").hide();
        		} else {
        			$("#fail").hide();
        			$("#success").show();
        		}
        	
        		/*패밀리 팝업*/
	        	$scope.goFamilySite = function(div) {
	        		var family_url = "member.lpoint.com/door/user/mobile/";
	         	    var main_url = encodeURIComponent(
	        			   ($scope.schema == ""? LOTTE_CONSTANTS['M_HOST_MOBILE'] : ($scope.schema + LOTTE_CONSTANTS['M_HOST_MOBILE'].replace("http", ""))) + "/" 
	        			   + (LotteUtil.isSmp() ? "main_smp.do" : "main.do") 
	        			   + $scope.baseParam, "UTF-8");
	         	    var target_url = "";
					var return_url = '';
					
					// 앱/웹 분기처리
					if($scope.schema == "") {
					 	return_url = encodeURIComponent(window.location.href, "UTF-8");
					}else{
						return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
					}
	         	    
	         	    if(div == "id") {
	         	    	target_url = "requestId.jsp";
	         	    } else if(div == "passwd") {
	         	    	target_url = "requestPasswd.jsp";
	         	    } else if(div == "mem_reg") {
	         	    	target_url = "login_common.jsp";
	         	    }
	         	    
	         	    family_url += (target_url + "?sid=" + LotteUtil.getLoginSeed() + "&returnurl=" + return_url + "&main_url=" + main_url);
	         	    family_url += "&sch=" + $scope.schema;
	         	    
	    			if($scope.schema != "") { /*앱일경우*/
	    				if(LotteUtil.boolAppInstall($scope.requestAgent)) {
	    					window.location = "family://" + family_url;    					
	    				} else if(LotteUtil.boolAndroid($scope.requestAgent)) {
	    					window.myJs.callAndroid("https://" + family_url);
	    				}
	    			} else {
	    				window.open("https://" + family_url, "family");    				
	    			}
	         	    	
	        	}
            }
        };
    }]);
    
})(window, window.angular);
