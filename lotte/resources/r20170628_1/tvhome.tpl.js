angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/main/tvhome_container.html",'<section id="container" ng-show="contVisible" class="cont_minheight">\n	<!-- TV쇼핑 -->\n	<section id="main_shopping">\n		<!-- slide Banner -->\n		<div class="wrapBox" ng-controller="lotteNgSwipeCtrl">\n			<div class="main_slide">\n				<button class="btn prev" ng-click="beforeSlide()" ng-show="swipeIdx > 0">Preview</button>\n				<div class="mask">\n					<ul class="list" lotte-ng-list-swipe \n						swipe-id="tv_home_banner_list" \n						swipe-list-model="screenData.tv_home_banner_list"\n						swipe-autoheight="true" \n						swipe-responsive="true" \n						swipe-responsive640="2" \n						swipe-responsive900="2" \n						swipe-slide-item="true" \n						swipe-max-ratio="0.2" \n						swipe-min-distance="40">\n						<li ng-repeat="item in screenData.tv_home_banner_list"><a href="#" ng-click="tvHomeBannerClick(item)"><img src="{{item.img_path_nm}}" alt="golden week" /></a></li>\n					</ul>\n				</div>\n				<button class="btn next" ng-click="nextSlide()" ng-show="swipeBulletIdx<=(swipeBullet.length-2)">Next</button>\n				<ol class="bullet">\n					<li ng-repeat="item in swipeBullet" ng-class="{active:$index==swipeBulletIdx}" >{{$index}}</li>\n				</ol>\n			</div>\n		</div>\n		<!-- //slide Banner -->\n		<div class="home_shopping_wrap">\n			<ul class="ul_homeshop">\n				<!-- 편성표 -->\n				<li ng-class="{on:pageOptions.homeTabFlag==1}"><!-- D;20151001현재탭 클래스on -->\n					<a href="#" ng-click="tvHomeTabClick(1)"><div>편성표</div></a>\n					<div class="area_homeshop_2" >\n						<div class="box_homeshop_1">\n							<div class="tvDate">\n								<ul class="clearfix" lotte-ng-list-swipe swipe-slide-menu="true" swipe-list-model="screenData.tv_home_calendar" swipe-id="tv_home_calendar" swipe-max-ratio="0.2" swipe-min-distance="40">\n									<li ng-repeat="citem in screenData.tv_home_calendar" ng-class="{today:citem.today_yn,on:pageOptions.calendarIdx == $index && !citem.today_yn}">\n										<a href="#" ng-click="programChangeDate(citem,$index)">\n											<span>{{citem.day}}</span>\n											<span>{{citem.dday}}요일</span>\n										</a>\n									</li>\n								</ul>\n								<a href="#none" class="tvPrev">이전</a>\n								<a href="#none" class="tvNext">다음</a>\n							</div>\n							<div class="selectArea">\n								<span class="count">전체 {{screenData.totalProducts}}개</span>\n								<select title="상품" ng-model="pageOptions.selected_disp_no" ng-change="changeProductList()">\n									<option value="0">전체</option>\n							   		<option value="5080601">화장품/잡화</option>\n							   		<option value="5080602">의류/스포츠</option>\n							   		<option value="5080603">유아/생활/식품</option>\n							   		<option value="5080604">가전/디지털</option>\n							   		<option value="5447474">보험/금융</option>\n								</select>\n								<div class="img_box"></div>\n							</div>\n						</div>\n						<!-- 상품 리스트 -->\n						<div class="box_homeshop_2" id="tv_list">\n							<dl class="lastBroad" ng-show="pageOptions.hasPrevious && (pageOptions.selected_date == \'\' || pageOptions.selected_date == pageOptions.today)">\n								<dt ng-class="{opened:pageOptions.showBeforeTvHome}"><a href="#none" ng-click="showBeforeTvHome()">이전 방송상품 보기</a></dt><!-- D:20151001 dd 열렸을때 클래스opened 추가 -->\n								<dd ng-show="pageOptions.showBeforeTvHome">\n									<!-- 지난방송 -->\n									<div class="box_homeshop_3" ng-repeat="preitem in screenData.tv_home_program_list|filter:{previous:true}">\n										<div class="box_homeshop_3_1 clearfix">\n											<p class="txt_homeshop_2">{{preitem.air_time}} <span>{{preitem.program_nm}}</span></p><!-- D:20151001 span 수정 -->\n										</div>\n										<ol class="prod_list_01">\n											<li ng-repeat="proditem in preitem.prod_list.items">\n												<!-- 일반상품 : 리스트형 -->\n												<div class="unit_list_01">\n													<a href="#" ng-click="productInfoClick(proditem)">\n														<div class="thumb">\n															<img ng-src="{{proditem.img_url}}" alt="{{proditem.goods_nm}}">\n														</div>\n														<div class="info">\n															<span class="tit">{{proditem.goods_nm}}</span>\n															<p class="pr_box">\n																<span class="price"><em>{{proditem.sale_prc | number}}</em>원</span>\n																<span class="price2" ng-show="proditem.org_sale_prc != proditem.sale_prc"><em>{{proditem.org_sale_prc | number}}</em>원</span>\n															</p>\n															<p class="coupon">\n																<em class="no" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">{{proditem.sale_rate}}</em><em class="po" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">%</em>\n																<span ng-show="proditem.inst_cpn_no!=0">쿠폰포함</span>\n															</p>\n														</div>\n													</a>\n												</div>\n												<!-- //일반상품 : 리스트형 -->\n											</li>\n										</ol>\n									</div>\n								</dd>\n							</dl>\n							<div ng-show="screenData.tv_home_onair.live && pageOptions.selected_date == pageOptions.today">\n								<!-- 생방송 -->\n								<p class="txt_homeshop_12"><strong>On-Air</strong> 방송종료까지 <span id="counter_imall"><timer end-time="screenData.onAirCountdown" interval="1000">{{hhours}}:{{mminutes}}:{{sseconds}}</timer></span> 남았습니다.<span class="broadCate">{{screenData.tv_home_onair.bdct_pgm_nm}}</span></p>\n								<div id="rest_time_imall" style="display:none">4030000</div>			\n								<div class="box_homeshop_3 on">\n									<ol class="prod_list_01">\n										<li ng-repeat="proditem in screenData.tv_home_onair.prod_list.items">\n											<!-- 일반상품 : 리스트형 -->\n											<div class="unit_list_01">\n												<a href="#" ng-click="productInfoClick(proditem)">\n													<div class="thumb">\n														<img ng-src="{{proditem.img_url}}" alt="{{proditem.goods_nm}}">\n													</div>\n													<div class="info">\n														<span class="tit">{{proditem.goods_nm}}</span>\n														<p class="pr_box">\n															<span class="price"><em>{{proditem.sale_prc | number}}</em>원</span>\n															<span class="price2" ng-show="proditem.org_sale_prc != proditem.sale_prc"><em>{{proditem.org_sale_prc | number}}</em>원</span>\n														</p>\n														<p class="coupon">\n															<em class="no" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">{{proditem.sale_rate}}</em><em class="po" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">%</em>\n															<span ng-show="proditem.inst_cpn_no!=0">쿠폰포함</span>\n														</p>\n													</div>\n												</a>\n											</div>\n											<!-- //일반상품 : 리스트형 -->\n										</li>\n									</ol>\n								</div>\n								<!-- //생방송 -->\n							</div>\n							\n							<div ng-show="!screenData.tv_home_onair.live && screenData.tv_home_onair.prod_list.items.length && pageOptions.selected_date == pageOptions.today">\n								<p class="txt_homeshop_13"><strong>HIT 상품</strong></p>\n								<div class="box_homeshop_3 hit">\n									<ol class="prod_list_01">\n										<li ng-repeat="proditem in screenData.tv_home_onair.prod_list.items">\n											<!-- 일반상품 : 리스트형 -->\n											<div class="unit_list_01">\n												<a href="#" ng-click="productInfoClick(proditem)">\n													<div class="thumb">\n														<img ng-src="{{proditem.img_url}}" alt="{{proditem.goods_nm}}">\n													</div>\n													<div class="info">\n														<span class="tit">{{proditem.goods_nm}}</span>\n														<p class="pr_box">\n															<span class="price"><em>{{proditem.sale_prc | number}}</em>원</span>\n															<span class="price2" ng-show="proditem.org_sale_prc != proditem.sale_prc"><em>{{proditem.org_sale_prc | number}}</em>원</span>\n														</p>\n														<p class="coupon">\n															<em class="no" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">{{proditem.sale_rate}}</em><em class="po" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">%</em>\n															<span ng-show="proditem.inst_cpn_no!=0">쿠폰포함</span>\n														</p>\n													</div>\n												</a>\n											</div>\n											<!-- //일반상품 : 리스트형 -->\n										</li>\n									</ol>\n								</div>\n							</div>\n							\n							\n							<!-- 오늘 예정된방송 -->\n							<div ng-if="pageOptions.selected_date == pageOptions.today">\n								<div class="box_homeshop_3" ng-repeat="pitem in screenData.tv_home_program_list|filter:{previous:false,onair_yn:false}">\n									<div class="box_homeshop_3_1 clearfix">\n										<p class="txt_homeshop_2">{{pitem.air_time}} <span>{{pitem.program_nm}}</span></p>\n									</div>\n									<ol class="prod_list_01">\n										<li ng-repeat="proditem in pitem.prod_list.items">\n											<!-- 일반상품 : 리스트형 -->\n											<div class="unit_list_01">\n												<a href="#" ng-click="productInfoClick(proditem)">\n													<div class="thumb">\n														<img ng-src="{{proditem.img_url}}" alt="{{proditem.goods_nm}}">\n													</div>\n													<div class="info">\n														<span class="tit">{{proditem.goods_nm}}</span>\n														<p class="pr_box">\n															<span class="price"><em>{{proditem.sale_prc | number}}</em>원</span>\n															<span class="price2" ng-show="proditem.org_sale_prc != proditem.sale_prc"><em>{{proditem.org_sale_prc | number}}</em>원</span>\n														</p>\n														<p class="coupon">\n															<em class="no" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">{{proditem.sale_rate}}</em><em class="po" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">%</em>\n															<span ng-show="proditem.inst_cpn_no!=0">쿠폰포함</span>\n														</p>\n													</div>\n												</a>\n											</div>\n											<!-- //일반상품 : 리스트형 -->\n										</li>\n									</ol>\n								</div>\n							</div>\n							\n							<!-- 오늘이 아닌 방송 편성표 -->\n							<div ng-if="pageOptions.selected_date != pageOptions.today">\n								<div class="box_homeshop_3" ng-repeat="pitem in screenData.tv_home_program_list">\n									<div class="box_homeshop_3_1 clearfix">\n										<p class="txt_homeshop_2">{{pitem.air_time}} <span>{{pitem.program_nm}}</span></p>\n									</div>\n									<ol class="prod_list_01">\n										<li ng-repeat="proditem in pitem.prod_list.items">\n											<!-- 일반상품 : 리스트형 -->\n											<div class="unit_list_01">\n												<a href="#" ng-click="productInfoClick(proditem)">\n													<div class="thumb">\n														<img ng-src="{{proditem.img_url}}" alt="{{proditem.goods_nm}}">\n													</div>\n													<div class="info">\n														<span class="tit">{{proditem.goods_nm}}</span>\n														<p class="pr_box">\n															<span class="price"><em>{{proditem.sale_prc | number}}</em>원</span>\n															<span class="price2" ng-show="proditem.org_sale_prc != proditem.sale_prc"><em>{{proditem.org_sale_prc | number}}</em>원</span>\n														</p>\n														<p class="coupon">\n															<em class="no" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">{{proditem.sale_rate}}</em><em class="po" ng-show="proditem.org_sale_prc != proditem.sale_prc && proditem.sale_rate != 0">%</em>\n															<span ng-show="proditem.inst_cpn_no!=0">쿠폰포함</span>\n														</p>\n													</div>\n												</a>\n											</div>\n											<!-- //일반상품 : 리스트형 -->\n										</li>\n									</ol>\n								</div>\n							</div>\n							\n						</div>		          \n						<!-- 상품 리스트 끝-->\n					</div>\n					<!-- 상품리스트 -->\n				</li>\n				<!-- //편성표 -->\n				<!-- 방송인기상품 -->\n				<li ng-class="{on:pageOptions.homeTabFlag==2}">\n					<a href="#" ng-click="tvHomeTabClick(2);"><div>방송인기상품</div></a>\n					<div class="area_homeshop_2 area_homeshop_2_1"  ng-show="pageOptions.homeTabFlag==2">\n						<!-- 상품리스트 -->\n						<div class="box_homeshop_2" id="iMallBestProduct">\n							<div class="box_homeshop_3">\n								<div product-container template-type="imagerank" templatetype="templateType" products="screenData.tv_home_best_prod_list"></div>\n							</div>\n							<!-- //베스트 상품 -->\n							</div>\n						</div>\n					<!-- 상품리스트 -->\n				</li>\n				<!-- //방송인기상품 -->\n			</ul>\n		</div>\n	</section>\n	<!-- //TV쇼핑 -->\n</section>')}]);