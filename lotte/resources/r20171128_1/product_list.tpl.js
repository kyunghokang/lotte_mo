angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/layer/main_popup.html",'<div class="main_popup" ng-class="{full:appObj.isApp && mainPop.ppp_prt_tp_cd == \'F\'}"  ng-show="isOpenPop==true" ng-if="isOpenPop==true">\r\n     <div class="inner" ng-if="mainPop.ppp_tp_cd != \'A\'">\r\n        <div class="cont">\r\n            <div class="img" ng-if="mainPop.ppp_tp_cd == \'I\'">\r\n                <a href="{{mainPop.ppp_lnk_url_addr}}" ng-if="mainPop.is_function == true">\r\n                	<img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="LOTTE.COM"/>\r\n                </a>\r\n                <a ng-click="cornerBanView(mainPop.ppp_lnk_url_addr)" ng-if="mainPop.is_function == false">\r\n                	<img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="LOTTE.COM" pop-img />\r\n                </a>\r\n            </div>\r\n            <div class="img" ng-if="mainPop.ppp_tp_cd == \'C\'">\r\n                <a href="#" ng-click="dupCouponIssue(mainPop.cpn_no)"> <!-- {{mainPop.ppp_lnk_url_addr}} -->\r\n                	<img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="LOTTE.COM"/>\r\n                </a>\r\n            </div>\r\n        </div>\r\n        <div class="check">\r\n            <button ng-click="popToday()">오늘하루 그만보기</button>\r\n            <button class="btn_close" ng-click="popClose()">닫기</button>\r\n        </div>\r\n    </div>\r\n    <!-- 20160819 제휴채널 전면 팝업 -->\r\n    <div ng-if="chkAlliancePopupObj.flag && mainPop.ppp_tp_cd == \'A\'" class="alliance_pop">\r\n        <div class="dimmed"></div>\r\n        <div class="cont">\r\n            <a ng-click="allianceExcuteApp(\'{{mainPop.referrer}}\')" class="img_wrap"><img ng-src="{{mainPop.ppp_img_file_path_nm}}" alt="롯데닷컴 앱 다운로드" /></a>\r\n            <!-- 2016.12.06 requests-->\r\n            <a ng-click="closeAlliancePopup();" class="btn_close"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/detail/popBann_close_20160512.png" alt="롯데닷컴 앱 다운로드-닫기" /></a>\r\n        </div>\r\n    </div>\r\n</div>'),a.put("/lotte/resources_dev/layer/app_down_bnr.html",'<div class="app_bnr_wrap" style="background-color: {{appBnrInfo.bgColor}}">\r\n	<a ng-click="appDown();" class="btn_appdown"><img ng-src="{{appBnrInfo.imgPath}}" alt="롯데닷컴 앱 다운로드" /></a>\r\n	<button ng-click="appDownBnrClose();" class="btn_close">앱다운로드 배너 그만보기</button>\r\n</div>'),a.put("/lotte/resources_dev/product/m/product_list_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<!-- 기획전 전용 서브 헤더 (카테고리 선택영역 때문에) -->\r\n	<!-- subhead 수정해야함 <header id="head_sub" sub-header> -->\r\n	<!--  20151115 임수경<header id="head_sub" class="each" ng-if="!noData && !isLoading" sub-header-each style="transform:none;">-->\r\n	<div class="sub_header_wrap">\r\n		<header id="head_sub" class="each" ng-if="!noData && !isLoading" sub-header-each>\r\n			<h2 cate-navi>\r\n				<span ng-click="cateViewClick()" ng-class="{super:planKindData == \'superchance\',surprise:planKindData == \'11\',story:storyParam == \'Y\'}">\r\n					<span ng-if="planKindData == \'superchance\'" class="super">슈퍼찬스<em class="count"  ng-if="categoryData.total_count != \'0\'">({{categoryData.total_count}})</em></span>\r\n					<span ng-if="planKindData == \'11\'" class="surprise">서프라이즈<em class="count"  ng-if="categoryData.total_count != \'0\'">(5)</em></span>\r\n					<span ng-if="planKindData == \'24\'">쇼핑홀릭<em class="count"  ng-if="categoryData.total_count != \'0\'">({{categoryData.total_count}})</em></span>\r\n					<span ng-if="storyParam == \'Y\'" class="story">{{stCate}}<em class="count"  ng-if="stroyShopData.total_count != \'0\'">({{stroyShopData.length}})</em></span>\r\n			<!--기획전 외 헤더 타이틀 적용-->\r\n			<span ng-if="planKindData == \'10\'" class="planSubTitleText"\r\n				ng-class="{\r\n					saengsaeng:	dispNoParam == \'5400745\',\r\n					stylecodi:	dispNoParam == \'5397045\',\r\n					playshop:	dispNoParam == \'5398466\',\r\n					stylerecom:	dispNoParam == \'5407118\',\r\n					stylecollection:	dispNoParam == \'5408550\'\r\n				}"></span>\r\n\r\n						<!-- <span ng-if="false && planKindData == \'10\' && dispNoParam == \'5408550\'">2017 S/S LOTTE.COM STYLLE collection</span>\r\n						<span ng-if="false && planKindData == \'10\' && dispNoParam == \'5400745\'">생생#</span>\r\n						<span ng-if="false && planKindData == \'10\' && dispNoParam == \'5397045\'">스타일코디</span>\r\n						<span ng-if="false && planKindData == \'10\' && dispNoParam == \'5398466\'">PLAY#</span>\r\n						<span ng-if="false && planKindData == \'10\' && dispNoParam != \'5397045\' && dispNoParam != \'5398466\' && dispNoParam != \'5400745\'">기획전</span> -->\r\n\r\n					<a ng-if="planKindData != \'10\' && categoryData.total_count != \'0\'" ng-if="categoryData" ng-class="{true: \'btn_sel on\', false: \'btn_sel\'}[cateViewFlag]">화살표</a>\r\n					<a ng-if="stroyShopData.length != \'0\'" ng-if="stroyShopData" ng-class="{true: \'btn_sel on\', false: \'btn_sel\'}[cateViewFlag]">화살표</a>\r\n				</span>\r\n				<!-- 스와이프가 아닌 경우 : 일반-->\r\n				<span class="tlt_selBox" ng-class="{on:cateViewFlag}" ng-if="categoryData.total_count != \'0\' && planKindData != \'10\' && storyParam != \'Y\' && planKindData != \'11\'">\r\n					<span ng-repeat="items in categoryData.items"><a ng-click="goPlanshopClick(items.conts_desc_cont)"  ng-class="{on : items.conts_desc_cont == dispNoParam}" >{{items.conts_tit_nm}}</a></span>\r\n				</span>\r\n				<!-- 스와이프가 아닌 경우 : 서프라이즈-->\r\n				<span class="tlt_selBox" ng-class="{on:cateViewFlag}" ng-if="categoryData.total_count != \'0\' && planKindData != \'10\' && storyParam != \'Y\' && planKindData == \'11\'">\r\n					<span ng-repeat="items in categoryData.items" ng-show="$index < 5"><a ng-click="goPlanshopClick(items.conts_desc_cont)"  ng-class="{on : items.conts_desc_cont == dispNoParam}" >{{items.conts_tit_nm}}</a></span>\r\n				</span>\r\n\r\n				<!-- 스토리샵일 경우 -->\r\n				<div class="prdAllViewList" ng-class="{on:cateViewFlag}" ng-if="storyParam == \'Y\' && cateViewFlag == true" ng-controller="lotteNgSwipeCtrl">\r\n					<div class="list">\r\n						<ul lotte-ng-list-swipe swipe-slide-item="true" swipe-list-model="stroyShopData" swipe-max-ratio="0.2" swipe-min-distance="40" style="height:223px;">\r\n							<li ng-repeat="i in getStorySwipeSize() track by $index">\r\n								<div ng-repeat="items in stroyShopData|pageRange:$index:5">\r\n									<a ng-click="storyshopMove(items, $index + 1)">{{brRemove(items.title_nm)}}<span>{{items.start_date}}~</span></a>\r\n								</div>\r\n							</li>\r\n						</ul>\r\n					</div>\r\n					<div class="paging">\r\n						<span class=""> {{swipeIdx+1}} / {{getStorySwipeSize().length}}</span>\r\n						<a ng-click="closeCateClick()" class="btn_close"><span>닫기</span></a>\r\n					</div>\r\n				</div>\r\n				<!-- //스토리샵일 경우 -->\r\n			</h2>\r\n			<p class="this" ng-if="isShowThisSns">\r\n				<a ng-click="showSharePop({shareImg:autoBannerData.img_url_550})">공유</a>\r\n			</p>\r\n		</header>\r\n		<!-- //서브 헤더 -->\r\n		<header id="head_sub" ng-if="noData || isLoading"  sub-header-each>\r\n			<h2>\r\n				<span>\r\n					<span ng-if ="shoppingholicParam == \'Y\'">쇼핑홀릭</span>\r\n					<span ng-if ="storyParam == \'Y\'">스토리샵</span>\r\n					<span ng-if ="shoppingholicParam != \'Y\' && storyParam != \'Y\'"></span><!-- 기획전 -->\r\n				</span>\r\n			</h2>\r\n			<p class="this" ng-if="isShowThisSns">\r\n				<a ng-click="">공유</a>\r\n			</p>\r\n		</header>\r\n	</div>\r\n	<!-- //서브 헤더 -->\r\n	<!--<section id="subHeaderSpace" style="padding-top:48px;"></section>-->\r\n	<!-- container -->\r\n	<div id="container" ng-if="!noData && !isLoading">\r\n\r\n        <!--20161201 앱푸쉬배너-->\r\n        <div ng-if="param_cn == \'133224\'" style="background:#4074c7;text-align:center">\r\n			<!--11.1 일 변경-->\r\n           <a href="#" ng-click="goApppush_Event2()" ng-if="!appPushFlag">\r\n                <img src="http://image.lotte.com/lotte/mo2015/angular/mall/app_push_banner1101.jpg" style="width:320px"/>\r\n           </a>\r\n           <!--12.1 일 변경-->\r\n           <a href="#" ng-click="goApppush_Event3()" ng-if="appPushFlag">\r\n                <img src="http://image.lotte.com/lotte/mo2015/angular/mall/app_push_banner1201.jpg" style="width:320px"/>\r\n           </a>\r\n        </div>\r\n\r\n        <!--20160503 스토리샵-->\r\n        <section ng-if="storyParam == \'Y\' && stTitle != \'\'" class="storyShop_head">\r\n            <span class="st_title">{{stTitle}}</span>\r\n            <span class="st_date">{{stDate}}</span>\r\n        </section>\r\n	    <!--201601115 -->\r\n        <div class="sur_wrap" ng-if="isSurprise">\r\n            <div class="sur_bannerWrap" ng-if="surpriseTopInfo.bannerImageUrl != \'\'">\r\n                <img ng-src="{{surpriseTopInfo.bannerImageUrl}}">\r\n            </div>\r\n            <div class="sur_detail" ng-if="surpriseTopInfo.bannerBrand != \'\' || surpriseTopInfo.bannerDesc != \'\'">\r\n                <div class="sur_mark"></div>\r\n                <p class="sur_detail1">{{surpriseTopInfo.bannerBrand}}</p>\r\n                <p class="sur_detail2">{{surpriseTopInfo.bannerDesc}}</p>\r\n            </div>\r\n            <div class="sur_eventbannerWrap" ng-if="surpriseEventBanner.imgUrl != undefined && surpriseEventBanner.imgUrl != \'\'">\r\n                <img ng-src="{{surpriseEventBanner.imgUrl}}" alt="" ng-click="surpriseEventBannerClick()">\r\n            </div>\r\n            <div class="sur_list">\r\n                <ul>\r\n                    <li class="sur_list1 r_b" ng-class="{on : categoryData.items[0].conts_desc_cont == dispNoParam}"><a ng-click="goPlanshopClick(categoryData.items[0].conts_desc_cont)">{{categoryData.items[0].conts_tit_nm}}</a></li>\r\n                    <li class="sur_list1" ng-class="{on : categoryData.items[1].conts_desc_cont == dispNoParam}"><a ng-click="goPlanshopClick(categoryData.items[1].conts_desc_cont)">{{categoryData.items[1].conts_tit_nm}}</a></li>\r\n                    <li class="sur_list2 r_b" ng-class="{on : categoryData.items[2].conts_desc_cont == dispNoParam}"><a ng-click="goPlanshopClick(categoryData.items[2].conts_desc_cont)">{{categoryData.items[2].conts_tit_nm}}</a></li>\r\n                    <li class="sur_list2 r_b" ng-class="{on : categoryData.items[3].conts_desc_cont == dispNoParam}"><a ng-click="goPlanshopClick(categoryData.items[3].conts_desc_cont)">{{categoryData.items[3].conts_tit_nm}}</a></li>\r\n                    <li class="sur_list2" ng-class="{on : categoryData.items[4].conts_desc_cont == dispNoParam}"><a ng-click="goPlanshopClick(categoryData.items[4].conts_desc_cont)">{{categoryData.items[4].conts_tit_nm}}</a></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!--생생샵 20160825 sslive_flag-->\r\n        <div ng-if="sslive_vod_flag">\r\n            <!--<img ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/sslive_planshop_01.jpg">-->\r\n            <a ng-href="/mall/sslive.do?{{baseParam}}" ng-if="sslive_vod_flag">\r\n                <img ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/sslive_planshop_02.jpg">\r\n            </a>\r\n        </div>\r\n\r\n		<!-- s: 기획전 상세 -->\r\n		<div class="planshop_detail">\r\n			<div  ng-if="autoBanner == \'N\'">\r\n				<div class="plan_bannerWrap" ng-if="topHtml!=\'\'">\r\n					<p id="mobile_html" ng-bind-html="topHtml | toTrustedHtml"></p>\r\n				</div>\r\n				<div class="plan_bannerWrap" ng-if="dispNoParam != \'5397045\'">\r\n					<img ng-src="http://image.lotte.com{{benefitData.imgUrl}}" alt="" ng-click="benefitClick()"/>\r\n				</div>\r\n			</div>\r\n			<!-- 댓글 -->\r\n			<comment-Module ng-if="comment == \'Y\' && commentType == \'02\'"></comment-Module>\r\n			<!-- //댓글 -->\r\n			<div class="plan_bannerWrap" ng-if="autoBanner == \'Y\'">\r\n				<div>\r\n					<!-- 상품이 있는 경우 -->\r\n					<div class="plan_bannerWrap specialExhibi" ng-if="autoBannerData">\r\n						<div class="dimmed"></div>\r\n						<img class="banner" ng-src="{{autoBannerData.img_url_550}}" alt="" />\r\n						<div class="bannerTlt">\r\n							<span>{{bannerNameData}}</span>\r\n						</div>\r\n					</div>\r\n\r\n					<!-- 상품이 품절인 경우 -->\r\n					<div class="plan_bannerWrap specialExhibi" ng-if="!autoBannerData">\r\n						<div class="dimmed"></div>\r\n						<img class="banner" src="http://image.lotte.com/lotte/mo2015/angular/brandshop/planshop_banner_blank.jpg" alt="" ng-if="!bannerImgData"/>\r\n						<div class="bannerTlt">\r\n							<span>{{bannerNameData}}</span>\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			<!--e: 상단 배너-->\r\n\r\n			<!--s: 방금 그상품-->\r\n			<div class="plan_justPrd" ng-if="lastProData" scroll-if="lastProData">\r\n				<div class="justPrd">\r\n					<a ng-click="goGoodsDetail(lastProData.items[0], \'recent\', \'0\')">\r\n						<div class="thumb">\r\n							<div class="flag just"><span>방금 그상품</span></spn></div>\r\n							<img ng-src="{{lastProData.items[0].img_url}}" ng-alt="{{lastProData.items[0].goods_nm}}" />\r\n						</div>\r\n						<div class="info">\r\n							<p class="flag">\r\n								<span ng-if="lastProData.items[0].is_dept == true" class="flag depart">롯데백화점</span>\r\n								<span ng-if="lastProData.items[0].is_tvhome == true" class="flag etv">롯데홈쇼핑</span>\r\n								<span ng-if="lastProData.items[0].has_coupon == true" class="flag free">무료배송</span>\r\n								<span ng-if="lastProData.items[0].smartpick_yn == \'Y\'" class="flag smart">스마트픽</span>\r\n							</p>\r\n							<span class="tit">[{{lastProData.items[0].brnd_nm}}] {{lastProData.items[0].goods_nm}}</span>\r\n							<p class="pr_box" ng-if="!lastProData.items[0].price2">\r\n								<span class="price"><em>{{lastProData.items[0].discounted_price | number}}</em>원</span>\r\n								<span class="price2" ng-show="lastProData.items[0].original_price != lastProData.items[0].discounted_price && lastProData.items[0].original_price !=0 "><em>{{lastProData.items[0].original_price | number}}</em>원</span>\r\n							</p>\r\n							<p class="coupon"><em class="no" ng-if="lastProData.items[0].sale_rate > 0">{{lastProData.items[0].sale_rate}}</em><em class="po" ng-if="lastProData.items[0].sale_rate > 0">%</em><span ng-if="lastProData.items[0].has_coupon">쿠폰포함</span></p>\r\n						</div>\r\n					</a>\r\n				</div>\r\n			</div>\r\n			<!--e: 방금 그상품-->\r\n\r\n			<!--s: 대표상품 전시영역 - swipe형-->\r\n			<div class="banner_slide" ng-controller="lotteNgSwipeCtrl" ng-if="planKindData == \'10\'" ng-show="upplanshopMainData != \'0\'">\r\n				<div class="plan_prdThumb">\r\n					<ul lotte-ng-list-swipe swipe-slide-item="true" swipe-list-model="upplanshopMainData.items" swipe-disp-count="3" swipe-max-ratio="0.2" swipe-min-distance="40" style="overflow:visible;">\r\n						<li ng-repeat="items in upplanshopMainData.items">\r\n							<div class="item">\r\n								<a ng-click="goGoodsDetail(items, \'norUp\', $index)">\r\n									<img ng-src="{{items.img_url}}" ng-alt="{{items.goods_nm}}"/>\r\n									<p class="prd_price"><em>{{items.discounted_price}}</em>원</p>\r\n									<p class="prd_name">{{items.goods_nm}}</p>\r\n								</a>\r\n							</div>\r\n						</li>\r\n					</ul>\r\n					<p class="btn_prev" ng-click="beforeSlide()" ng-show="swipeBulletIdx > 0">이전</p>\r\n					<p class="btn_next" ng-click="nextSlide()" ng-if="swipeBulletIdx<=(swipeBullet.length-2)">다음</p>\r\n				</div>\r\n			</div>\r\n			<!--e: 상단구분자 상품 - swipe형 -->\r\n\r\n			<!-- 대표상품 전시영역  topcor 없을 경우 auto 표기 -->\r\n			<!-- 전시영역 있는 경우 -->\r\n			<div ng-if="upplanshopMainData != \'0\' && planKindData != \'11\'">\r\n				<div class="banner_slide"  ng-controller="lotteNgSwipeCtrl"  ng-if="planKindData != \'10\'"  ng-show="upplanshopMainData.items">\r\n					<div class="plan_prdThumb">\r\n						<ul class="prdList" lotte-ng-list-swipe swipe-slide-item="true" swipe-list-model="upplanshopMainData.items" swipe-disp-count="3" swipe-max-ratio="0.2" swipe-min-distance="40" style="overflow:visible;">\r\n							<li ng-repeat="items in upplanshopMainData.items">\r\n								<!-- 일반상품 : 스와이프형 -->\r\n								<div class="item">\r\n									<a ng-click="goGoodsDetail(items, \'spUp\', $index)">\r\n										<!--<span class="tlt">{{items.title_nm}}</span>  -->\r\n										<img ng-src="{{items.img_url}}" ng-alt="{{items.goods_nm}}" />\r\n										<p class="prd_price">\r\n											<em>{{items.discounted_price}}</em>원\r\n										</p>\r\n										<div class="prd_name">\r\n											[{{items.brnd_nm}}] {{items.goods_nm}}\r\n										</div>\r\n									</a>\r\n								</div>\r\n								<!-- //일반상품 : 스와이프형 -->\r\n							</li>\r\n						</ul>\r\n						<p class="btn_prev" ng-click="beforeSlide()" ng-show="swipeIdx > 0">이전</p>\r\n						<p class="btn_next" ng-click="nextSlide()" ng-if="swipeIdx<=(swipeBullet.length-2)">다음</p>\r\n					</div>\r\n					<!-- <div class="paging">\r\n						<ol>\r\n							<li ng-repeat="item in swipeBullet" ng-class="{on:$index==swipeIdx}">{{$index}}</li>\r\n						</ol>\r\n					</div> -->\r\n				</div>\r\n			</div>\r\n\r\n			<!-- 전시영역 있는 경우 -->\r\n			<div ng-if="upplanshopMainData != \'0\' && planKindData == \'11\'">\r\n				<div class="prd_swipe"  ng-controller="lotteNgSwipeCtrl"  ng-if="planKindData != \'10\'"  ng-show="upplanshopMainData.items">\r\n					<div class="mask">\r\n						<ol class="prdList" lotte-ng-list-swipe swipe-responsive="true" swipe-responsive320="1"  swipe-responsive640="2"  swipe-responsive900="2" swipe-slide-item="true" swipe-list-model="upplanshopMainData.items" swipe-max-ratio="0.2" swipe-id="prdList" swipe-min-distance="40">\r\n							<li ng-repeat="items in upplanshopMainData.items">\r\n								<!-- 일반상품 : 스와이프형 -->\r\n								<div class="prd_item">\r\n									<a ng-click="goGoodsDetail(items, \'spUp\', $index)">\r\n										<p class="thumb">\r\n											<span class="tlt">{{items.title_nm}}</span>\r\n											<img ng-src="{{items.img_url}}" ng-alt="{{items.goods_nm}}" />\r\n											<span class="thumb_price">\r\n												<!-- 1. 가격, 할인율, 쿠폰포함 있을때 -->\r\n												<span ng-if="items.sale_rate != \'0\' && items.use_cpn == \'coupon\' && items.good_tp_cd != \'30\' && items.is_sale_promotion == false">\r\n													<span class="price"><em>{{items.discounted_price}}</em>원</span>\r\n													<span class="coupon">\r\n														<em class="no">{{items.sale_rate}}</em><em class="po">%</em>\r\n														<span>쿠폰포함</span>\r\n													</span>\r\n												</span>\r\n												<!-- 2. 가격만 있을때 -->\r\n												<span ng-if="items.sale_rate == \'0\' && items.good_tp_cd != \'30\' && items.is_sale_promotion == false">\r\n													<span class="price only">\r\n														<em>{{items.discounted_price}}</em>원\r\n													</span>\r\n												</span>\r\n												<!-- 3. 가격, 할인율만 있을때 -->\r\n												<span ng-if="items.sale_rate != \'0\' && items.use_cpn != \'coupon\' && items.good_tp_cd != \'30\' && items.is_sale_promotion == false">\r\n													<span class="price"><em>{{items.discounted_price}}</em>원</span>\r\n													<span class="coupon not_include">\r\n														<em class="no">{{items.sale_rate}}</em><em class="po">%</em>\r\n													</span>\r\n												</span>\r\n												<!-- 4. 기획전형 상품 -->\r\n												<span ng-if="items.is_sale_promotion">\r\n													<span class="price only">\r\n														<em>{{items.discounted_price}}</em>원<span ng-if="items.is_sale_promotion">~</span>\r\n													</span>\r\n												</span>\r\n											</span>\r\n										</p>\r\n										<div class="info">\r\n											<span ng-if="items.is_dept == true" class="flag depart">롯데백화점</span>\r\n											<span ng-if="items.is_tvhome == true" class="flag etv">롯데홈쇼핑</span>\r\n											<span ng-if="items.smartpick_yn == \'Y\'" class="flag smart">스마트픽</span>\r\n											<span ng-if="items.use_cpn == \'coupon\'" class="flag free">무료배송</span>\r\n											<span class="tit">[{{items.brnd_nm}}] {{items.goods_nm}}</span>\r\n										</div>\r\n									</a>\r\n								</div>\r\n								<!-- //일반상품 : 스와이프형 -->\r\n							</li>\r\n						</ol>\r\n					</div>\r\n					<p class="btn_prev" ng-click="beforeSlide()" ng-show="swipeBulletIdx > 0">이전</p>\r\n					<p class="btn_next" ng-click="nextSlide()" ng-if="swipeBulletIdx<=(swipeBullet.length-2)">다음</p>\r\n					<div class="paging">\r\n						<ol>\r\n							<li ng-repeat="item in swipeBullet" ng-class="{on:$index==swipeBulletIdx}">{{$index}}</li>\r\n						</ol>\r\n					</div>\r\n				</div>\r\n			</div>\r\n\r\n			<!-- 댓글 -->\r\n			<comment-Module ng-if="comment == \'Y\' && commentType == \'03\'"></comment-Module>\r\n			<!-- //댓글 -->\r\n            <!--20160115 서프라이즈 사은혜택 및 Notice-->\r\n            <div class="sur_giftWrap"  ng-if="isSurprise">\r\n                <div class="sur_gift" ng-if="spromotion != undefined">\r\n                    <h3>서프라이즈 사은혜택</h3>\r\n                    <a ng-href="{{spromotion.link_url}}">\r\n                        <img ng-src="{{spromotion.img_url}}" alt="{{spromotion.alt}}">\r\n                    </a>\r\n                </div>\r\n                <div class="sur_notice" ng-if="surpriseNotice.length > 0">\r\n                    <h3 class="on noticeDetail" onClick="$(\'.noticeDetail\').toggleClass(\'on\')">Notice</h3>\r\n                    <ul>\r\n                        <li ng-repeat="item in surpriseNotice">{{item.noticeText}}</li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n			<!-- 서프라이즈 홍보문구 안내\r\n			<div ng-if="upplanshopMainData != \'0\'">\r\n				<img ng-src="{{promotionData.img_url}}" ng-alt="{{promotionData.alt}}">\r\n			</div>\r\n 			-->\r\n			<!-- 20170627기획전페이지상품없을시 -->\r\n			<div class="sort_cate_wrap planshop_sub_cate" ng-if="productList.length && (dispNoParam != \'5397045\')">\r\n				<sort-cate ng-if="productList.length && (dispNoParam != \'5397045\')" ng-class="{fixtype:fixflag}"></sort-cate>\r\n			</div>\r\n\r\n			<!-- s: unit list area -->\r\n			<div class="unitWrap" style="min-height:550px;" ng-if="dispNoParam != \'5397045\' && productList.length" ng-class="{gucciproduct: gucciproduct}">\r\n				<!-- 상품리스트 유형 선택 -->\r\n				<div>\r\n					<div class="unit_type" >\r\n				  	    <!--<p class="unit_tlt">전체<em> {{maxitemData}}</em>개<p>-->\r\n				  	    <!--20170309-->\r\n				  	    <p class="unit_tlt" ng-class="{sub:firstcate_flag}"><b>{{cate_first}}</b><em> ({{cate_count}})</em><p>\r\n						<ul>\r\n							<li class="r1"><a href="#" ng-class="{on:templateType==\'list\'}" ng-click="changeTemplate(\'list\')">리스트형</a></li>\r\n							<li class="r2"><a href="#" ng-class="{on:templateType==\'image\'}" ng-click="changeTemplate(\'image\')">이미지형</a></li>\r\n							<li class="r3"><a href="#" ng-class="{on:templateType==\'swipe\'}" ng-click="changeTemplate(\'swipe\')">스와이프형</a></li>\r\n						</ul>\r\n					</div>\r\n				</div>\r\n				<!-- //상품리스트 유형 선택 -->\r\n				<!-- 처리전까지 임시 -->\r\n				<div ng-controller="productCtrl" ng-if="templateType == \'list\' && isProductLoading == true">\r\n					<div ng-show="dataLoadingFinish" product-container template-type="list" total-count="maxitemData" templatetype="templateType" products="productList"  more-product-continer="getProductDataLoad()"></div>\r\n				</div>\r\n				<div ng-controller="productCtrl" ng-if="templateType == \'image\' && isProductLoading == true">\r\n					<div ng-show="dataLoadingFinish" product-container template-type="image" total-count="maxitemData" templatetype="templateType" products="productList"  more-product-continer="getProductDataLoad()"></div>\r\n				</div>\r\n				<div ng-controller="productCtrl" ng-if="templateType == \'swipe\' && isProductLoading == true">\r\n					<div ng-show="dataLoadingFinish" product-container template-type="swipe" total-count="maxitemData" templatetype="templateType" products="productList"  more-product-continer="getProductDataLoad()" swipe-move="swipefnc()"></div>\r\n				</div>\r\n			</div>\r\n\r\n			<!-- 댓글 -->\r\n			<comment-Module ng-if="comment == \'Y\' && commentType == \'01\'"></comment-Module>\r\n			<!-- //댓글 -->\r\n		</div>\r\n		<!-- e: 기획전 상세 -->\r\n\r\n        <!--20160503 지난컨텐츠 더보기-->\r\n        <section ng-if="prv_banner_list" class="storyShop_prvList">\r\n            <h2>인기 스토리</h2>\r\n            <ul>\r\n                <li ng-repeat="item in prv_banner_list.items">\r\n                     <a ng-click="storyLink(item, \'m_DC_PlanShop_Clk_Story_Ban_idx\', $index + 1)">\r\n                        <div class="storyPrvBox" >\r\n                            <div class="imgBox">\r\n                                <img ng-src="{{item.img_url}}" alt="{{item.banner_nm}}" />\r\n                            </div>\r\n                            <div class="info">\r\n                                <p class="banTitle" ng-bind-html="brReplace(item.banner_nm)"></p>\r\n                                <p class="banCate">{{item.category_nm}}</p>\r\n                            </div>\r\n                        </div>\r\n\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </section>\r\n	</div>\r\n	<!-- //container -->\r\n	<div ng-if="noData" >\r\n		<p class="noData"> 등록된 기획전이 없습니다.</p>\r\n	</div>\r\n	<div class="listLoading" ng-if="isLoading" style="height:300px">\r\n		<p class="noData"><p class="loading half"></p>\r\n	</div>\r\n	<div class="listLoading" ng-if="productListLoading && !isLoading && templateType != \'swipe\'">\r\n		<p class="loading half"></p>\r\n	</div>\r\n\r\n    <!--20160516 제휴팝업	-->\r\n    <div id="event0516" style="position:fixed;top:0;width:100%;height:100%;text-align:center;z-index:1000" ng-if="event0516Flag">\r\n        <div style="background:#000;opacity:0.5;width:100%;height:100%"></div>\r\n        <div style="display:block;position:absolute;top:30%;width:100%">\r\n            <!--앱으로 Go-->\r\n            <a ng-click="goToApp()" style="display:block;width:100%"><img src="http://image.lotte.com/lotte/mo2015/angular/detail/popBann_20160516.png" style="width:293px"></a>\r\n            <!--닫기-->\r\n            <a href="javascript:$(\'#event0516\').hide()" style="display:block;width:100%"><img src="http://image.lotte.com/lotte/mo2015/angular/detail/popBann_close_20160512.png" style="width:45px"></a>\r\n        </div>\r\n    </div>\r\n\r\n    <!--20161121 둥둥이배너 chasu : 1 ~ 3 -->\r\n    <div ng-if="dispNoParam == \'5405246\'">\r\n        <dungdung id="ddpop" start="201702171000" end="201702180000"></dungdung>\r\n    </div>\r\n\r\n</section>\r\n'),a.put("/lotte/resources_dev/product/m/product_list_select_container2.html",'<section class="allProductFlag">\r\n    <!-- 전체보기 열렸을때(class \'on\'추가) -->\r\n    <div class="prdAllView" ng-class="{on:allProductOpenFlag}" >\r\n        <!--버튼-->\r\n        <div class="btnWrap"  ng-click="allProductClick()" >\r\n            <span class="btnArea">\r\n                <a class="btn_prdView"><span id="curcatenm">{{divName}}</span><span class="btnIcon"></span></a>\r\n            </span>\r\n        </div>\r\n\r\n	<!-- 스크롤 20170309 -->\r\n        <div ng-show="allProductOpenFlag" ng-class="{true: \'prdAllViewList on\', false: \'prdAllViewList\'}[allProductOpenFlag]">\r\n            <div class="list scrolltype">\r\n                <ul>\r\n                    <li ng-repeat="items in itemCateDataList">\r\n                		<a ng-click="sortCateClick(items.divObjNo, items.divObjNm, $index)" ng-class="{on : items.divObjNo == divObjNoParam}">\r\n                            <div class="txt">{{items.divObjNm}}</div>\r\n                            <span class="num" ng-if="items.divObjNo != \'\'">({{items.goodsCnt}})</span></a>\r\n                    </li>\r\n				</ul>\r\n			</div>\r\n        </div>\r\n        <!-- //스크롤 -->\r\n    </div>\r\n</section>'),a.put("/lotte/resources_dev/product/m/product_list_comment.html",'<div class="commentArea">\r\n	<div class="commentForm">\r\n		<fieldset>\r\n			<legend>댓글등록</legend>\r\n			<label ng-if="commentData.bbc_reg_gd_desc != \'\' || commentData.bbc_reg_gd_desc != undefined" ng-bind-html="commentData.bbc_reg_gd_desc" class="label" for="formPlanComment"></label>\r\n			<label ng-if="commentData.bbc_reg_gd_desc == \'\' || commentData.bbc_reg_gd_desc == undefined" class="label" for="formPlanComment">이 기획전에 대한 여러분의 의견을 나눠 보세요</label>\r\n			<div class="reg">\r\n				<textarea class="textarea" id="commentTxt" ng-trim ng-click="registerCheck()" ng-model="input.commentTxt" onchange="maxLengthCheck(\'200\', null, this, commentTxt)" onkeyup="maxLengthCheck(\'200\', null, this)" placeholder="※ 덧글은 최대 200bytes까지 작성가능">\r\n				{{input.commentTxt}}\r\n				</textarea>\r\n				<a class="btn" ng-click="newRegister()">등록하기</a>\r\n			</div>\r\n		</fieldset>\r\n	</div>\r\n	<div class="accordionWrap comment_list">\r\n		<ul>\r\n			<li ng-repeat="item in commentListData" ng-class="{on:commentListIndex == $index}">\r\n			    <!-- 아코디언 리스트 타이틀 -->\r\n			    <div class="accordionCnt">\r\n		    		<p class="cont" ng-click="commentListClick($index)">{{item.cont}}</p>\r\n		    		<div class="etc">\r\n		    			<p class="date"><strong>작성일</strong>{{item.wr_date}}</p>\r\n		    			<p class="name"><strong>작성자</strong> <span>{{idChange(item.mbr_id)}}</span></p>\r\n		    		</div>\r\n		    		<div class="btn">\r\n		    			<a ng-if="item.mbr_id == item.login_id" ng-click="deleteComment(item.bbc_no,$index)" class="del">삭제</a>\r\n		    			<a ng-click="commentListClick($index)" class="close">닫기</a>\r\n		    		</div>\r\n			    </div>\r\n			</li>\r\n		</ul>\r\n		<div>\r\n	        <a ng-if="commentData.page_now != commentData.page_total" ng-show="commentData.total_cnt != null" ng-click="getCommentListPaging(commentData.page_now,\'\',\'\')" class="btn_more"><span class="ic"></span><em>더보기&nbsp;</em>({{commentData.page_cur_row_cnt}}/{{commentData.total_cnt}})</a>\r\n	    </div>\r\n	</div>\r\n	<div class="secretCommentsPop" ng-if="agrCommentsPop">\r\n		<div class="commentsPopCont">\r\n			<img src="http://image.lotte.com/lotte/images/mobile/commentsPopBg.png" alt="응모하시기 전아래사항을 확인해주세요. 본 이벤트에 참여하며, 아래 사항에 동의합니다.">\r\n			<p class="text_cont" ng-bind-html="pop_txt_cont"></p>\r\n			<a ng-click="commentsPopClose()" class="disAgreeBtn">동의하지 않습니다.</a>\r\n			<a ng-click="register()" class="agreeBtn">동의합니다.</a>\r\n		</div>\r\n	</div>\r\n</div>\r\n')}]);