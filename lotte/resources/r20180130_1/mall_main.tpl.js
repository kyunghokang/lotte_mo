angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/tenbyten/m/mall_main_container.html",'<section id="container">\n	<section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\n	<section ng-show="!pageLoading">\n		<!-- category -->\n		<div class="sort_header_wrap">\n			<nav class="box_cate" sort-header>\n				<div class="big_cate">\n					<ul lotte-ng-list-swipe swipe-slide-menu="true" swipe-list-model="screenData.cate_list" swipe-id="mainMenu" swipe-max-ratio="0.2" swipe-min-distance="40" swipe-right-margin="50">\n						<li ng-repeat="citem in screenData.cate_list" ng-class="{on:screenData.selectCate1==$index+1}"><a href="#" ng-click="menuCategory1Click({disp_no:$index+1})">{{citem.disp_nm}}</a></li>\n					</ul>\n				</div>\n				<!-- class on 으로 활성화 -->\n				<div class="big_cate_all">\n					<button class="open_btn" ng-class="{on:screenData.showAllCategory}" ng-click="showAllCategoryClick()">더보기</button>\n					<div ng-show="screenData.showAllCategory" ng-class="{scroll:screenData.cate_list.length > 14}">\n						<ul>\n							<!--<li ng-repeat="citem in screenData.cate_list"><a href="#" ng-click="menuCategoryClick(citem)">{{citem.disp_nm}}</a></li>-->\n							<li ng-repeat="citem in screenData.cate_list"><a ng-click="menuCategory1Click({disp_no:$index+1})">{{citem.disp_nm}}</a></li>\n						</ul>\n						<div class="mall_cateLayerbar">\n							<a ng-click="hideCate()" class="close">닫기</a>\n						</div>\n					</div>\n				</div>\n				<!-- class on 으로 활성화 -->\n				<div ng-repeat="citem in screenData.cate_list" ng-show="screenData.selectCate1==$index+1">\n					<div class="mid_cate" ng-show="! screenData.showAllCategory">\n						<ul ng-class="{scroll:citem.sub_cate_list.length > 14}">\n							<li ng-repeat="citem2 in citem.sub_cate_list" ng-class="{on:screenData.selectCate2==citem2.disp_no}">\n								<a href="#" ng-click="menuCategory2Click(citem2)">{{citem2.disp_nm}}</a>\n								<div class="cca" ng-show="screenData.selectCate2==citem2.disp_no" ng-class="{scroll:citem2.sub_cate_list.length > 14}">\n									<a href="#" ng-repeat="citem3 in citem2.sub_cate_list" ng-click="menuCategory3Click(citem3)" class="ng-binding ng-scope"><span>{{citem3.disp_nm}}</span></a>\n								</div>\n							</li>\n						</ul>\n						<div class="mall_cateLayerbar">\n							<a ng-click="hideSubCate()" class="close">닫기</a>\n						</div>\n					</div>\n				</div>\n			</nav>\n		</div>\n		<!-- //category -->\n\n		<!-- main-slider -->\n		<div class="main_slide">\n			<!-- <button class="btn prev" ng-show="swipeIdx > 0" ng-click="beforeSlide()">Preview</button> -->\n			<button class="btn prev" ng-click="banner_move(-1)">Preview</button>\n			<div class="mask swipe_wrap" roll-swipe-banner id="rolltopbann" rolling="true" width320="1" width640="1" width900="1" info="top_banner" getcontrol="banner_ct">\n				<ul class="list swipeBox">\n					<li ng-repeat="pbitem in screenData.top_banner_list" ng-if="!(screenData.top_banner_list.length%2==1 && $index==screenData.top_banner_list.length-1 && screenType > 1)"><a href="#" ng-click="planshopBannerClick(pbitem)"><img ng-src="{{pbitem.img_url}}" alt="{{pbitem.alt_cont}}"></a></li>\n				</ul>\n				<div class="swipe_indicator">\n					<ul class="bullet indicator">\n						<li ng-repeat="item in screenData.top_banner_list"><span>{{$index}}</span></li>\n					</ul>\n				</div>\n			</div>\n			<button class="btn next" ng-click="banner_move(1)">Next</button>\n			<!-- <button class="btn next" ng-show="swipeIdx<=(swipeBullet.length-2)" ng-click="banner_move(-1)">Next</button> -->\n		</div>\n		<!-- //main-slider -->\n		<!-- WHAT’s NEW slider -->\n		<div class="main_slide type2">\n			<p class="tit_banner">FOCUS ON</p>\n			<div class="mask">\n				<ul class="list">\n					<li ng-repeat="foitem in screenData.focus_on_prod_list"><a href="#" ng-click="mallProductClick(foitem)"> <span class="thum"><img ng-src="{{foitem.img_url}}" alt="{{foitem.goods_nm}}"></span> <span class="name">{{foitem.goods_nm}}</span> <span class="value"> <strong>{{foitem.discounted_price|number}}</strong>원	</span></a></li>\n				</ul>\n			</div>\n		</div>\n		<!-- //WHAT’s NEW slider -->\n\n		<!-- MD’s PICK slider -->\n		<div class="main_slide type2">\n			<p class="tit_banner">New Arrival</p>\n			<div class="mask">\n				<ul class="list">\n					<li ng-repeat="naitem in screenData.new_arrival_prod_list"><a href="#" ng-click="mallProductClick(naitem)"> <span class="thum"><img ng-src="{{naitem.img_url}}" alt="{{naitem.goods_nm}}"></span> <span class="name">{{naitem.goods_nm}}</span> <span class="value"> <strong>{{naitem.discounted_price|number}}</strong>원	</span></a></li>\n				</ul>\n			</div>\n		</div>\n		<!-- // MD’s PICK slider -->\n\n		<!-- BEST OF BEST slider -->\n		<div class="main_slide type2">\n			<p class="tit_banner">BEST Seller</p>\n			<div class="mask">\n				<ul class="list">\n					<li ng-repeat="bpitem in screenData.best_seller_prod_list"><a href="#" ng-click="mallProductClick(bpitem)"> <span class="thum"><img ng-src="{{bpitem.img_url}}" alt="{{bpitem.goods_nm}}"></span> <span class="name">{{bpitem.goods_nm}}</span> <span class="value"> <strong>{{bpitem.discounted_price|number}}</strong>원	</span></a></li>\n				</ul>\n			</div>\n		</div>\n		<!-- // BEST OF BEST slider -->\n	</section>\n</section>\n')}]);