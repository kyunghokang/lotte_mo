angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/webzine/m/lzine_detail_container.html",'<section ng-show="contVisible" class="cont_minheight vine_wrap">\n	<!-- category -->\n	<div class="sort_header_wrap">\n		<nav class="box_cate" sort-header>\n			<div class="big_cate">\n				<ul lotte-ng-list-swipe swipe-slide-menu="true" swipe-list-model="mainMenu" swipe-id="mainMenu" swipe-max-ratio="0.2" swipe-min-distance="40" swipe-right-margin="50">\n					<li ng-repeat="citem in screenData.cate_list" ng-class="{on:screenData.selectCate1==citem.disp_no}"><a href="#" ng-click="menuCategory1Click(citem)">{{citem.disp_nm}}</a></li>\n				</ul>\n			</div>\n			<!-- class on 으로 활성화 -->\n			<div ng-repeat="citem in screenData.cate_list" ng-show="screenData.selectCate1==citem.disp_no">\n				<div class="mid_cate">\n					<ul>\n						<li ng-repeat="citem2 in citem.sub_cate_list" ng-class="{on:screenData.selectCate2==citem2.disp_no}">\n							<a href="#" ng-click="menuCategory2Click(citem2, citem)">{{citem2.disp_nm}}</a>\n							<div class="cca" ng-show="screenData.selectCate2==citem2.disp_no">\n								<a href="#" ng-repeat="citem3 in citem2.sub_cate_list" ng-click="menuCategory3Click(citem3, citem2)" class="ng-binding ng-scope">{{citem3.disp_nm}}</a>\n							</div>\n						</li>\n					</ul>\n					<div class="mall_cateLayerbar">\n						<a ng-click="hideSubCate()" class="close">닫기</a>\n					</div>\n				</div>\n			</div>\n		</nav>\n	</div>\n	<!-- //category -->\n	<div ng-bind-html="screenData.html_data"></div>\n			\n	\n</section>')}]);