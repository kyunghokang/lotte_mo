angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/talk/talkIntro_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<section class="pageLoading" ng-show="pageLoading">\r\n		<p class="loading half"></p>\r\n	</section>\r\n	<section ng-show="!pageLoading" class="talk_intro">\r\n		\r\n		<div class="talk_wrap">\r\n			<div><img src="http://image.lotte.com/lotte/mo2017/talk/talkintro_00.png" /></div>\r\n			<a ng-click="talkNormalClick(1);"><img src="http://image.lotte.com/lotte/mo2017/talk/talkintro_01.png" /></a>\r\n			<a ng-click="talkNormalClick(2);"><img src="http://image.lotte.com/lotte/mo2017/talk/talkintro_02.png" /></a>\r\n			<a ng-click="talkNormalClick(3);"><img src="http://image.lotte.com/lotte/mo2017/talk/talkintro_03.png" /></a>\r\n			<a ng-click="smartTalkRecomClick();"><img src="http://image.lotte.com/lotte/mo2017/talk/talkintro_04.png" /></a>\r\n		</div>\r\n		\r\n		<!-- <div class="inner">\r\n			<div class="talk_intro_btn">\r\n				<a href="#" ng-click="talkNormalClick();" class="btn_talk_type_normal"><img src="http://image.lotte.com/lotte/mobile/talk/intro_btn_normal.png" alt="스마트 톡상담"></a>\r\n				<a href="#" ng-click="talkRecommandClick();" class="btn_talk_type_recommand"><img src="http://image.lotte.com/lotte/mobile/talk/intro_btn_command.png" alt="스마트 톡추천"></a>\r\n				<a ng-click="smartTalkRecomClick()" style="width:100%;height:80px;line-height:80px;background-color:#fff;border-radius:40px;font-size:24px;position:absolute;left:0;top:-100px;">대화형 커머스</a>\r\n			</div>\r\n		</div> -->\r\n	</section>\r\n</section>')}]);