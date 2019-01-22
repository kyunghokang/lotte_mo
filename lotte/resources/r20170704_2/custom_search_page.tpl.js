angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/search/custom_search_page_container.html",'<section class="cont_minheight" id="customSearchWrap" ng-class="{androidApp:appObj.isApp, iphone:(appObj.isIOS && !appObj.isIpad)}">\r\n	<div class="csw_head">\r\n		<p class="prev">\r\n			<a ng-click="gotoPrepage()">이전</a>\r\n		</p>\r\n		<h3>맞춤설정</h3>\r\n		<!-- <a class="close" href="#" ng-click="csCloseCustomSearch()">닫기</a> -->\r\n	</div>\r\n\r\n	<div class="csw_body">\r\n		<div class="csw_selected" id="csw_selected">\r\n			<div>\r\n				<div ng-if="csTempSettings.customized==false">\r\n					<div class="empty"><em></em>자주 찾는 검색 조건을 설정해주세요</div>\r\n				</div>\r\n				<div ng-if="csTempSettings.customized==true" class="csw_pad">\r\n					<a href="#" class="cate" ng-repeat="item in csTempSettings.category track by $index" ng-click="csDeselectItem(\'ctg\', item)">{{item.ctgName}}</a>\r\n					<a href="#" class="bran" ng-repeat="item in csTempSettings.brand track by $index" ng-click="csDeselectItem(\'brd\', item)">{{item.brnd_nm}}</a>\r\n					<a href="#" class="c{{item.colorCd}} color" ng-repeat="item in csTempSettings.color track by $index" ng-click="csDeselectItem(\'clr\', item)"></a>\r\n				</div>\r\n			</div>\r\n		</div>\r\n		<div class="csw_selection" id="csw_selection">\r\n			<div class="csw_tabs">\r\n				<a href="#" ng-click="csSelectTab(0)" class="tab1" ng-class="{on:csUIStatus.tabSelection==0}">카테고리</a>\r\n				<a href="#" ng-click="csSelectTab(1)" class="tab2" ng-class="{on:csUIStatus.tabSelection==1}">브랜드</a>\r\n				<a href="#" ng-click="csSelectTab(2)" class="tab3" ng-class="{on:csUIStatus.tabSelection==2}">컬러</a>\r\n			</div>\r\n			<div class="csw_cont">\r\n				<!-- category -->\r\n				<div ng-show="csUIStatus.tabSelection==0" ng-class="{show:csUIStatus.tabSelection==0}" class="category">\r\n					<div class="scrollable">\r\n						<div>\r\n							<div class="guide">최대 2개 카테고리 선택이 가능합니다.</div>\r\n							<ul>\r\n								<li ng-repeat="item in csCustomBaseData.category.items track by $index"\r\n									ng-click="csSelectCategory(item)"\r\n									ng-class="{on:item.on}" class="c{{item.ctgNo}}">{{item.ctgName}}</li>\r\n							</ul>\r\n						</div>\r\n					</div>\r\n				</div>\r\n				<!-- category -->\r\n				<!-- brand -->\r\n				<div ng-show="csUIStatus.tabSelection==1" ng-class="{show:csUIStatus.tabSelection==1}" class="brand">\r\n						<div class="guide">최대 10개 브랜드 선택이 가능합니다.</div>\r\n					<div class="brand_search">\r\n						<input type="search" id="csw_brand_tf" name="csw_brand_tf" value="" autocomplete="off" autocapitalize="off" autocorrect="off" placeholder="브랜드를 입력해주세요"\r\n							ng-keyup="csBrandSearchText()" ng-model="csUIData.brandKeyword" />\r\n						<!-- <a href="#">Clear</a> -->\r\n					</div>\r\n					<div class="scrollable">\r\n						<div>\r\n							<div ng-if="csUIData.brandList.length == 0 && csUIData.brandKeywordSearch.length < 2">\r\n								<ul class="brandLanguage kor" ng-if="csUIStatus.brandLanguage==\'ko\'">\r\n									<li ng-repeat="item in csBrandIndex[0] track by $index" ng-click="csBrandSearchCap($index, 0, item)">{{item}}</li>\r\n									<li ng-click="csChangeBrandLanguage(\'en\')">ABC</li>\r\n								</ul>\r\n								<ul class="brandLanguage eng" ng-if="csUIStatus.brandLanguage==\'en\'">\r\n									<li ng-repeat="item in csBrandIndex[1] track by $index" ng-click="csBrandSearchCap($index, 1, item)">{{item}}</li>\r\n									<li ng-click="csChangeBrandLanguage(\'ko\')">ㄱㄴㄷ</li>\r\n								</ul>\r\n							</div>\r\n							<div ng-if="csUIData.brandList.length > 0 || csUIData.brandKeywordSearch.length >= 2">\r\n								<ul class="list">\r\n									<li ng-repeat="item in csUIData.brandList track by $index"\r\n										ng-class="{on:item.on}"\r\n										ng-click="csSelectBrand(item)"\r\n										ng-if="item.brnd_nm!=\'\'">{{item.brnd_nm}}<span>{{item.cnt}}</span></li>\r\n								</ul><!-- ng-bind-html="csReplaceBrandKeyword(item)" 속도 이슈로 비활성, 요청시 적용 -->\r\n							</div>\r\n						</div>\r\n					</div>\r\n				</div>\r\n				<!-- brand -->\r\n				<!-- color -->\r\n				<div ng-show="csUIStatus.tabSelection==2" ng-class="{show:csUIStatus.tabSelection==2}" class="color">\r\n					<div class="scrollable">\r\n						<div>\r\n							<div class="guide">최대 3개의 컬러 선택이 가능합니다.</div>\r\n							<ul>\r\n								<li ng-repeat="item in csCustomBaseData.color.items track by $index"\r\n									class="c{{item.colorCd}}" ng-class="{on:item.on}" ng-click="csSelectColor(item)"></li>\r\n							</ul>\r\n						</div>\r\n					</div>\r\n				</div>\r\n				<!-- color -->\r\n			</div>\r\n		</div>\r\n	</div>\r\n\r\n	<div class="csw_foot">\r\n		<div class="reset"><a href="#" ng-click="csResetCustomSearch(\'m_dc_customizing_search_CLK_reset_Btn\')"\r\n			ng-class="{disabled:!(csCustomSettings.customized || csTempSettings.customized)}">초기화</a></div>\r\n		<div class="apply"><a href="#" ng-click="csApplyCustomSearch()"\r\n			ng-class="{disabled:csTempSettings.changed==false}">선택적용</a></div>\r\n	</div>\r\n\r\n	<div class="cs_loading" ng-show="csUIStatus.ajaxLoading"></div>\r\n\r\n</section>')}]);