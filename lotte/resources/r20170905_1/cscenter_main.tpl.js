angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/custcenter/cscenter_main_container.html",'<section class="cscenter_main">\r\n	<!-- 톡(채팅) 하기 12/10 -->\r\n	<section class="chat_wrap">\r\n		<a ng-href="{{cscenterLinkObj.talkUrl}}" class="talk"><em ng-class="{new:talkCnt == \'N\'}">{{talkCnt}}</em>실시간 채팅상담</a>\r\n	</section>\r\n\r\n	<!-- 고객센터 메뉴 -->\r\n	<ul class="subm">\r\n		<li><a ng-href="{{cscenterLinkObj.questionUrl}}">1:1 문의하기</a></li>\r\n		<li><a ng-href="{{cscenterLinkObj.cscenterAnswerUrl}}">1:1문의 답변확인<span ng-if="csMainData.answerNewYn != null">N</span></a></li>\r\n		<li><a ng-href="{{cscenterLinkObj.ordLstUrl}}">주문배송조회</a></li>\r\n		<li><a ng-href="{{cscenterLinkObj.ordCancelUrl}}">취소교환반품</a></li>\r\n	</ul>\r\n	\r\n	<div class="list">\r\n		<h5>자주 찾는 질문</h5>\r\n		<a ng-href="{{cscenterLinkObj.cscenterFaqUrl}}" class="more">더보기</a>\r\n		<div class="slide_list">\r\n			<dl ng-repeat="items in csmainFaqData | limitTo : 5" ng-click="faqDetail(items)" ng-class="{show:faqDeatailView[items.bbc_no] === true}">\r\n				<dt name="items.bbc_no" ng-bind="items.bbc_tit_nm" ></dt>\r\n				<dd name="items.bbc_no" ng-bind-html="items.bbc_fcont" ng-class="{show:faqDeatailView[items.bbc_no] === true}" ng-if="faqDeatailView[items.bbc_no]"> </dd>\r\n			</dl>\r\n		</div>\r\n	</div>\r\n	\r\n	<div class="list mrgB0">\r\n		<h5>공지사항</h5>\r\n		<a ng-href="{{cscenterLinkObj.cscenterNoticeUrl}}" class="more">더보기</a>\r\n		<div class="slide_list">\r\n			<dl ng-repeat="items in csmainNoticeData | filter:{emerg_yn:true} | orderBy : \'-bbc_no\' | limitTo : 1" ng-click="noticeDetail(items)">\r\n				<dt name="items.bbc_no" ng-bind="items.bbc_tit_nm" ng-class="{emergOn:items.emerg_yn === true}"></dt>\r\n				<dd name="items.bbc_no" ng-bind-html="items.bbc_fcont" ng-class="{show:noticeDeatailView[items.bbc_no] === true}" ng-if="noticeDeatailView[items.bbc_no]"></dd>\r\n			</dl>\r\n			<dl ng-repeat="items in csmainNoticeData | filter:{emerg_yn:false} | orderBy : \'-bbc_no\' | limitTo : 2" ng-click="noticeDetail(items)">\r\n				<dt name="items.bbc_no" ng-bind="items.bbc_tit_nm" ng-class="{emergOn:items.emerg_yn === true}"></dt>\r\n				<dd name="items.bbc_no" ng-bind-html="items.bbc_fcont" ng-class="{show:noticeDeatailView[items.bbc_no] === true}" ng-if="noticeDeatailView[items.bbc_no]"></dd>\r\n			</dl>\r\n		</div>\r\n	</div>\r\n	\r\n	<div class="center_phone" >\r\n		<a href="tel:1577-1110">\r\n		<p class="left"><span>고객센터 연결</span><span class="no">1577-1110</span></p>\r\n		</a>\r\n		<p class="right">\r\n			<span>월~금요일 9:00~20:00</span>\r\n			<span>토요일 9:00~13:00</span>\r\n			<span>일,공휴일 휴무</span>\r\n		</p>\r\n	</div>\r\n</section>')}]);