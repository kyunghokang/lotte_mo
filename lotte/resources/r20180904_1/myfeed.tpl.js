angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/myfeed/myfeed_container.html",'<section ng-show="contVisible" class="cont_minheight myfeed" id="container">\r\n\r\n	<!-- 로그인 / 제목 영역 -->\r\n	<div ng-if="!loginInfo.isLogin" class="user_wrap">\r\n		<div class="title_area">로그인하시면, 추천이 정확해져요!</div>\r\n		<a class="btn_login" ng-click="goLoginClick()"><span>로그인하기</span></a>\r\n	</div>\r\n	\r\n	<!-- 최근 본 상품 관련 -->\r\n	<div ng-if="recently.items && recently.items.length > 0" class="recently_total" ng-class="{noRecom: ( !recentlyRecom.items || recentlyRecom.items.length <= 2 ) && ( !recentlyPlan.items || recentlyPlan.items.length == 0 )}">\r\n		<!-- 최근 본 상품 -->\r\n		<div class="recently_wrap" ng-if="recently.hasLately == \'Y\'">\r\n			<div class="title_wrap">\r\n				<span class="sub_title">{{recently.txt}}</span>\r\n				<span ng-if="recently.items.length > 1" class="count"><em>{{swipeCurIdx+1}}</em>/{{recently.items.length}}</span>\r\n			</div>\r\n			<div ng-if="recently.items.length > 1" class="swipe_wrap" id="recentlySwipe" roll-swipe-banner \r\n			 rolling="true" width320="1" width640="1" width900="1"\r\n			 info="recently.items" endfnc="swipeComplete">\r\n				<ul class="swipeBox">\r\n					<li ng-repeat="item in recently.items track by $index" class="item{{$index}}" ng-init="pindex = $index">\r\n						<div>\r\n							<a class="item" ng-repeat="items in item track by $index" ng-click="goProductView(items.goodsNo, \'RctView_Clk_Prd_\' + arrAlpha[pindex] + addZero($index+1), \'52\')">\r\n								<div class="imageCon">\r\n									<img ng-src="{{items.imgUrl}}" alt="{{items.goodsNm}}" />\r\n								</div>\r\n							</a>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<div ng-if="recently.items.length == 1" class="swipe_wrap one">\r\n				<ul>\r\n					<li class="item0">\r\n						<div>\r\n							<a class="item" ng-repeat="items in recently.items[0] track by $index" ng-click="goProductView(items.goodsNo, \'RctView_Clk_Prd_A\' + addZero($index+1))">\r\n								<div class="imageCon">\r\n									<img ng-src="{{items.imgUrl}}" alt="{{items.goodsNm}}" />\r\n								</div>\r\n							</a>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		<!-- 최근 본 상품 기반 추천 상품 -->\r\n		<div ng-if="recentlyRecom.items && recentlyRecom.items.length > 2" class="recently_recom">\r\n			<span class="title">{{recentlyRecom.txt}}</span>\r\n			<ul>\r\n				<li ng-repeat="item in recentlyRecom.slice[recentlyRecomIdx] track by $index">\r\n					<a href="#" ng-click="goProductView(item.goodsNo, \'RctView_Clk_Rel_\' + arrAlpha[swipeCurIdx] + addZero($index+1), \'52\', \'M_detail_myreco\')">\r\n						<div class="imageCon">\r\n							<img ng-src="{{item.imgUrl}}" alt="{{item.goodsNm}}"/>\r\n						</div>\r\n						<div class="text_area">\r\n							<span class="name">{{item.goodsNm}}</span>\r\n							<span class="price"><em>{{item.price | number}}</em>원<span ng-if="item.isPlanPrd">~</span></span>\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n			<div ng-if="recentlyRecom.items.length > 6" class="more_wrap">\r\n				<a ng-click="recentlyRecomMore()" class="btn_more">다른 추천 상품 볼래요</a>\r\n			</div>\r\n		</div>\r\n		<!-- 최근 본 상품 기반 추천 기획전 -->\r\n		<div ng-if="recentlyPlan.items && recentlyPlan.items.length > 0" class="recently_plan">\r\n			<span class="title">{{recentlyPlan.txt}}</span>\r\n			<div lotte-slider class="swipe_wrap">\r\n				<ul class="prd_unit_type01_line">\r\n					<li ng-repeat="item in recentlyPlan.items" ng-if="$index < 6">\r\n						<a href="#" ng-click="goPlanView(item.linkUrl, $index, \'M_plan_detail_myreco\')">\r\n							<div class="imageCon">\r\n								<img ng-src="{{item.goodsImgUrl}}" alt="{{item.btmTxt}}" />\r\n							</div>\r\n							<div class="titleCon">\r\n								<div class="name">{{item.btmTxt}}</div>\r\n							</div>\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 최근 구매/장바구니 담은 상품 + 보완재 -->\r\n	<div class="order_wrap" ng-if="orderRecom && orderRecom.prdList && orderRecom.prdList.items && orderRecom.prdList.items.length > 0 && orderRecom.hasSub">\r\n		<div class="title_wrap">\r\n			<span class="sub_title">{{orderRecom.txt}}</span>\r\n		</div>\r\n		<div class="cont_wrap">\r\n			<ul>\r\n				<li ng-repeat="item in orderRecom.prdList.items" ng-if="orderRecom.prdList.items[$index].subItem && orderRecom.prdList.items[$index].subItem.length > 2" ng-init="pindex = $index">\r\n					<a class="subject" href="#" ng-click="goProductView(item.goodsNo, \'RelCodi_Clk_Prd_\' + arrAlpha[$index] + \'01\', \'53\')">\r\n						<div class="imageCon">\r\n							<img ng-src="{{item.imgUrl}}" alt="{{item.goodsNm}}" />\r\n						</div>\r\n						<div class="titleCon">\r\n							<div class="name">{{item.goodsNm}}</div>\r\n							<span class="price"><em>{{item.price | number}}</em>원<span ng-if="item.isPlanPrd">~</span></span>\r\n						</div>\r\n					</a>\r\n					<div  lotte-slider class="swipe_wrap">\r\n						<ul class="prd_unit_type01_line">\r\n							<li ng-repeat="items in item.subItem">\r\n								<a href="#" ng-click="goProductView(items.goodsNo, \'RelCodi_Swp_Rel_\' + arrAlpha[pindex] + addZero($index+1), \'53\', \'M_detail_cross_myreco\')">\r\n									<div class="imageCon">\r\n										<img ng-src="{{items.imgUrl}}" alt="{{items.goodsNm}}" />\r\n									</div>\r\n									<div class="titleCon">\r\n										<div class="name">{{items.goodsNm}}</div>\r\n										<span class="price"><em>{{items.price | number}}</em>원<span ng-if="item.isPlanPrd">~</span></span>\r\n									</div>\r\n								</a>\r\n							</li>\r\n						</ul>\r\n					</div>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n\r\n	<!-- 카드 구매 사은 안내 -->\r\n	<div ng-if="cardList && cardList.length > 0" class="card_wrap">\r\n		<div ng-if="cardList.length > 1" class="swipe_wrap card_area" id="cardSwipe" roll-swipe-banner \r\n			rolling="true" width320="1" width640="1" width900="1"\r\n			info="cardList" endfnc="cardSwipeComplete">\r\n			   <ul class="swipeBox">\r\n				   <li ng-repeat="item in cardList track by $index">\r\n					<a ng-if="item.evt_no" href="#" ng-click="goCardEvent(item.evt_no, item.idx)" ng-style="{background:item.color}">\r\n						<p><span class="highlight"><em>{{item.evt_crcm_nm}} {{item.min_fvr_polc_strt_val | number}}원</em></span> 이상 결제시</p>\r\n						<p><em>{{item.free_gift_nm}}</em> 최대 <span class="highlight"><em>{{item.max_pay_pnt | number}}</em></span>점 적립</p>\r\n						<span class="timer">남은시간 <em>{{item.remain_time}}</em></span>\r\n					</a>	\r\n					<a ng-if="!item.evt_no" href="#" ng-click="goMain(\'5570119\', \'card\', \'Event_Swp_Ban\', item.idx)" ng-style="{background:item.color}">\r\n						<p><span class="highlight">\r\n							<em ng-if="!item.multi">{{item.evt_crcm_nm}} {{item.aply_lmt_amt | number}}원</em>\r\n							<em ng-if="item.multi">{{item.evt_crcm_nm}} {{item.aply_lmt_amt}}</em>\r\n						</span> 이상 결제시</p>\r\n						<p>최대 <span class="highlight"><em>{{item.fvr_val}}%</em></span> 청구할인</p>\r\n						<span class="timer">남은시간 <em>{{item.remain_time}}</em></span>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n		\r\n		<ul class="indicator" ng-if="cardList && cardList.length > 1" >\r\n			<li ng-repeat="item in cardList track by $index"><span>{{$index}}</span></li>\r\n		</ul>\r\n			\r\n		<div ng-if="cardList.length == 1" class="card_area one">\r\n			<ul>\r\n				<li>\r\n				<a ng-if="cardList[0].evt_no" href="#" ng-click="goCardEvent(cardList[0].evt_no, cardList[0].idx)" ng-style="{background:cardList[0].color}">\r\n					<p><span class="highlight"><em>{{cardList[0].evt_crcm_nm}} {{cardList[0].min_fvr_polc_strt_val | number}}원</em></span> 이상 결제시</p>\r\n					<p><em>{{cardList[0].free_gift_nm}}</em> 최대 <span class="highlight"><em>{{cardList[0].max_pay_pnt | number}}</em></span>점 적립</p>\r\n					<span class="timer">남은시간 <em>{{cardList[0].remain_time}}</em></span>\r\n				</a>	\r\n				<a ng-if="!cardList[0].evt_no" href="#" ng-click="goMain(\'5570119\', \'card\', \'Event_Swp_Ban\', cardList[0].idx)" ng-style="{background:cardList[0].color}">\r\n					<p><span class="highlight">\r\n						<em ng-if="!cardList[0].multi">{{cardList[0].evt_crcm_nm}} {{cardList[0].aply_lmt_amt | number}}원</em>\r\n						<em ng-if="cardList[0].multi">{{cardList[0].evt_crcm_nm}} {{cardList[0].aply_lmt_amt}}</em>\r\n					</span> 이상 결제시</p>\r\n					<p>최대 <span class="highlight"><em>{{cardList[0].fvr_val}}%</em></span> 청구할인</p>\r\n					<span class="timer">남은시간 <em>{{cardList[0].remain_time}}</em></span>\r\n				</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 재입고 품절임박 담은 상품 할인 -->\r\n	<div class="push_wrap" ng-if="pushProducts && pushProducts.items && pushProducts.items.length > 0">\r\n		<div class="title_wrap">\r\n			<span class="sub_title">{{pushProducts.title}}</span>\r\n		</div>\r\n		<ol class="prod_list_01">\r\n			<li ng-repeat="item in pushProducts.items track by $index" ng-class="{outstock: item.outstock, restock: item.sum_tgt_sct_cd.indexOf(\'NTC\') != -1, discount: item.sum_tgt_sct_cd.indexOf(\'NTC\') == -1}">\r\n               <div class="unit_list_01">\r\n                   <a href="#" ng-click="goProductView(item.goods_no, \'SmartPush_Clk_Prd\' + addZero($index + 1), \'54\')">\r\n                       <div class="thumb">\r\n                           <img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}" err-src />\r\n                       </div>\r\n                       <div class="info">\r\n                           <p ng-if="item.is_dept || item.is_tvhome || item.is_himart || item.smartpick_yn==\'Y\'||item.issmart_pick" class="flag">\r\n                               <span class="flag depart" ng-show="item.flag==\'D\'||item.is_dept">롯데백화점</span>\r\n                               <span class="flag etv" ng-if="item.is_tvhome && !item.is_dept">롯데홈쇼핑</span>\r\n                               <span class="flag himart" ng-if="item.is_himart && !item.is_dept && !item.is_etv">하이마트</span>\r\n                               <span class="flag smart" ng-show="item.smartpick_yn==\'Y\'||item.issmart_pick">스마트픽</span>\r\n                           </p>\r\n                           <p class="tit">\r\n                               <span>{{item.goods_nm | delDot}}</span>\r\n						   </p>\r\n						   <p ng-if="item.sum_tgt_sct_cd.indexOf(\'NTC\') != -1" class="pr_box">\r\n								<span class="price"><em>{{item.exist_sale_prc|number}}</em>원<span ng-show="item.is_sale_promotion">~</span></span>\r\n							</p>\r\n                           <p ng-if="item.sum_tgt_sct_cd.indexOf(\'NTC\') == -1" class="pr_box">\r\n                               <span class="price"><em>{{item.dscnt_sale_prc|number}}</em>원<span ng-show="item.is_sale_promotion">~</span></span>\r\n                               <span class="price2" ng-show="item.exist_sale_prc!=item.dscnt_sale_prc && item.exist_sale_prc !=0 && !item.is_sale_promotion">\r\n                                   <em>{{item.exist_sale_prc|number}}</em>원\r\n                               </span>\r\n						   </p>\r\n                       </div>\r\n                       <p ng-if="item.sum_tgt_sct_cd.indexOf(\'NTC\') != -1" class="info_label">재입고</p>\r\n                       <p ng-if="item.sum_tgt_sct_cd.indexOf(\'NTC\') == -1" class="info_label">가격<br />인하</p>\r\n                   		<!-- <span class="info_label">품절임박</span> -->\r\n                   </a>\r\n                   <div class="info2">\r\n                       <div class="info_dsc">\r\n						   <span ng-if="item.sum_tgt_sct_cd.indexOf(\'NTC\') != -1">재입고일 : {{item.send_dt | pushDate}}</span>\r\n						   <span ng-if="item.sum_tgt_sct_cd.indexOf(\'NTC\') == -1">할인일 : {{item.send_dt | pushDate}}</span>\r\n						   <!-- <span>잔여수량 : 10개</span> -->\r\n                       </div>\r\n                   </div>\r\n               </div>\r\n			</li>\r\n		</ol>\r\n		<a ng-if="appObj.isApp && !appObj.isSuperApp" href="#" class="btn_more" ng-click="showAppConfig()"><span>재입고/할인 소식 알림 받기</span></a>\r\n	</div>\r\n	\r\n	<!-- 장바구니/위시 담은 상품 + 대체재 -->\r\n	<div class="wish_wrap" ng-if="wishes && wishes.items && wishes.items.length > 0">\r\n		<div>\r\n			<div class="title_wrap">\r\n				<span class="sub_title">{{wishes.txt}}</span>\r\n				<span ng-if="wishes.items.length > 1" class="count"><em>{{wishSwipeCurIdx+1}}</em>/{{wishes.items.length}}</span>\r\n			</div>\r\n			<!-- wishes.items 여러개 -->\r\n			<div ng-if="wishes.items.length > 1" class="swipe_wrap" id="wishesSwipe" roll-swipe-banner\r\n			 rolling="true" width320="1" width640="1" width900="1" \r\n			 info="wishes.items" endfnc="wishSwipeComplete">\r\n				<ul class="swipeBox">\r\n					<li ng-repeat="item in wishes.items track by $index" class="wish{{$index}}">\r\n						<div>\r\n						<div class="border">\r\n						<div class="unit_list_01">\r\n							<a href="#" ng-click="goProductView(item.goodsNo, \'Pick_Swp_Prd_\' + arrAlpha[$index] + \'01\', \'55\')">\r\n								<div class="thumb">\r\n									<img ng-src="{{item.imgUrl}}" alt="{{item.dispGoodsNm}}" err-src />\r\n								</div>\r\n								<div class="info">\r\n									<p ng-if="item.flag.indexOf(\'dept\') >= 0 || item.flag.indexOf(\'tvhome\') >= 0 || item.flag.indexOf(\'himart\') >= 0 || item.flag.indexOf(\'smartpick\') >= 0" class="flag">\r\n										<span class="flag depart" ng-show="item.flag.indexOf(\'dept\') >= 0">롯데백화점</span>\r\n										<span class="flag etv" ng-if="item.flag.indexOf(\'tvhome\') >= 0">롯데홈쇼핑</span>\r\n										<span class="flag himart" ng-if="item.flag.indexOf(\'himart\') >= 0">하이마트</span>\r\n										<span class="flag smart" ng-show="item.flag.indexOf(\'smartpick\') >= 0">스마트픽</span>\r\n									</p>\r\n									<p class="tit">\r\n										<span>{{item.goodsNm}}</span>\r\n									</p>\r\n									<p class="pr_box">\r\n										<span class="price"><em>{{item.price|number}}</em>원<span ng-show="item.isPlanPrd">~</span></span>\r\n										<span class="price2" ng-show="item.orgPrice!=item.price && item.orgPrice !=0 && !item.isPlanPrd">\r\n											<em>{{item.orgPrice|number}}</em>원\r\n										</span>\r\n									</p>\r\n								</div>\r\n							</a>\r\n						</div>\r\n						</div>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<!-- wishes.items 한개 -->\r\n			<div ng-if="wishes.items.length == 1" class="swipe_wrap one" ng-init="item = wishes.items[0]">\r\n			   <ul>\r\n				   <li class="wish0">\r\n					   <div>\r\n					   <div class="border">\r\n					   <div class="unit_list_01">\r\n						   <a href="#" ng-click="goProductView(item.goodsNo, \'Pick_Swp_Prd_\' + arrAlpha[0] + \'01\', \'55\')">\r\n							   <div class="thumb">\r\n								   <img ng-src="{{item.imgUrl}}" alt="{{item.dispGoodsNm}}" err-src />\r\n							   </div>\r\n							   <div class="info">\r\n								   <p ng-if="item.flag.indexOf(\'dept\') >= 0 || item.flag.indexOf(\'tvhome\') >= 0 || item.flag.indexOf(\'himart\') >= 0 || item.flag.indexOf(\'smartpick\') >= 0" class="flag">\r\n									   <span class="flag depart" ng-show="item.flag.indexOf(\'dept\') >= 0">롯데백화점</span>\r\n									   <span class="flag etv" ng-if="item.flag.indexOf(\'tvhome\') >= 0">롯데홈쇼핑</span>\r\n									   <span class="flag himart" ng-if="item.flag.indexOf(\'himart\') >= 0">하이마트</span>\r\n									   <span class="flag smart" ng-show="item.flag.indexOf(\'smartpick\') >= 0">스마트픽</span>\r\n								   </p>\r\n								   <p class="tit">\r\n									   <span>{{item.goodsNm}}</span>\r\n								   </p>\r\n								   <p class="pr_box">\r\n									   <span class="price"><em>{{item.price|number}}</em>원<span ng-show="item.isPlanPrd">~</span></span>\r\n									   <span class="price2" ng-show="item.orgPrice!=item.price && item.orgPrice !=0 && !item.isPlanPrd">\r\n										   <em>{{item.orgPrice|number}}</em>원\r\n									   </span>\r\n								   </p>\r\n							   </div>\r\n						   </a>\r\n					   </div>\r\n					   </div>\r\n					   </div>\r\n				   </li>\r\n			   </ul>\r\n		   </div>\r\n		</div>\r\n		<div ng-if="wishesRecom && wishesRecom.length > 2" class="recently_recom">\r\n			<span class="title">{{wishes.title}}</span>\r\n			<ul>\r\n				<li ng-repeat="item in wishesRecom track by $index">\r\n					<a href="#" ng-click="goProductView(item.goodsNo, \'Pick_Clk_Rel_\' + arrAlpha[wishSwipeCurIdx] + addZero($index + 1), \'55\', \'M_detail_wish_myreco\')">\r\n						<div class="imageCon">\r\n							<img ng-src="{{item.imgUrl}}" alt="{{item.goodsNm}}"/>\r\n						</div>\r\n						<div class="text_area">\r\n							<span class="name">{{item.goodsNm}}</span>\r\n							<span class="price"><em>{{item.price | number}}</em>원<span ng-if="item.isPlanPrd">~</span></span>\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 즐겨찾기 브랜드 신상품 안내 -->\r\n	<div class="favorite_wrap" ng-if="brandList && brandList.brndList && brandList.brndList.items && brandList.brndList.items.length > 0">\r\n		<div class="title_wrap">\r\n			<span class="sub_title">{{brandList.txt}}</span>\r\n		</div>\r\n		<div class="list_wrap" ng-repeat="items in brandList.brndList.items" ng-init="pindex = $index" ng-class="{top:$index == 0}">\r\n			<div class="brand">\r\n				<a class="brand_nm" href="#" ng-click="goBrandShop(items.brdNo, \'BkBrd_Clk_Brd_\' + arrAlpha[$index])"><span>#{{items.brdNm}}</span></a>\r\n				<a class="quick" href="#" ng-click="goBrandShop(items.brdNo, \'BkBrd_Clk_Brd_\' + arrAlpha[$index] + \'_more\')">더보기</a>\r\n			</div>\r\n			<ol class="prod_list_01">\r\n				<li ng-repeat="item in items.prdList.items track by $index">\r\n					<div class="unit_list_01">\r\n						<a href="#" ng-click="goProductView(item.goodsNo, \'BkBrd_Clk_Prd_\' + arrAlpha[pindex] + addZero($index + 1), \'56\')">\r\n							<div class="thumb">\r\n								<img ng-src="{{item.imgUrl}}" alt="{{item.goodsNm}}" err-src />\r\n							</div>\r\n							<div class="info">\r\n								<p ng-if="item.flag.indexOf(\'dept\') >= 0 || item.flag.indexOf(\'tvhome\') >= 0 || item.flag.indexOf(\'himart\') >= 0 || item.flag.indexOf(\'smartpick\') >= 0" class="flag">\r\n									<span class="flag depart" ng-show="item.flag.indexOf(\'dept\') >= 0">롯데백화점</span>\r\n									<span class="flag etv" ng-if="item.flag.indexOf(\'tvhome\') >= 0">롯데홈쇼핑</span>\r\n									<span class="flag himart" ng-if="item.flag.indexOf(\'himart\') >= 0">하이마트</span>\r\n									<span class="flag smart" ng-show="item.flag.indexOf(\'smartpick\') >= 0">스마트픽</span>\r\n								</p>\r\n								<p class="tit">\r\n									<span>{{item.goodsNm}}</span>\r\n								</p>\r\n								<p class="pr_box">\r\n									<span class="price"><em>{{item.price|number}}</em>원<span ng-show="item.isPlanPrd">~</span></span>\r\n									<span class="price2" ng-show="item.orgPrice!=item.price && item.orgPrice !=0 && !item.isPlanPrd">\r\n										<em>{{item.orgPrice|number}}</em>원\r\n									</span>\r\n								</p>\r\n							</div>\r\n							<!-- 별점/상품평 -->\r\n	                        <div class="user_feedback">\r\n	                            <span class="score" ng-if="item.gdasCnt > 0 && item.gdasStfdVal > 0">\r\n	                                <span class="starScoreWrap"><span class="starScoreCnt" style="width:{{ ((item.gdasStfdVal*2)|ceil)*10 }}%"></span></span>\r\n	                                <span class="review"><em>({{item.gdasCnt|number}})</em></span>\r\n	                            </span>\r\n	                        </div>\r\n	                        <!-- //별점/상품평 -->\r\n						</a>\r\n					</div>\r\n				</li>\r\n			</ol>\r\n		</div>\r\n		<a ng-if="isAvailApp" xxx-ng-if="!(appObj.isApp && appObj.isIOS)" href="#" class="btn_more" ng-click="goMain(\'5570111\', \'brand\', \'BkBrd_Clk_Btn01\')"><span>즐겨찾는 브랜드 더보기 ></span></a>\r\n	</div>\r\n	\r\n	<!-- 추천 브랜드 + 베스트 상품 -->\r\n	<div class="brand_wrap" ng-if="brandRecom && brandRecom.prdList && brandRecom.prdList.items && brandRecom.prdList.items.length > 0">\r\n		<div class="title_wrap">\r\n			<span ng-if="!brandRecom.user" class="sub_title">{{brandRecom.topTxt}}</span>\r\n			<span ng-if="brandRecom.user" class="sub_title">{{brandRecom.prefix}}<em>{{brandRecom.user}}</em>{{brandRecom.subtitle}}</span>\r\n		</div>\r\n		<div class="list_wrap">\r\n			<ul>\r\n				<li ng-repeat="item in brandRecom.prdList.items track by $index" ng-if="$index < 3" class="posx0 item" ng-init="pindex = $index">\r\n					<div class="fixed">\r\n						<a class="imageCon" href="#" ng-click="brandClick(item.linkUrl, \'BrdReco_Clk_Brd_\' + arrAlpha[$index])">\r\n							<img ng-src="{{item.imgUrl}}"/>\r\n						</a>\r\n						<div class="titleCon">\r\n							<div class="name">{{item.brdNm}}</div>\r\n						</div>\r\n						<span class="icon" ng-click="brandBookMark(item.brdNo, item.brdNm, $event, $index)"></span>\r\n					</div>\r\n					<div lotte-slider class="swipe_wrap">\r\n						<ul class="prd_unit_type01_line">\r\n							<li ng-repeat="items in item.subItem track by $index">\r\n								<a href="#" ng-click="goProductView(items.goods_no, \'BrdReco_Swp_Prd_\' + arrAlpha[pindex] + addZero($index + 1), \'57\')">\r\n									<img ng-src="{{items.img_url}}"/>\r\n									<span class="price">\r\n										<em>{{items.discounted_price | number}}</em>원<span ng-if="items.is_sale_promotion">~</span>\r\n									</span>\r\n								</a>\r\n							</li>\r\n							<li class="more">\r\n								<a ng-click="goBrandShop(item.brdNo, \'BrdReco_Swp_\' + arrAlpha[pindex] + \'_more\')">\r\n									<img src=""/>\r\n									<div class="btn">상품<br />더보기</div>\r\n								</a>\r\n							</li>\r\n						</ul>\r\n					</div>\r\n					<span class="shadow"></span>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 검색어 추천 -->\r\n	<div class="search_wrap" ng-if="searchList.data && searchList.data.goods_list_1 && searchList.data.goods_list_1.prdList && \r\n	searchList.data.goods_list_1.prdList.items && searchList.data.goods_list_1.prdList.items.length > 2">\r\n		<div class="title_wrap">\r\n			<span class="sub_title"><em>[{{searchList.keyword}}]</em> 상품 찾으셨나요?</span>\r\n		</div>\r\n		<ol class="prod_list_01">\r\n			<li ng-repeat="item in searchList.data.goods_list_1.prdList.items track by $index" ng-if="$index < 3">\r\n				<div class="unit_list_01">\r\n					<a href="#" ng-click="goProductView(item.goodsNo, \'SchReco_Clk_Prd\' + addZero($index + 1), \'58\', \'M_search_myreco\')">\r\n						<div class="thumb">\r\n							<img ng-src="{{item.imgUrl}}" alt="{{item.goodsNm}}" err-src />\r\n						</div>\r\n						<div class="info">\r\n							<p ng-if="item.flag.indexOf(\'dept\') >= 0 || item.flag.indexOf(\'tvhome\') >= 0 || item.flag.indexOf(\'himart\') >= 0 || item.flag.indexOf(\'smartpick\') >= 0" class="flag">\r\n								<span class="flag depart" ng-show="item.flag.indexOf(\'dept\') >= 0">롯데백화점</span>\r\n								<span class="flag etv" ng-if="item.flag.indexOf(\'tvhome\') >= 0">롯데홈쇼핑</span>\r\n								<span class="flag himart" ng-if="item.flag.indexOf(\'himart\') >= 0">하이마트</span>\r\n								<span class="flag smart" ng-show="item.flag.indexOf(\'smartpick\') >= 0">스마트픽</span>\r\n							</p>\r\n							<p class="tit">\r\n								<span>{{item.goodsNm}}</span>\r\n							</p>\r\n							<p class="pr_box">\r\n								<span class="price"><em>{{item.price|number}}</em>원<span ng-show="item.isPlanPrd">~</span></span>\r\n								<span class="price2" ng-show="item.orgPrice!=item.price && item.orgPrice !=0 && !item.isPlanPrd">\r\n									<em>{{item.orgPrice|number}}</em>원\r\n								</span>\r\n							</p>\r\n						</div>\r\n						<!-- 별점/상품평 -->\r\n                        <div class="user_feedback">\r\n                            <span class="score" ng-if="item.gdasCnt > 0 && item.gdasStfdVal > 0">\r\n                                <span class="starScoreWrap"><span class="starScoreCnt" style="width:{{ ((item.gdasStfdVal*2)|ceil)*10 }}%"></span></span>\r\n                                <span class="review"><em>({{item.gdasCnt|number}})</em></span>\r\n                            </span>\r\n                        </div>\r\n                        <!-- //별점/상품평 -->\r\n					</a>\r\n				</div>\r\n			</li>\r\n		</ol>\r\n	</div>\r\n	\r\n	<!-- 판매 랭킹 베스트 -->\r\n	<div class="category_wrap" ng-if="categoryList && categoryList.cate_best_list && categoryList.cate_best_list.length > 0">\r\n		<div class="title_wrap">\r\n			<span class="sub_title"><em>{{categoryList.user}}</em>{{categoryList.txt}}</span>\r\n		</div>\r\n		<div lotte-slider class="swipe_wrap">\r\n			<ul class="prd_unit_type01_line">\r\n				<li ng-repeat="item in categoryList.cate_best_list">\r\n					<a href="#" ng-click="goProductView(item.goodsNo, \'BestPrd_Swp_Prd\' + addZero($index + 1), \'59\')">\r\n						<div class="imageCon">\r\n							<img ng-src="{{item.imgUrl}}" alt="" />\r\n						</div>\r\n						<div class="titleCon">\r\n							<div class="name">{{item.goodsNm}}</div>\r\n							<span class="price"><em>{{item.price | number}}</em>원<span ng-if="item.isPlanPrd">~</span></span>\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n		<a ng-if="isAvailApp" xxx-ng-if="!appObj.isApp" href="#" ng-click="goMain(\'5572537\', \'category\', \'BestPrd_Clk_Btn01\')" class="btn_more"><span>베스트 상품 더보기 ></span></a>\r\n	</div>\r\n	\r\n	<!-- 배너 영역 -->\r\n	<div class="banner_wrap">\r\n		<a ng-click="">\r\n			<img ng-if="screenType <= 1" src="http://image.lotte.com/lotte/mo2017/myfeed/banner.jpg" alt="배너"/>\r\n			<img ng-if="screenType > 1" src="http://image.lotte.com/lotte/mo2017/myfeed/banner_big.jpg" alt="배너"/>\r\n		</a>\r\n	</div>\r\n	\r\n	<!--알림팝업-->\r\n	<div class="header_alert_pop">\r\n		<p class="msg"></p>\r\n	</div>\r\n\r\n	<loading-bar></loading-bar>\r\n</section>')}]);