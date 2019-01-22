angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/ranking_container.html",'<div class="cont_wrap padding">\r\n	<!-- 최상단 띠배너 -->\r\n	<section ng-if="screenData.ban_list[0]" class="top_banner_list">\r\n		<ul>\r\n			<li><a ng-click="linkUrl(screenData.ban_list[0].img_link, screenData.ban_list[0].mov_frme_cd, \'m_DC_Ranking_{{ctgDispNo}}_rewardevent\')"><img ng-src="{{screenData.ban_list[0].img_url}}" alt="{{screenData.ban_list[0].banner_nm}}" /></a></li>\r\n\r\n			<!-- 640 이상일때만 나오는 출석 도장 이벤트 -->\r\n			<li ng-if="winWidth >= 640"><a ng-click="linkUrl(eventLinkObj.eventAttendUrl, false, \'m_DC_Ranking_{{ctgDispNo}}_tabletbanner\')"><img src="http://image.lotte.com/lotte/mo2015/angular/banner_201507_attend.png" alt="출석도짱" /></a></li>\r\n		</ul>\r\n	</section>\r\n\r\n	<!-- 카테고리 선택 영역 -->\r\n	<section class="category_ctg_wrap">\r\n		<!-- 셀렉트 박스 -->\r\n		<ul ng-class="{\r\n			depth1: screenData.ranking_ctg_depth_idx == 0,\r\n			depth2: screenData.ranking_ctg_depth_idx == 1,\r\n			depth3: screenData.ranking_ctg_depth_idx == 2,\r\n			open: rankingCtgOpenFlag\r\n			}">\r\n			<li ng-class="{on: rankingCtgOpenFlag && screenData.ranking_ui.selectbox_select_idx == 0}">\r\n				<a class="ctg_tit" ng-click="ctgSelectBoxClick(0)"><span class="depth_tit"><em>{{screenData.ranking_ui.selectbox[0].disp_grp_desc}}</em></span></a>\r\n			</li>\r\n			<li ng-if="screenData.ranking_ctg_depth_idx > 0"\r\n				ng-class="{on: rankingCtgOpenFlag && screenData.ranking_ui.selectbox_select_idx == 1}">\r\n				<a class="ctg_tit" ng-click="ctgSelectBoxClick(1)"><span class="depth_tit"><em>{{screenData.ranking_ui.selectbox[1].disp_grp_desc}}</em></span></a>\r\n			</li>\r\n			<li ng-if="screenData.ranking_ctg_depth_idx > 1"\r\n				ng-class="{on: rankingCtgOpenFlag && screenData.ranking_ui.selectbox_select_idx == 2}">\r\n				<a class="ctg_tit" ng-click="ctgSelectBoxClick(2)"><span class="depth_tit"><em>{{screenData.ranking_ui.selectbox[2].disp_grp_desc}}</em></span></a>\r\n			</li>\r\n		</ul>\r\n\r\n		<!-- 카테고리 스와이프 영역 -->\r\n		<div ng-show="rankingCtgOpenFlag" class="rangking_ctg_lst_wrap">\r\n			<ul>\r\n				<li ng-if="screenData.ranking_ui.selectbox_select_idx == 0" ng-class="{on: screenData.ranking_ui.selectbox_select_idx == 0}">\r\n					<div id="rankSwipeCtg1" ng-controller="lotteNgSwipeCtrl" class="swipe_wrap">\r\n						<ul lotte-ng-list-swipe\r\n							swipe-id="RankingCtgDepth1"\r\n							swipe-list-model="screenData.ranking_ctg_depth[0]"\r\n							swipe-slide-item="true"\r\n							swipe-max-ratio="0.2"\r\n							swipe-min-distance="40"\r\n							class="swipe_cont"\r\n							swipe-end-exec="swipeEndHandler1($event)">\r\n							<li ng-repeat="page in screenData.ranking_ctg_depth[0]">\r\n								<p class="ctg_item" ng-repeat="item in page">\r\n									<a ng-if="item.disp_grp_no || item.disp_grp_no == 0" ng-click="ctgChange(item)"\r\n										ng-class="{on: screenData.ranking_ui.selectbox[0].disp_grp_no == item.disp_grp_no}">{{item.disp_grp_desc}}</a>\r\n									<span ng-if="!item.disp_grp_no"></span>\r\n								</p>\r\n							</li>\r\n						</ul>\r\n						<div class="btn_close_wrap"><span class="page_info"><strong>{{swipeIdx + 1}}</strong> / {{screenData.ranking_ctg_depth[0].length}}</span><button ng-click="toggleCtg()" class="btn_close">닫기</button></div>\r\n					</div>\r\n				</li>\r\n				<li ng-if="screenData.ranking_ui.selectbox_select_idx == 1" ng-class="{on: screenData.ranking_ui.selectbox_select_idx == 1}">\r\n					<div id="rankSwipeCtg2" ng-controller="lotteNgSwipeCtrl" class="swipe_wrap">\r\n						<ul lotte-ng-list-swipe\r\n							swipe-id="RankingCtgDepth2"\r\n							swipe-list-model="screenData.ranking_ctg_depth[1]"\r\n							swipe-slide-item="true"\r\n							swipe-max-ratio="0.2"\r\n							swipe-min-distance="40"\r\n							class="swipe_cont"\r\n							swipe-end-exec="swipeEndHandler2($event)">\r\n							<li ng-repeat="page in screenData.ranking_ctg_depth[1]">\r\n								<p class="ctg_item" ng-repeat="item in page">\r\n									<a ng-if="item.disp_grp_no" ng-click="ctgChange(item)"\r\n										ng-class="{on: screenData.ranking_ui.selectbox[1].disp_grp_no == item.disp_grp_no}">{{item.disp_grp_desc}}</a>\r\n									<span ng-if="!item.disp_grp_no"></span>\r\n								</p>\r\n							</li>\r\n						</ul>\r\n						<div class="btn_close_wrap"><span class="page_info"><strong>{{swipeIdx + 1}}</strong> / {{screenData.ranking_ctg_depth[1].length}}</span><button ng-click="toggleCtg()" class="btn_close">닫기</button></div>\r\n					</div>\r\n				</li>\r\n				<li ng-if="screenData.ranking_ui.selectbox_select_idx == 2" ng-class="{on: screenData.ranking_ui.selectbox_select_idx == 2}">\r\n					<div id="rankSwipeCtg3" ng-controller="lotteNgSwipeCtrl" class="swipe_wrap">\r\n						<ul lotte-ng-list-swipe\r\n							swipe-id="RankingCtgDepth3"\r\n							swipe-list-model="screenData.ranking_ctg_depth[2]"\r\n							swipe-slide-item="true"\r\n							swipe-max-ratio="0.2"\r\n							swipe-min-distance="40"\r\n							class="swipe_cont"\r\n							swipe-end-exec="swipeEndHandler3($event)">\r\n							<li ng-repeat="page in screenData.ranking_ctg_depth[2]">\r\n								<p class="ctg_item" ng-repeat="item in page">\r\n									<a ng-if="item.disp_grp_no" ng-click="ctgChange(item)"\r\n										ng-class="{on: screenData.ranking_ui.selectbox[2].disp_grp_no == item.disp_grp_no}">{{item.disp_grp_desc}}</a>\r\n									<span ng-if="!item.disp_grp_no"></span>\r\n								</p>\r\n							</li>\r\n						</ul>\r\n						<div class="btn_close_wrap"><span class="page_info"><strong>{{swipeIdx + 1}}</strong> / {{screenData.ranking_ctg_depth[2].length}}</span><button ng-click="toggleCtg()" class="btn_close">닫기</button></div>\r\n					</div>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</section>\r\n\r\n	<!-- 개인화 영역 -->\r\n	<section class="bigdata_wrap" ng-if="screenData.ranking_ui.selectbox_select_idx < 2 || (screenData.ranking_ui.selectbox_select_idx == 2 && screenData.ranking_ui.selectbox[2].disp_grp_desc == \'전체\')">\r\n		<ul class="rank_type_sex">\r\n			<li><button ng-click="rankGenderChange(\'A\')" ng-class="{on: screenData.ranking_gender == \'A\'}">전체</button></li>\r\n			<li><button ng-click="rankGenderChange(\'F\')" ng-class="{on: screenData.ranking_gender == \'F\'}">여성</button></li>\r\n			<li><button ng-click="rankGenderChange(\'M\')" ng-class="{on: screenData.ranking_gender == \'M\'}">남성</button></li>\r\n		</ul>\r\n		<div class="rank_type_age">\r\n			<label for="rankTypeAge" ng-click="rankAgeLabelClick()">연령 : </label>\r\n			<div class="selectbox_wrap">\r\n				<select id="rankTypeAge" name="rankTypeAge" dir="rtl" ng-change="rankAgeChange()" ng-model="screenData.ranking_age">\r\n					<option value="A">전체</option>\r\n					<option value="20">20대</option>\r\n					<option value="30">30대</option>\r\n					<option value="40">40대</option>\r\n					<option value="50">50대이상</option>\r\n				</select>\r\n			</div>\r\n		</div>\r\n	</section>\r\n	\r\n	<!-- 집계기준 -->\r\n	<section class="desc_wrap" ng-class="{on:winWidth >= 640}">\r\n		<p>최근 7일간 가장 많이 구매한 상품을 집계한 랭킹입니다.</p>\r\n	</section>\r\n	\r\n	<div ng-controller="productCtrl">\r\n		<!-- 상품 리스트 -->\r\n		<div product-container\r\n			template-type="rank"\r\n			templatetype="templateType"\r\n			products="screenData.prd_deal_list"\r\n			win-width="winWidth"\r\n			more-product-continer="getProductData()"\r\n			tclick="m_DC_Ranking_{{ctgDispNo}}_item_"\r\n			tclick-wish="m_DC_Ranking_{{ctgDispNo}}_item_wish"\r\n			tclick-rank="m_DC_Ranking_{{ctgDispNo}}_search"\r\n			class="prd_lst_wrap"></div><!-- 20170330 삭제 : rank-keyword="screenData.lank_keyword" -->\r\n\r\n		<div class="noData" ng-if="!screenData.prd_deal_list.length && !productListLoading && !pageLoading">해당 상품이 없습니다.</div>\r\n\r\n		<!-- Product Load Loading -->\r\n		<div class="listLoading" ng-if="productListLoading && !pageLoading">\r\n			<p class="loading half"></p>\r\n		</div>\r\n\r\n	</div>\r\n</div>')}]);