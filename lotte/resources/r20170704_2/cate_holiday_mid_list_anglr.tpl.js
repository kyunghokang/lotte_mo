angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/layer/main_popup.html",'<div class="main_popup" ng-class="{full:appObj.isApp && mainPop.ppp_prt_tp_cd == \'F\'}"  ng-show="isOpenPop==true" ng-if="isOpenPop==true">\r\n     <div class="inner" ng-if="mainPop.ppp_tp_cd != \'A\'">\r\n        <div class="cont">\r\n            <div class="img" ng-if="mainPop.ppp_tp_cd == \'I\'">\r\n                <a href="{{mainPop.ppp_lnk_url_addr}}" ng-if="mainPop.is_function == true">\r\n                	<img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="LOTTE.COM"/>\r\n                </a>\r\n                <a ng-click="cornerBanView(mainPop.ppp_lnk_url_addr)" ng-if="mainPop.is_function == false">\r\n                	<img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="LOTTE.COM" pop-img />\r\n                </a>\r\n            </div>\r\n            <div class="img" ng-if="mainPop.ppp_tp_cd == \'C\'">\r\n                <a href="#" ng-click="dupCouponIssue(mainPop.cpn_no)"> <!-- {{mainPop.ppp_lnk_url_addr}} -->\r\n                	<img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="LOTTE.COM"/>\r\n                </a>\r\n            </div>\r\n        </div>\r\n        <div class="check">\r\n            <button ng-click="popToday()">오늘하루 그만보기</button>\r\n            <button class="btn_close" ng-click="popClose()">닫기</button>\r\n        </div>\r\n    </div>\r\n    <!-- 20160819 제휴채널 전면 팝업 -->\r\n    <div ng-if="chkAlliancePopupObj.flag && mainPop.ppp_tp_cd == \'A\'" class="alliance_pop">\r\n        <div class="dimmed"></div>\r\n        <div class="cont">\r\n            <a ng-click="allianceExcuteApp(\'{{mainPop.referrer}}\')" class="img_wrap"><img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="롯데닷컴 앱 다운로드" /></a>\r\n            <!-- 2016.12.06 requests-->\r\n            <a ng-click="closeAlliancePopup();" class="btn_close"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/detail/popBann_close_20160512.png" alt="롯데닷컴 앱 다운로드-닫기" /></a>\r\n        </div>\r\n    </div>\r\n</div>'),a.put("/lotte/resources_dev/layer/app_down_bnr.html",'<div class="app_bnr_wrap" style="background-color: {{appBnrInfo.bgColor}}">\r\n	<a ng-click="appDown();" class="btn_appdown"><img ng-src="{{appBnrInfo.imgPath}}" alt="롯데닷컴 앱 다운로드" /></a>\r\n	<button ng-click="appDownBnrClose();" class="btn_close">앱다운로드 배너 그만보기</button>\r\n</div>'),a.put("/lotte/resources_dev/category/m/cate_holiday_mid_list_anglr_container.html",'<section id="container" ng-show="contVisible" class="cont_minheight">\n	<section class="pageLoading" ng-show="pageLoading">\n		<p class="loading half"></p>\n	</section>\n	<section ng-show="!pageLoading">\n		<div class="menu_smallcate">\n			<ul class="cateList">\n				<li ng-repeat="item in screenData.smallCate"><a ng-click="subCateClick(item)">{{item.disp_nm}}</a></li>\n			</ul>	\n			<div ng-show="screenData.rankingBestBuy.length">\n				<!-- 추천상품 -->\n				<div class="peopleBuy" ng-controller="productCtrl">\n					<h5>추천상품</h5>\n					<!-- 리스트형 유닛 -->\n					<product-container template-type="list2" products="screenData.rankingBestBuy" more-product-continer="loadScreenData()"></product-container>\n				</div>\n				<div class="listLoading" ng-if="productListLoading&&templateType!=\'swipe\'">\n					<p class="loading half"></p>\n				</div>\n			</div>\n		</div>\n		\n	</section>\n</section>\n')}]);