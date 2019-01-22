angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mylotte/m/mylotte_main_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n    <!-- 마이롯데_메인 리뉴얼-->\r\n    <section class="mylotteMain2">\r\n        <div class="myHead" ng-if="loginInfo.isLogin">\r\n            <div class="myInfo">\r\n               <span ng-if="myGradeType == 10">플래티넘+ </span>\r\n               <span ng-if="myGradeType == 20">플래티넘 </span>\r\n               <span ng-if="myGradeType == 30">플래티넘# </span>\r\n               <span ng-if="myGradeType == 40">골드 </span>\r\n               <span ng-if="myGradeType == 50">실버 </span>\r\n               <span ng-if="myGradeType == 60">웰컴 </span>\r\n               <span ng-if="myGradeType == 70">웰컴 </span>\r\n               <span ng-if="myGradeType == 80">웰컴 </span>\r\n                {{myLotteMainInfo.mbrNm}}\r\n                <span ng-if="myLotteMainInfo.staffYn == \'N\'"> 회원님</span>\r\n                <span ng-if="myLotteMainInfo.staffYn == \'Y\'"> 임직원님</span>\r\n            </div>\r\n            <div class="config">\r\n                <a ng-href="{{myLotteMainLinkObj.smartAlarmUrl}}" class="alarmIcon"><span class="lib" ng-class="{new:alarmFlag}"></span>알림</a>\r\n                <a class="configIcon" onClick="showAppConfig();" ng-if="appObj.isApp" ng-class="{update:appObj.needUpdateApp}"><span class="lib"></span>설정</a>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="myPoint" ng-if="loginInfo.isLogin">\r\n            <ul class="utable bot">\r\n                <li class="ucell" ng-click="lPointClick()"><div class="cir t1"><p><span class="lib"/><b>{{myLotteMainInfo.lottePoint | textOrNumber : 0 }}</b>점</p></div></li>\r\n                <li class="ucell" ng-click="lMoneyClick()"><div class="cir t2"><p><span class="lib"/><b>{{myLotteMainInfo.lPoint | textOrNumber : 0 }}</b>점</p></div></li>\r\n                <li class="ucell" ng-click="depositClick()"><div class="cir t3"><p><span class="lib"/><b>{{myLotteMainInfo.deposit | textOrNumber : 0 }}</b>점</p></div></li>\r\n            </ul>\r\n            <!--포인트 정보-->\r\n            <ul class="utable text" ng-class="{login:loginInfo.isLogin}">\r\n                <li class="ucell line" ng-click="cloverClick()">\r\n                    <dl>\r\n                        <dt>클로버</dt>\r\n                        <dd><b>{{myLotteMainInfo.clover | textOrNumber : 0 }}</b>개</dd>\r\n                    </dl>\r\n                </li>\r\n                <li class="ucell" ng-click="couponClick()">\r\n                    <dl>\r\n                        <dt>쿠폰</dt>\r\n                        <dd><b>{{myLotteMainInfo.couponCnt | textOrNumber : 0 }}</b>장</dd>\r\n                    </dl>\r\n                </li>\r\n                <li class="ucell btn2" ng-if="!newVer">\r\n                    <a ng-href="{{myLotteMainLinkObj.gdBenefitUrl}}" class="btnType1 arr">참좋은혜택 <span class="lib"/></a>\r\n                    <a ng-href="{{myLotteMainLinkObj.friendCouponUrl}}" class="btnType2 arr">절친쿠폰북<span class="lib"/></a>\r\n                </li>\r\n                <li class="ucell btn2" ng-if="newVer">\r\n                    <a ng-href="{{myLotteMainLinkObj.gdBenefitUrl}}" class="btnType1 arr">멤버십&쿠폰존<span class="lib"/></a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n\r\n        <div class="myHead" ng-if="!loginInfo.isLogin">\r\n            <div class="myInfo">고객님, 반갑습니다.</div>\r\n            <div class="config">\r\n                <a ng-href="{{myLotteMainLinkObj.smartAlarmUrl}}" class="alarmIcon"><span class="lib" ng-class="{new:myLotteMainInfo.newAlramYn == \'Y\'}"></span> 알림</a>\r\n                <a class="configIcon" onClick="showAppConfig();" ng-if="appObj.isApp" ng-class="{update:appObj.needUpdateApp}"><span class="lib"></span> 설정</a>\r\n            </div>\r\n        </div>\r\n        <div class="myPoint"  ng-if="!loginInfo.isLogin">\r\n            <ul class="utable bot">\r\n                <div class="loginMessage">\r\n                    <p>지금 로그인 하시면,<br>\r\n                    포인트 및 쿠폰, 위시리스트 정보를<br>\r\n                    빠르게 확인하실 수 있습니다.</p>\r\n                    <div class="login_btn_wrap">\r\n                      <a class="member_join" href="#none" ng-click="goFamilySite(\'mem_reg\')">회원가입</a>\r\n                      <a class="lib" href="#none" ng-click="goLoginClick()">로그인</a>\r\n                    </div>\r\n                </div>\r\n            </ul>\r\n            <!--포인트 정보-->\r\n            <ul class="utable text">\r\n                <li class="info">혜택등급별 혜택, 앱 전용 쿠폰!<br>지금 바로 만나보세요~!</li>\r\n                <li class="ucell btn2 login">\r\n                    <a ng-href="{{myLotteMainLinkObj.gdBenefitUrl}}" class="btnType1 arr" ng-if="!newVer">참좋은혜택<span class="lib"/></a>\r\n                    <a ng-href="{{myLotteMainLinkObj.gdBenefitUrl}}" class="btnType1 arr" ng-if="newVer">멤버십&쿠폰존<span class="lib"/></a>\r\n                   <!-- <a ng-href="{{myLotteMainLinkObj.friendCouponUrl}}" class="btnType2 arr">절친쿠폰북<span class="lib"/></a>-->\r\n                </li>\r\n            </ul>\r\n        </div>\r\n\r\n        <!--주문/배송조회 ng-if="loginInfo.isLogin"-->\r\n        <div class="deliveryInfo borderTopBottom" >\r\n            <div class="oneLineInfo"><a ng-href="{{myLotteMainLinkObj.ordLstUrl}}"><b>주문배송조회</b> <span class="type2">(취소/변경/교환/반품 신청)</span><span class="lib"/></a></div>\r\n            <ul class="utable">\r\n                <li class="ucell">\r\n                    <div class="t1">주문접수<span class="lib"/></div>\r\n                    <span class="n1 number" ng-if="myLotteMainInfo.orderAccept != \'0\'" ng-click="ordDetailClick(11)">{{myLotteMainInfo.orderAccept}}</span>\r\n                    <span class="n1" ng-if="myLotteMainInfo.orderAccept == \'0\'">0</span>\r\n                </li>\r\n                <li class="ucell">\r\n                    <div class="t1">주문완료<span class="lib"/></div>\r\n                    <span class="n1 number" ng-if="myLotteMainInfo.orderComplete != \'0\'" ng-click="ordDetailClick(12)">{{myLotteMainInfo.orderComplete}}</span>\r\n                    <span class="n1" ng-if="myLotteMainInfo.orderComplete == \'0\'">0</span>\r\n                </li>\r\n                <li class="ucell">\r\n                    <div class="t1">출고지시<span class="lib"/></div>\r\n                    <span class="n1 number" ng-if="myLotteMainInfo.deliveryOrder != \'0\'" ng-click="ordDetailClick(13)">{{myLotteMainInfo.deliveryOrder}}</span>\r\n                    <span class="n1" ng-if="myLotteMainInfo.deliveryOrder == \'0\'">0</span>\r\n                </li>\r\n                <li class="ucell">\r\n                    <div class="t1">상품준비<span class="lib"/></div>\r\n                    <span class="n1 number" ng-if="myLotteMainInfo.goodsReady != \'0\'" ng-click="ordDetailClick(14)">{{myLotteMainInfo.goodsReady}}</span>\r\n                    <span class="n1" ng-if="myLotteMainInfo.goodsReady == \'0\'">0</span>\r\n                </li>\r\n                <li class="ucell">\r\n                    <div class="t1">발송완료</div>\r\n                    <span class="n1 number" ng-if="myLotteMainInfo.forwardingComplete != \'0\'" ng-click="ordDetailClick(15)">{{myLotteMainInfo.forwardingComplete}}</span>\r\n                    <span class="n1" ng-if="myLotteMainInfo.forwardingComplete == \'0\'">0</span>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n\r\n        <!-- 위시리스트, 최근본상품 버튼-->\r\n        <ul class="utable btn22">\r\n            <li class="ucell">\r\n                <a href="#" class="ucell_btn01" ng-click="myLotteOftenProd()"><span class="lib_btn"/>자주 구매</a>\r\n            </li>\r\n            <li class="ucell">\r\n                <a href="#" class="ucell_btn02" ng-click="myLotteLateProd()"><span class="lib_btn"/>최근 본 상품</a>\r\n            </li>\r\n            <li class="ucell">\r\n                <a class="ucell_btn03" ng-href="{{myLotteMainLinkObj.wishLstUrl}}"><span class="lib_btn"/>위시리스트</a>\r\n            </li>\r\n        </ul>\r\n\r\n        <div class="borderTopBottom pad">\r\n            <div class="oneLineInfo" ng-if="!loginInfo.isLogin"><a ng-href="{{myLotteMainLinkObj.ordLst2Url}}">주문배송조회 <span class="type2">(취소/변경/교환/반품 신청)</span><span class="lib"/></a></div>\r\n            <div class="oneLineInfo"><a ng-href="{{myLotteMainLinkObj.critViewUrl}}"><b>상품평 작성 {{myLotteMainInfo.commentCnt | textOrNumber : 0 }}</b><span class="lib"/></a></div>\r\n            <div class="oneLineInfo"><a ng-href="{{myLotteMainLinkObj.presentList}}">선물함<span class="lib"/></a></div>\r\n            <div class="oneLineInfo" ng-class="{nb:!loginInfo.isLogin}"><a ng-href="{{myLotteMainLinkObj.ordCancelUrl}}">취소/교환/반품 조회<span class="lib"/></a></div>\r\n            <div class="oneLineInfo nb"><a href=\'#\' ng-click="smartPickClick()">스마트픽/e-쿠폰교환권 <b>{{myLotteMainInfo.smpOrderCount | textOrNumber : 0 }}</b><span class="lib"/></a></div>\r\n        </div>\r\n\r\n        <div class="borderTopBottom pad">\r\n            <div class="oneLineInfo">\r\n							<a ng-href="{{myLotteMainLinkObj.talkIntroUrl}}">실시간 채팅상담 <em class="lib" ng-if="myLotteMainInfo.chatCnt > 0"></em><span class="lib"/></a>\r\n						</div>\r\n						<div class="oneLineInfo"><a ng-href="{{myLotteMainLinkObj.cscenterMain}}">1:1 문의/답변 <span class="lib"/></a></div>\r\n						<div class="oneLineInfo nb"><a ng-href="{{myLotteMainLinkObj.QandA}}">나의 상품 Q&#x26;A <span class="lib"/></a></div>\r\n						<div class="oneLineInfo nb"><a ng-href="{{myLotteMainLinkObj.eventGumeUrl}}">이벤트 응모내역 <span class="lib"/></a></div>\r\n        </div>\r\n\r\n        <div class="borderTopBottom footInfo">\r\n           <ul class="utable">\r\n                <li class="ucell"><a ng-href="{{myLotteMainLinkObj.lPayEasyUrl}}">L.pay<br>간편결제 신청</a></li>\r\n                <li class="ucell"><a ng-href="{{myLotteMainLinkObj.orderAlarmYnUrl}}">주문정보<br>수신설정</a></li>\r\n                <!-- 2016-11-29 --<li class="ucell"><a ng-href="{{myLotteMainLinkObj.ecouponListUrl}}">e-쿠폰<br>환불 관리</a></li><!-- //2016-11-29 -->\r\n                <!--<li class="ucell"><a ng-href="{{myLotteMainLinkObj.receiptEventUrl}}">영수증<br>이벤트</a></li>-->\r\n                <li class="ucell"><a ng-href="{{myLotteMainLinkObj.attendEventUrl}}">출석체크<br>이벤트</a></li>\r\n           </ul>\r\n           <ul class="utable">\r\n               <li class="ucell nb"><a ng-href="{{myLotteMainLinkObj.smartpayUrl}}">스마트 페이<br>관리</a></li>\r\n               <li class="ucell nb"><a ng-click="memeberChagne()">회원정보<br>수정</a></li>\r\n               <li class="ucell nb line1"><a ng-click="memberOut()">회원 탈퇴</a></li>\r\n           </ul>\r\n           <member-popup ng-if="memberLoginPopup == true"></member-popup>\r\n        </div>\r\n    </section>\r\n\r\n\r\n	<!-- 로딩이미지 -->\r\n	<div class="pageLoading" ng-if="isShowLoadingImage"><p class="loading half"></p></div>\r\n\r\n	<!-- //마이롯데_메인 -->\r\n	<welcome-popup ng-show="welcomeFlag == true"></welcome-popup>\r\n</section>\r\n'),a.put("/lotte/resources_dev/mylotte/m/popup_mem.html",'<section id="container">\r\n	<div class="centerPop">\r\n	    <div class="inner">\r\n	        <div class="info">\r\n	            <h3>회원정보 변경 안내</h3>\r\n	            <p class="desc">원할한 회원정보 변경을 위해서<br>\r\n	                로그아웃 후 재로그인이 필요합니다.<br>\r\n	                불편을 드려 죄송합니다.</p>\r\n	            <a class="relogin" ng-click="goLoginClick()">로그아웃 후 재로그인 하기</a>\r\n	        </div>\r\n	        <a ng-click="closePopup()" class="close">닫기</a>\r\n	    </div>\r\n	</div>\r\n</section>\r\n'),a.put("/lotte/resources_dev/mylotte/m/popup_welcomePop.html",'<div class="popup welcomePop">\r\n	<div class="popCont">\r\n		<div class="dpCell">\r\n			특별한 {{loginInfo.name}} 님께			\r\n            <strong ng-if="!newVer">3천원 할인 쿠폰 증정!</strong>\r\n            <strong ng-if="newVer">5천원 할인 쿠폰 증정!</strong>\r\n			<a ng-href="{{myLotteMainLinkObj.gdBenefitUrl}}" class="getCoupon">쿠폰받기</a>		\r\n		</div>\r\n	</div>\r\n	<a ng-click="welcomeClose()" class="close">닫기</a>\r\n</div>')}]);