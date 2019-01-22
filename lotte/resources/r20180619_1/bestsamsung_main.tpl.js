angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/samsung/bestsamsung_main_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<div class="best_header_wrap">\r\n		<div class="fixed_header" sub-header-each>\r\n			<header id="bestbrandSubHead">\r\n				<h2>\r\n				<a ng-click="goSamsungBrandMain()">\r\n					<span>samsung</span>\r\n				</a>\r\n				</h2>\r\n				<p class="share">\r\n					<a ng-click="showSharePop()">공유</a>\r\n				</p>\r\n			</header>\r\n			<!-- GNB -->\r\n			<div id="gnb" ng-if="screenData.gnbMenu.length > 0" class="nav_swipe_wrap">\r\n				<nav main-menu lotte-slider class="main_nav" swipe-end-func="$scope.menuSwipEndFunc">\r\n					<ul>\r\n						<li ng-repeat="item in screenData.gnbMenu" class="dispno_{{item.disp_no}}">\r\n							<span class="cate_flag" ng-if="item.flag_txt">{{item.flag_txt}}</span>\r\n							<a ng-click="headerMenuClick(item.disp_no,item.sort)" >{{item.disp_nm}}</a>\r\n						</li>\r\n					</ul>\r\n				</nav>\r\n			</div>\r\n		</div>\r\n    </div>\r\n    <!-- TOP BANNER -->\r\n	<div ng-if="screenData.topBanner.length > 0" class="top_banner">\r\n		<a ng-if="screenData.topBanner.length == 1" ng-click="goSamsungBrandTop(screenData.topBanner[0].img_link, 0)">\r\n           <img ng-src="{{screenData.topBanner[0].img_url}}">\r\n        </a>\r\n		<div ng-if="screenData.topBanner.length > 1" class="swipe_wrap" id="topBnrSwipe1" roll-swipe-banner rolling="true" width320="1" width640="1" width900="1" info="screenData.topBanner">\r\n	        <ul class="swipeBox">\r\n	            <li ng-repeat="item in screenData.topBanner track by $index">\r\n	                <a ng-click="goSamsungBrandTop(item.img_link, $index)">\r\n	                   <img ng-src="{{item.img_url}}">\r\n	                </a>\r\n	            </li>\r\n	        </ul>\r\n	        <ul class="indicator roll">\r\n	            <li ng-repeat="item in screenData.topBanner"><span>{{$index}}</span></li>\r\n	        </ul>\r\n	    </div>\r\n	</div>\r\n	<!--HOT DEAL BANNER-->\r\n    <section ng-if="screenData.hotDeal && screenData.hotDeal.img_url" class="hotdeal_wrap" >\r\n		<div class="titlearea">\r\n			<p class="title">HOT DEAL</p>\r\n		</div>\r\n		<div>\r\n			<a ng-click="goHotdeal(screenData.hotDeal.img_link)">\r\n				<img ng-src="{{screenData.hotDeal.img_url}}">\r\n			</a>\r\n		</div>\r\n	</section>\r\n	<!--BRAND STORY AREA-->\r\n	<section class="brand_story" ng-if="screenData.brandStory && screenData.brandStory.length > 0">\r\n		<div class="titlearea">\r\n			<p class="title">BRAND STORY</p>\r\n		</div>\r\n		<div class="brandstory_inwrap">\r\n			<div class="brandstory_menu" lotte-slider  swipe-end-func="$scope.menuSwipEndFunc" >\r\n				<ul class="brandstory_subtitle">\r\n					<li ng-repeat= "items in screenData.brandStory track by $index" >\r\n						<a ng-click="selectBrandStory($index)" ng-class="{on: screenData.storyItem.idx == $index || (screenData.storyItem.idx == 0 && $index == 0)}">{{screenData.brandStory[$index].keyword}}</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<div class="brandstory_cont">\r\n				<div class="brandstory_textbn">\r\n					<p ng-bind-html="screenData.storyItem.small_title"></p>\r\n					<p class="brandstory_subtit"  ng-bind-html="screenData.storyItem.bigl_title"></p>\r\n				</div>\r\n				<div class="brandstory_product">\r\n					<a ng-click="prodBrandStory(screenData.storyItem.goods_no,screenData.storyItem.idx);">\r\n						<div class="storyprod_img">\r\n							<img ng-src="{{screenData.storyItem.img_url}}">\r\n						</div>\r\n						<div class="storyprod_cont">\r\n							<p ng-bind-html="screenData.storyItem.goods_nm"></p>\r\n							<p class="storyprod_price">\r\n								<span class="org_price" ng-if=\'screenData.storyItem.org_sale_price > screenData.storyItem.sale_price\'>{{screenData.storyItem.org_sale_price | number}}원</span>\r\n								<span class="sale_price">{{screenData.storyItem.sale_price | number}}원</span>\r\n							</p>\r\n						</div>\r\n					</a>\r\n				</div>\r\n				<div class="brandstory_imgbn" data-bg-url="{{screenData.storyItem.bg_color}}">\r\n					<div ng-bind-html="screenData.storyItem.story_html | youtube_set | toTrustedHtml "></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</section>\r\n	<!--THEMA BANNER-->\r\n	<section class="thema" ng-if="screenData.thema && screenData.thema.length > 0">\r\n		<div class="titlearea">\r\n			<div class="title">테마 추천</div>\r\n		</div>\r\n		<!-- 스와이프 영역 -->\r\n		<div ng-if="screenData.thema.length <= 2" class="swipe_wrap promotionSwipe" id="promotionSwipe1"  roll-swipe-banner item-margin="40" rolling="false" width320="1" width640="1" width900="1" info="screenData.promotion">\r\n	        <ul class="swipeBox">\r\n	            <li ng-repeat="item in screenData.thema track by $index">\r\n	            	<div>\r\n		                <a ng-click="goThema(item.img_link, $index)">\r\n		                   <img ng-src="{{item.img_url}}">\r\n		                </a>\r\n	                </div>\r\n	            </li>\r\n	        </ul>\r\n	    </div>\r\n		<div ng-if="screenData.thema.length > 2" class="swipe_wrap promotionSwipe" id="promotionSwipe2"  roll-swipe-banner item-margin="40" rolling="true" width320="1" width640="1" width900="1" info="screenData.promotion">\r\n	        <ul class="swipeBox">\r\n	            <li ng-repeat="item in screenData.thema track by $index">\r\n	            	<div>\r\n		                <a ng-click="goThema(item.img_link, $index)">\r\n		                   <img ng-src="{{item.img_url}}">\r\n		                </a>\r\n	                </div>\r\n	            </li>\r\n	        </ul>\r\n	    </div>\r\n	</section>\r\n	<!-- MD RECOMM -->\r\n	<section class="md_recomm" ng-if="screenData.md_recomm && screenData.md_recomm.length > 0">\r\n		<div class="titlearea">\r\n			<div class="title">MD 추천</div>\r\n		</div>\r\n		<div class="md_recomm_wrap">\r\n			<ul>\r\n				<li ng-repeat="item in screenData.md_recomm" ng-if="$index < 6">\r\n					<a ng-click="goNewArrival(item.goods_no, $index)">\r\n						<div class="image_wrap">\r\n							<img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}" />\r\n						</div>\r\n						<div class="info_wrap">\r\n							<span class="goods_nm" ng-bind-html="item.goods_nm"></span>\r\n							<span class="price"><strong>{{item.sale_price | number}}</strong><em>원</em><var ng-if="item.is_plan_prod" class="plan_prod_limit">~</var></span>\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</section>\r\n	<!-- BEST REVIEW -->\r\n	<section class="best_review" ng-if="screenData.bestReview && screenData.bestReview.length > 3">\r\n		<div class="titlearea">\r\n			<div class="title">BEST REVIEW</div>\r\n		</div>\r\n		<div class="review_wrap">\r\n			<ul>\r\n				<li ng-repeat="item in screenData.bestReview" ng-if="screenData.bestReview.length >= 4">\r\n					<a ng-click="goPreview(item.goods_no, $index)">\r\n                        <div class="thumb">\r\n                            <img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}" />\r\n                        </div>\r\n                        <div class="info">\r\n                            <p class="tit" ng-bind-html="item.goods_nm"></p>\r\n                            <div class="user_feedback">\r\n	                            <span class="score" ng-if="item.gdas_stfd_val > 0" ng-click="productReviewClick(item)">\r\n	                                <span class="starScoreWrap"><span class="starScoreCnt" ng-style="{\'width\':item.gdas_stfd_val*20 + \'%\'}"></span></span>\r\n	                            </span>\r\n	                        </div>\r\n	                        <p class="review" ng-bind-html="item.gdas_cont"></p>\r\n                        </div>\r\n	                </a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</section>\r\n\r\n	<!--ISSUE BANNER-->\r\n	<section class="issue_ban" ng-if="screenData.issueList && screenData.issueList.length > 0">\r\n		<ul>\r\n			<li ng-repeat="item in screenData.issueList">\r\n				<a ng-click="goIssueProd(item.img_link, $index)">\r\n					<img ng-src="{{item.img_url}}">\r\n				</a>\r\n			</li>\r\n		</ul>\r\n	</section>\r\n\r\n	<!--BENEFIT BANNER-->\r\n	<section class="benefit_ban" ng-if="screenData.benefit && screenData.benefit.img_url">\r\n		<a ng-click="goBenefitProd(screenData.benefit.img_link)">\r\n			<img ng-src="{{screenData.benefit.img_url}}">\r\n		</a>\r\n	</section>\r\n</section>')}]);