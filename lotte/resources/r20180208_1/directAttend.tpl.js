angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/event/direct_attend_container.html",'<div  id="visitEvent" class="fullImage">     \r\n	<div class="sevt type2">\r\n        <!--탭 20161103-->\r\n        <div class="ebox">\r\n            <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_tab.png">    \r\n            <a href="#" ng-click="goLinkTwo()" class="tabButton">럭키박스</a>\r\n        </div>        \r\n        <!--상단 월 표시-->\r\n        <div class="ebox">\r\n            <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_1.png" alt="출석체크">    \r\n            <div class="cur_month"><span class="f14">{{thisMonth}}월</span></div>\r\n        </div>\r\n        <!--출석하기 버튼-->\r\n        <div class="ebox attend" ng-click="regAttend()" ng-if="!todayCheckFlag">\r\n            <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_2.png" alt="출석체크하기">\r\n        </div>\r\n        <!--출석하기 버튼 : 출석완료-->\r\n        <div class="ebox attend" ng-if="todayCheckFlag">\r\n            <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_2_1.png" alt="출석완료">\r\n        </div>\r\n        <!--도장찍은 달력-->\r\n        <div class="ebox stamp">\r\n            <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_3_1.png">\r\n            <div class="calendar" style="line-height:{{winWidth*0.1}}px">\r\n                <ul>\r\n                    <li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li>\r\n                </ul>\r\n                <ul>\r\n                    <li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li>\r\n                </ul>\r\n                <ul>\r\n                    <li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li>\r\n                </ul>\r\n                <ul ng-show="lastWeek >= 4">\r\n                    <li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li>\r\n                </ul>\r\n                <ul ng-show="lastWeek >= 5">\r\n                    <li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li>\r\n                </ul>\r\n                <ul ng-show="lastWeek == 6">\r\n                    <li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li><li><span>1</span></li>\r\n                </ul>                \r\n            </div>\r\n            <div class="ebox stampfoot">\r\n                <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_3_3.png">	    \r\n                <div class="myPoint" style="bottom:{{winWidth*0.11}}px">\r\n                    <b class="txt f16">나의 출석 클로버</b>\r\n                    <b class="point f15"><span class="f25">{{totalClover|number}}</span>개</b>\r\n                </div>                \r\n            </div>\r\n            \r\n        </div>\r\n        <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_4.png" alt="매일 오전 10시에 교환하세요!">    \r\n        <!--무료배송교환하기-->\r\n        <div class="ebox">            \r\n            <!--교환하기-->\r\n            <img ng-if="freeDelivCnt < 1 && freeDelivTotalCnt < 200" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_5.png">            \r\n            <!--교환완료-->\r\n            <img ng-if="freeDelivCnt >= 1" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_5_1.png">\r\n            <!--선착순마감-->\r\n            <img ng-if="freeDelivCnt < 1 && freeDelivTotalCnt >= 200" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_5_2.png">\r\n            <div class="changeBtn" ng-click="goExchangeClover(\'freeDeliv\')">교환하기</div>    \r\n        </div>\r\n        <!--10%추가할인 교환하기-->\r\n        <div class="ebox">\r\n           <!--교환하기-->\r\n            <img ng-if="sibECouponCnt < 1 && sibETotalCouponCnt < 100" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_6.png">                \r\n           <!--교환완료-->\r\n            <img ng-if="sibECouponCnt >= 1" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_6_1.png">    \r\n           <!--선착순마감 -->\r\n            <img ng-if="sibECouponCnt < 1 && sibETotalCouponCnt >= 100" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_6_2.png">                \r\n            <div class="changeBtn" ng-click="goExchangeClover(\'cloverLayer1000\')">교환하기</div>                \r\n        </div>\r\n        <!--1천원쇼핑지원-->\r\n        <div class="ebox">\r\n            <img ng-if="lpEntryWinCnt < 1 && lpEntryDailCnt < 1" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201802_7.png" alt="1천원 쇼핑지원 교환하기">\r\n            <img ng-if="lpEntryWinCnt >= 1" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201802_7_2.png" alt="1천원 쇼핑지원 교환완료">\r\n            <img ng-if="lpEntryWinCnt < 1 && lpEntryDailCnt >= 1" ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201802_7_3.png" alt="1천원 쇼핑지원 다음기회에">\r\n            <div class="changeBtn" ng-click="goExchangeClover(\'LPoint\')">교환하기</div>                          \r\n        </div>\r\n          <!--럭키박스-->\r\n		<!-- 20161006 럭키박스 10월 2차 배너추가 ng-if="bannerShow(2016,10,08,2016,10,15)"-->\r\n		<div class="ebox">\r\n			<a ng-click="goLinkTwo()">\r\n				<img src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_luckybox.png" alt="지금 APP으로 응모하면 100%당첨" />\r\n			</a>\r\n		</div>\r\n        <!--footer  -->\r\n        <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_201610_8.png">    \r\n        \r\n        <!-- 스탬프 교환 완료 레이어 -->\r\n        <div class="stamp_layer">\r\n            <a href="#" ng-click="closePop()"><img src="http://image.lotte.com/lotte/mobile/event/stamp5_layer_bg_01.png" alt="닫기"></a>\r\n            <img src="http://image.lotte.com/lotte/mobile/event/stamp5_layer_bg_02.png">\r\n            <a href="#" ng-click="goPointCoupon()"><img src="http://image.lotte.com/lotte/mobile/event/stamp5_layer_bg_03.png"></a>\r\n            <!--\r\n            cont : 2천원 할인쿠폰\r\n            cont typea : 10%할인쿠폰\r\n            cont typeb : 무료배송\r\n            cont typec : 1만점 적립쿠폰\r\n            -->            \r\n            <div class="cont"></div>\r\n        </div>	    \r\n        <!--바로방문 안내 레이어-->\r\n        <div class="attend_info_layer" ng-show="attend_layer_flag">    \r\n            <div class="bg"></div>   \r\n            <img ng-src="http://image.lotte.com/lotte/mobile/event/2016/da_event_2016_pop.png" ng-click="hide_attend_layer()">                            \r\n        </div>		\r\n    </div>\r\n\r\n	<div id="visitPop" style="display:none;">\r\n		<div class="bg">\r\n			<a href="#" ng-click="closeInfoPop()"><div class="closeBtn"></div></a>\r\n			<!--내용 \r\n			detail : 7% 쿠폰\r\n			detail btype: 10% 쿠폰\r\n			detail ctype: 무료배송\r\n			detail dtype: 2천원 할인 2014.02.26\r\n			-->\r\n			<div id="cpType" class="detail" style="background-image:url(\'http://image.lotte.com/lotte/mobile/event/event_visit_pop_02_{{chgImgCpn}}.png\');background-size:1037px 156px;"></div>\r\n			<!--쿠폰/포인트확인-->\r\n			<a href="#" ng-click="goPointCoupon()"><div class="okBtn"></div></a>\r\n		</div> \r\n	</div>\r\n</div>\r\n')}]);