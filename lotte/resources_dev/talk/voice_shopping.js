(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('voiceShoppingCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', '$window', 
    function($http, $scope, LotteCommon, commInitData, $window) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = subTitle; // 서브헤더 타이틀
        $scope.screenID = "음성쇼핑"; // 스크린 아이디
        $scope.isShowBack = true;

        $scope.isVC = commInitData.query.vc == "Y" ? true : false; // 보이스 커머스 인입 여부

        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
            };
            
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false
            };

            if ($scope.isVC) {
                console.log("클래스 추가", angular.element(".pop_middle, .pop_middle2"));
                angular.element(".pop_middle, .pop_middle2").addClass("voice_cont_wrap");
            }

            if ($scope.appObj.isApp && $scope.appObj.isIOS) {
                $window.location.href = "talkshop://hideHeader";
            }
        })();
    }]);
/*
    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/talk/voice_shopping_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

    app.directive('lotteContainer2', function() {
        return {
        	templateUrl : '/lotte/resources_dev/talk/voice_shopping_container2.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    */

})(window, window.angular);

function toggleAction5 (e){
	$('.inlineBorder').removeClass('active');
	$(e).addClass('active');
	$('.clear').addClass('off');
	$('.pay-step').addClass('on');
	//$('.order_product_content').addClass('off');
}

function toggleAction8 (e){
	$('.inlineBorder').removeClass('active');
	$('.tab-con').removeClass('active');
	$(e).addClass('active');
	var tab_id = $(e).attr('data-tab2');
	$("#"+tab_id).addClass('active');
}

function toggleAction6 (e){
	$('.pay_method_area span').removeClass('on');
	$('.pay-inner').removeClass('on');
	$(e).addClass('on');
	var tab_id = $(e).attr('data-tab');
	$("#"+tab_id).addClass('on');
}

function toggleAction7 (e){
	$('.pay-inner .ng-scope').removeClass('active');
	$(e).closest('.ng-scope').addClass('active');
}

//L.pay 간편결제 서비스 이용안내 레이어
function LpayAgreeCheckLayer() {
	if ($(".box_Lpay_agree_check .txt01").css('display') == 'none' )
	{
		$(".box_Lpay_agree_check").addClass("open");
	} else {
		$(".box_Lpay_agree_check").removeClass("open");
	}
}
