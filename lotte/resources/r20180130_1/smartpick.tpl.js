angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/smartpick_container.html",'<div class="cont_wrap">\r\n	<!-- 최상단 띠배너 -->\r\n	<section ng-if="winWidth >= 640 && screenData.reward_banner && screenData.reward_banner.banner_nm == \'rewardevent\'" class="top_banner_list">\r\n		<ul>\r\n			<li><a ng-click="linkUrl(screenData.reward_banner.img_link, screenData.reward_banner.mov_frme_cd, \'m_DC_Smartpick_{{ctgDispNo}}_rewardevent\')"><img ng-src="{{screenData.reward_banner.img_url}}" alt="{{screenData.reward_banner.banner_nm}}" /></a></li>\r\n\r\n			<!-- 640 이상일때만 나오는 출석 도장 이벤트 -->\r\n			<li ng-if="winWidth >= 640"><a ng-click="linkUrl(eventLinkObj.eventAttendUrl, false, \'m_DC_Smartpick_{{ctgDispNo}}_tabletbanner\')"><img src="http://image.lotte.com/lotte/mo2015/angular/banner_201507_attend.png" alt="출석도짱" /></a></li>\r\n		</ul>\r\n	</section>\r\n\r\n	<section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\r\n	<section ng-show="!pageLoading">\r\n	<div ng-controller="productCtrl">\r\n		<div product-container \r\n			template-type="mixdeal" \r\n			templatetype="templateType" \r\n			products="screenData.bannerMixContents" \r\n			banners="screenData.deal_banners" \r\n			more-product-continer="getProductData()" \r\n			win-width="winWidth"\r\n			tclick-prod="m_DC_Smartpick_{{ctgDispNo}}_unit" \r\n			tclick-banner="m_DC_Smartpick_{{ctgDispNo}}_banner" \r\n			tclick-banner-idx-key="bannerIdx" \r\n			class="prd_lst_wrap"></div>\r\n\r\n		<!-- Product Load Loading -->\r\n		<div class="listLoading" ng-if="productListLoading && !pageLoading">\r\n			<p class="loading half"></p>\r\n		</div>\r\n	</div>\r\n</div>')}]);