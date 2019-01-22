angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/voice_order/voice_order_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<div class="sub_header_wrap">\r\n		<header id="head_sub" sub-header-each ng-show="subTitle" class="fixedSubHeader " ng-class="{fixedHeader: fixedHeader && subHeaderFixed && !appObj.isNativeHeader}">\r\n			<div class="head_sub_inner">\r\n				<h2>말로 하는 쇼핑</h2>\r\n				<a class="share" ng-click="showSharePop({shareImg:\'http://image.lotte.com/lotte/images/voice_video_poster.png\'});"><span>공유</span></a>\r\n			</div>\r\n		</header>\r\n	</div>\r\n	<div class="voice_top">\r\n		<div class="voice_top_prod">\r\n			<div class="voice_top_prod_img">\r\n				<ul>\r\n					<li>\r\n						<img src="http://image.lotte.com/lotte/mo2017/talk/intro.png" alt="" />\r\n						<div class="text_wrap">\r\n							<p>상품평 많은 립스틱</p>\r\n							<p><em>추천 받고 싶을 때</em></p>\r\n						</div>\r\n					</li>\r\n					<li>\r\n						<img src="http://image.lotte.com/lotte/mo2017/talk/intro2.png" alt="" />\r\n						<div class="text_wrap">\r\n							<p>자주사는 생수</p>\r\n							<p><em>말로 빠르게 주문하고 싶을 때</em></p>\r\n						</div>\r\n					</li>\r\n					<li>\r\n						<img src="http://image.lotte.com/lotte/mo2017/talk/intro3.png" alt="" />\r\n						<div class="text_wrap">\r\n							<p>‘쿠폰’ 같이 자주찾는 페이지</p>\r\n							<p><em>말로 빠르게 이동하고 싶을 때</em></p>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<a class="btn_detail" href="#" ng-click="aniScrollTo(\'\', \'voiceBot\', 500)">\r\n				<span class="bg">자세히보기</span>\r\n				<span class="arrow"></span>\r\n			</a>\r\n		</div>\r\n	</div>\r\n	<div class="voice_bot" id="voiceBot">\r\n		<div class="section_wrap recomm">\r\n			<span class="indicator"></span>\r\n			<p class="title">상품 추천</p>\r\n			<p class="sub">원하는 조건의 상품을 말해보세요<br/>빠르게 찾아드려요</p>\r\n			\r\n			<div class="ani_wrap">\r\n				<div class="bg"></div>\r\n				<div class="balloon"></div>\r\n				<div class="sub_text"></div>\r\n				<div class="slide"></div>\r\n				<div class="slide2"></div>\r\n			</div>\r\n		</div>\r\n		\r\n		<div class="section_wrap voice">\r\n			<span class="indicator prev"></span>\r\n			<span class="indicator curr"></span>\r\n			<p class="title">음성 주문</p>\r\n			<p class="sub">“주문해줘” 말 한마디로 바로<br/>결제까지 해결!</p>\r\n			\r\n			<div class="ani_wrap">\r\n				<div class="bg"></div>\r\n				<div class="balloon"></div>\r\n				<div class="slide"></div>\r\n				<div class="slide2"></div>\r\n			</div>\r\n		</div>\r\n		\r\n		<div class="section_wrap page">\r\n			<span class="indicator prev"></span>\r\n			<span class="indicator curr"></span>\r\n			<p class="title">페이지 이동</p>\r\n			<p class="sub">평소 찾아가기 번거로웠던 페이지,<br/>말로 한번에 이동해보세요</p>\r\n			\r\n			<div class="ani_wrap">\r\n				<div class="bg"></div>\r\n				<div class="balloon"></div>\r\n				<div class="slide"></div>\r\n			</div>\r\n			\r\n			<a class="btn_quick" ng-click="aniScrollTo(\'\', \'example\', 500)">\r\n				<span class="btn_area">\r\n					<span class="bg">이렇게도 말해보세요</span>\r\n					<span class="arrow"></span>\r\n				</span>\r\n			</a>\r\n		</div>\r\n		\r\n		<div class="section_wrap example" id="example">\r\n			<p class="mic">이렇게도 말해보세요!</p>\r\n			<ul class="cont">\r\n			<li>\r\n				<span class="sub_title">상품추천</span>\r\n				<p>“검은색 원피스 추천해줘”</p>\r\n				<p>“무료배송 생수 추천해줘”</p>\r\n				<p>“5만원 이하 운동화 추천해줘”</p>\r\n				<p>“30대 남자한테 인기있는 상품 뭐야?”</p>\r\n			</li>\r\n			<li class="voice">\r\n				<span class="sub_title">음성주문</span>\r\n				<p>“옵션 변경해줘”</p>\r\n				<p>“2개 주문해줘”</p>\r\n				<p>“배송비 얼마야?”</p>\r\n				<p>“장바구니 보여줘”</p>\r\n			</li>\r\n			<li class="page">\r\n				<span class="sub_title">페이지이동</span>\r\n				<p>“마이롯데 가줘”</p>\r\n				<p>“톡상담 연결해줘”</p>\r\n				<p>“진행중인 구매사은 이벤트 보여줘”</p>\r\n			</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n	<a class="btn_link" href="#" ng-click="mpVoiceCheck()">\r\n		<span>말로하는 쇼핑 바로가기</span>\r\n	</a>\r\n</section>')}]);