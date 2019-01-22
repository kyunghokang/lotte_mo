angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/custcenter/faq_container.html",'<section class="cscenter_main" ng-class="{cscenter_guccimain: gucci}">\r\n	<div ng-if="gucci" class="gucci_sub_header_wrap">\r\n		<header id="gucciSubHead" class="fixed" sub-header-each>\r\n			<h2><a ng-href="/mall/gucci/gucci_main.do?{{baseParam}}&tclick=G_LOGO"><span>GUCCI</span></a></h2>\r\n			<nav ng-show="!gucciLoading">\r\n				<ul class="ctg_list_big">\r\n					<li ng-repeat="citem in screenData.cate_list" ng-class="{big_on:screenData.selectCate1==citem.disp_no}" style="width:{{100/screenData.cate_list.length}}%">\r\n						<a href="#" class="btn_ctg_big" ng-click="menuCategory1Click(citem)">{{citem.disp_nm}}</a>\r\n					</li><!-- 2016.10.21 카테고리 반응형 -->\r\n				</ul>\r\n				<ul class="ctg_list_mid" ng-show="screenData.showAllCategory"><!-- <button class="open_btn" ng-click="showAllCategoryClick()">더보기</button> -->\r\n					<li ng-repeat="citem in screenData.cate_list"><a href="#" ng-click="menuCategoryClick(citem)">{{citem.disp_nm}}</a></li>\r\n				</ul>\r\n				<ul class="ctg_list_sml" ng-repeat="citem in screenData.cate_list" ng-show="screenData.selectCate1==citem.disp_no">\r\n					<li ng-repeat="citem2 in citem.sub_cate_list" ng-class="{on:screenData.selectCate2==citem2.disp_no}">\r\n						<a href="#" ng-click="menuCategory2Click(citem2)">{{citem2.disp_nm}}</a>\r\n						<div class="cca" ng-show="screenData.selectCate2==citem2.disp_no">\r\n							<a href="#" ng-repeat="citem3 in citem2.sub_cate_list" ng-click="menuCategory3Click(citem3)" class="ng-binding ng-scope">{{citem3.disp_nm}}</a>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</nav>\r\n		</header>\r\n	</div>\r\n	<section class="gucci_sub_title">\r\n        <h3 class="title">FAQ</h3>\r\n    </section>\r\n    <div class="list faq">\r\n        <div class="slide_list">\r\n        	<dl ng-repeat="items in faqList" ng-click="faqDetail(items)" ng-hide="notExistItem()" ng-class="{show:faqDeatailView[items.bbc_no] === true}">\r\n                <dt name="items.bbc_no" ng-bind="items.bbc_tit_nm" ></dt>\r\n                <dd name="items.bbc_no" ng-bind-html="items.bbc_fcont" ng-class="{show:faqDeatailView[items.bbc_no] === true}" ng-if="faqDeatailView[items.bbc_no]"> </dd>\r\n            </dl>\r\n        </div>\r\n        <div class="list_more" ng-if="faqList.length != faq_tot_cnt">\r\n			<a href="#" ng-click="moreListClick()"><span>더보기 (<label id="currentCnt">{{faqList.length}}</label>/<label id="totalCnt">{{faq_tot_cnt}}</label>)</a></span>\r\n        </div>\r\n    </div>\r\n\r\n</section>')}]);