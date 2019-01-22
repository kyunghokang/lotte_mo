angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/brandshop/bestbrand_main_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<div class="best_header_wrap">\r\n		<div class="fixed_header" sub-header-each>\r\n			<header id="bestbrandSubHead">\r\n				<h2>\r\n				<a ng-click="goBestBrandMain()" ng-style="{\'background-color\':screenData.head.bgColor}">\r\n					<img class="logo" ng-src="{{screenData.head.logo}}" alt="{{screenData.head.title}}" />\r\n				</a>\r\n				</h2>\r\n				<p class="share" ng-class="{black:screenData.head.bgType && screenData.head.bgType==\'0\'}">\r\n					<a ng-click="showSharePop()">공유</a>\r\n				</p>\r\n			</header>\r\n			<!-- GNB -->\r\n			<div id="gnb" ng-if="screenData.gnbMenu.length > 0" class="nav_swipe_wrap">\r\n				<nav main-menu lotte-slider class="main_nav" swipe-end-func="$scope.menuSwipEndFunc" ng-style="{\'background-color\':screenData.head.ctgBgColor}">\r\n					<ul>\r\n						<li ng-repeat="item in screenData.gnbMenu" class="dispno_{{item.disp_no}}">\r\n							<span class="cate_flag" ng-if="item.flag_txt">{{item.flag_txt}}</span>\r\n							<a ng-click="headerMenuClick(item.disp_no)" ng-style="{\'color\':screenData.head.color}">{{item.disp_nm}}</a>\r\n						</li>\r\n					</ul>\r\n				</nav>\r\n			</div>\r\n		</div>\r\n	</div>\r\n\r\n	<!-- TOP BANNER -->\r\n	<div ng-if="screenData.topBanner.length > 0" class="top_banner">\r\n		<a ng-if="screenData.topBanner.length == 1" ng-click="goBestBrandTop(screenData.topBanner[0].img_link, 0)">\r\n           <img ng-src="{{screenData.topBanner[0].img_url}}">\r\n        </a>\r\n		<div ng-if="screenData.topBanner.length > 1" class="swipe_wrap" id="topBnrSwipe1" roll-swipe-banner rolling="true" width320="1" width640="1" width900="1" info="screenData.topBanner">\r\n	        <ul class="swipeBox">\r\n	            <li ng-repeat="item in screenData.topBanner track by $index">\r\n	                <a ng-click="goBestBrandTop(item.img_link, $index)">\r\n	                   <img ng-src="{{item.img_url}}">\r\n	                </a>\r\n	            </li>\r\n	        </ul>\r\n	        <ul class="indicator roll">\r\n	            <li ng-repeat="item in screenData.topBanner"><span>{{$index}}</span></li>\r\n	        </ul>\r\n	    </div>\r\n	</div>\r\n	\r\n	<div ng-if="screenData.promotion.length > 0" class="top_banner">\r\n		\r\n	</div>\r\n\r\n	<!-- PROMOTION & NEWS -->\r\n    <section ng-if="screenData.promotion && screenData.promotion.length > 0" class="top_swipe_wrap themelist">\r\n    	<div class="titlearea">\r\n			<div class="title">PROMOTION & NEWS</div>\r\n		</div>\r\n		<!-- 스와이프 영역 -->\r\n		<div ng-if="screenData.promotion.length <= 2" class="swipe_wrap promotionSwipe" id="promotionSwipe1"  roll-swipe-banner item-margin="40" rolling="false" width320="1" width640="1" width900="1" info="screenData.promotion">\r\n	        <ul class="swipeBox">\r\n	            <li ng-repeat="item in screenData.promotion track by $index">\r\n	            	<div>\r\n		                <a ng-click="goBestBrandTop(item.img_link, $index)">\r\n		                   <img ng-src="{{item.img_url}}">\r\n		                </a>\r\n	                </div>\r\n	            </li>\r\n	        </ul>\r\n	    </div>\r\n		<div ng-if="screenData.promotion.length > 2" class="swipe_wrap promotionSwipe" id="promotionSwipe2"  roll-swipe-banner item-margin="40" rolling="true" width320="1" width640="1" width900="1" info="screenData.promotion">\r\n	        <ul class="swipeBox">\r\n	            <li ng-repeat="item in screenData.promotion track by $index">\r\n	            	<div>\r\n		                <a ng-click="goBestBrandTop(item.img_link, $index)">\r\n		                   <img ng-src="{{item.img_url}}">\r\n		                </a>\r\n	                </div>\r\n	            </li>\r\n	        </ul>\r\n	    </div>\r\n		<!-- <div class="swipe_wrap">\r\n			<ul lotte-ng-list-swipe\r\n				swipe-id="promotionBanner"\r\n				swipe-first-index="1"\r\n				swipe-list-model="screenData.promotion"\r\n				swipe-slide-item="true"\r\n				swipe-left-margin="40"\r\n				swipe-right-margin="40"\r\n				swipe-max-ratio="0.2"\r\n				swipe-min-distance="40"\r\n				swipe-responsive="true"\r\n				swipe-responsive320="1"\r\n				swipe-responsive640="1"\r\n				swipe-responsive900="1">\r\n				<li ng-repeat="item in screenData.promotion track by $index">\r\n					<div>\r\n						<a ng-click="promotionLink(item, $index)">\r\n				    		<img ng-src="{{item.img_url}}" />\r\n			    		</a>\r\n			    	</div>\r\n				</li>\r\n			</ul>\r\n		</div> -->\r\n\r\n		<!-- <ul class="indicator" ng-if="screenData.promotion && screenData.promotion.length > 1" >\r\n			<li ng-repeat="item in screenData.promotion track by $index" ng-class="{on: swipeIdx == $index}"><span>{{$index}}</span></li>\r\n		</ul> -->\r\n		<!-- //스와이프 영역 -->\r\n	</section>\r\n\r\n	<!-- NEW ARRIVALS -->\r\n	<section class="new_arrivals" ng-if="screenData.newArrivals && screenData.newArrivals.length > 0">\r\n		<div class="titlearea">\r\n			<div class="title">NEW ARRIVALS</div>\r\n		</div>\r\n		<div class="new_arrival_wrap">\r\n			<ul>\r\n				<li ng-repeat="item in screenData.newArrivals" ng-if="$index < 4">\r\n					<a ng-click="goNewArrival(item.goods_no, $index)">\r\n						<div class="image_wrap">\r\n							<img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}" />\r\n						</div>\r\n						<div class="info_wrap">\r\n							<span class="goods_nm" ng-bind-html="item.goods_nm"></span>\r\n							<span class="price"><strong>{{item.sale_price | number}}</strong><em>원</em><var ng-if="item.is_plan_prod" class="plan_prod_limit">~</var></span>\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</section>\r\n\r\n	<!-- BEST REVIEW -->\r\n	<section class="best_review" ng-if="screenData.bestReview && screenData.bestReview.length > 0">\r\n		<div class="titlearea">\r\n			<div class="title">BEST REVIEW</div>\r\n		</div>\r\n		<div class="review_wrap">\r\n			<ul>\r\n				<li ng-repeat="item in screenData.bestReview" ng-if="$index < 6">\r\n					<a ng-click="goPreview(item.goods_no, $index)">\r\n                        <div class="thumb">\r\n                            <img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}" />\r\n                        </div>\r\n                        <div class="info">\r\n                            <p class="tit" ng-bind-html="item.goods_nm"></p>\r\n                            <div class="user_feedback">\r\n	                            <span class="score" ng-if="item.gdas_stfd_val > 0" ng-click="productReviewClick(item)">\r\n	                                <span class="starScoreWrap"><span class="starScoreCnt" ng-style="{\'width\':item.gdas_stfd_val*20 + \'%\'}"></span></span>\r\n	                            </span>\r\n	                        </div>\r\n	                        <p class="review" ng-bind-html="item.gdas_cont"></p>\r\n                        </div>\r\n	                </a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</section>\r\n\r\n	<!-- CATEGORY BEST ITEM -->\r\n	<section class="best_item_wrap" ng-if="screenData.bestItems && screenData.bestItems.length > 0">\r\n		<div class="best_item" ng-repeat="items in screenData.bestItems" ng-if="items.best_goods_list.length > 5">\r\n			<div class="titlearea">\r\n				<div class="title">{{items.disp_nm}} 베스트 아이템</div>\r\n			</div>\r\n			<div lotte-slider ng-if="items.best_goods_list.length > 0" class="swipe_wrap">\r\n		        <ul>\r\n		            <li ng-repeat="item in items.best_goods_list track by $index" ng-class="{last:item.last}">\r\n		                <a ng-click="goSubPage(item.goods_no, items.disp_no, $index)" ng-if="!item.last">\r\n		                    <div class="imageCon"><img ng-src="{{item.img_url}}"></div>\r\n		                    <div class="titleCon">\r\n		                        <span class="name">{{item.goods_nm}}</span>\r\n		                        <div class="t1"><span><b>{{item.sale_price | number}}</b>원<em ng-if="item.is_plan_prod" class="plan_prod_limit">~</em></span></div>\r\n		                    </div>\r\n		                    <span class="seq">{{$index + 1}}</span>\r\n		                </a>\r\n		                <div ng-if="item.last">\r\n		                	<a href="#" ng-click="goSubPageMore(items.disp_no)">더보기</a>\r\n		                </div>\r\n		            </li>\r\n		        </ul>\r\n		    </div>\r\n	    </div>\r\n	</section>\r\n</section>\r\n')}]);