angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/sns/share_box.html",'<section>\r\n	<h5 ><!-- <i></i> -->{{snsTitle}}</h5>\r\n    <ul>\r\n       <li class="kakaotalk" ng-if="talkFlag" id="kakaotalk">\r\n           <a ng-click="shareSNS(\'kakaotalk\')"><i></i>카카오톡</a>\r\n       </li>  \r\n       <li class="twitter" ng-if="twitFlag">\r\n           <a ng-click="shareSNS(\'twitter\')"><i></i>트위터</a>\r\n       </li>\r\n       <li class="kakaostory" ng-if="stotyFlag">\r\n           <a ng-click="shareSNS(\'kakaostory\')"><i></i>카카오스토리</a>\r\n       </li>            \r\n       <li class="sms" ng-if="smsFlag">\r\n           <a ng-click="shareSNS(\'sms\')"><i></i>문자</a>\r\n       </li>\r\n       <li class="facebook" ng-if="faceFlag">\r\n           <a ng-click="shareSNS(\'facebook\')"><i></i>페이스북</a>\r\n       </li>     \r\n       <li ng-if="appObj.isApp && mailFlag" class="mail">\r\n           <a ng-click="shareSNS(\'mail\')"><i></i>메일</a>\r\n       </li>\r\n       <li class="urlcopy" ng-if="urlFlag" >\r\n           <a ng-click="shareSNS(\'url_copy\')" id="copyUrl"><i></i>URL 복사</a>\r\n       </li>       \r\n     \r\n    </ul>\r\n    <div ng-if="appFlag" class="share_app">\r\n    	<a ng-click="shareSNS(\'moreapp\')"><!-- <i></i> -->다른 앱으로 공유</a>\r\n    </div>\r\n    <div class="url_copy" ng-if="!appObj.isApp && urlCopyFlag">\r\n    	<span>URL</span>\r\n    	<!-- <input type="text" id="cnShareUrl" ng-value="cnShareUrl"> -->\r\n    	<a href="{{cnShareUrl}}" onclick="return false;" class="clipUrl">{{cnShareUrl}}</a>\r\n    </div>\r\n   	<div class="btn_close" ng-show="shareBoxVisible" ng-click="hideSharePop()">\r\n       <a href="">닫기</a>\r\n	</div>\r\n	\r\n</section>\r\n'),a.put("/lotte/resources_dev/sns/share_pop.html",'<div id="sharePop" class="pop_sns" ng-show="sharePopVisible" ng-if="sharePopVisible" ng-class="{on:sharePopVisible}">\r\n	<share-box ng-show="shareBoxVisible"></share-box>\r\n	<sms-box ng-show="smsBoxVisible"></sms-box>\r\n</div>'),a.put("/lotte/resources_dev/mall/pet/pet_mall_ctg_container.html",'<section ng-if="isMain">\r\n	<style>\r\n		.ctg_list_big ul li { width:{{ ctgReSize }}px !important }\r\n	</style>\r\n	<div class="ctg_list dearpet_v4" ng-class="{fixed : menufix}" ng-if="screenData.cate_list.length">\r\n		<div class="ctg_list_big" lotte-slider>\r\n			<ul class=\'clear\'>\r\n				<li\r\n					ng-repeat="citem in screenData.cate_list"\r\n					ng-class="{big_on:screenData.selectCate1==citem.disp_no}"\r\n					ng-click="menuCateLink(citem,$index)">\r\n					<figure><img src=\'{{citem.disp_img}}\' alt=\'\'/></figure>\r\n					<span class="btn_ctg_big">\r\n						<text ng-bind-html="citem.disp_nm"></text>\r\n					</span>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n</section>\r\n'),a.put("/lotte/resources_dev/mall/pet/dearpet_main_container.html",'<section ng-show="contVisible" class="cont_minheight dearpet_v4_main">\r\n	<section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\r\n	<section>\r\n		<div class=\'sub_header_wrap\'>\r\n			<header id="head_sub" sub-header-each ng-show="subTitle" class="fixedSubHeader " ng-class="{fixedHeader: fixedHeader && subHeaderFixed && !appObj.isNativeHeader}">\r\n				<div class=\'head_sub_inner\'>\r\n					<h2><a ng-click="mallMainClick(\'m_DC_SpeDisp_Dearpet_Clk_logo\')"><span>Dear Pet</span></a></h2>\r\n					<a class=\'share\' href=\'#\' ng-click="petShare({shareImg:screenData.top_banner[0].img_url})"><span>공유</span></a>\r\n				</div>\r\n			</header>\r\n		</div>\r\n	</section>\r\n	<section ng-show="!pageLoading">\r\n		<section id="container">\r\n			<!-- 메인 탑 행사 띠배너-->\r\n\r\n			<div class="top_band_banner" ng-if="screenData.event_banner" >\r\n				<a href="#" ng-click="tob_banner_click(screenData.event_banner.img_link)">\r\n					<img ng-src="{{screenData.event_banner.img_url}}">\r\n				</a>\r\n			</div>\r\n			<!-- 스와이프 배너 (메인 배너) -->\r\n			<!-- main-slider -->\r\n			<div ng-if=\'screenData.top_banner.length\'>\r\n				<div class="main_slide" id="roll-swipe-id-1500009205687" roll-swipe-banner rolling="true" interval="3000" width320="1" width640="2" width900="2" info="screenData.top_banner" >\r\n					<ul class="list swipeBox">\r\n						<li ng-repeat="item in screenData.top_banner track by $index">\r\n							<a href="#" ng-click="BannerClick(item.img_link, \'m_DC_SpeDisp_Dearpet_Clk_Ban_0{{$index + 1}}\')">\r\n								<div class="img_wrap">\r\n									<img ng-src="{{item.img_url}}" alt="{{item.title}}">\r\n								</div>\r\n								<div class="text_wrap">\r\n									<span\r\n										class="title"\r\n										ng-bind-html="item.title"></span>\r\n									<span\r\n										class="subtitle"\r\n										ng-bind-html="item.subtitle"></span>\r\n								</div>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n					<ol class="bullet indicator" ng-if=\'screenData.top_banner.length>1\'>\r\n						<li ng-repeat="indicator in screenData.top_banner"></li>\r\n					</ol>\r\n				</div>\r\n			</div>\r\n\r\n			<!-- 카테고리 -->\r\n			<pet-mall-ctg ng-if="screenData.cate_list.length"></pet-mall-ctg>\r\n			<!-- //카테고리 -->\r\n\r\n			<!-- 등록 펫 목록 -->\r\n			<div class=\'pet_view\' ng-class=\'{bobottomBoder:screenData.recom_list.length}\'>\r\n				<!-- 등록된 데이타가 없을경우 -->\r\n				<div class=\'not_my_pet\' ng-if="!screenData.pet_list.length" ng-class=\'{tablet_bg:screenType==2}\'>\r\n					<img\r\n						ng-if=\'screenType==1\'\r\n						class=\'not_my_pet_bg_left\'\r\n						src=\'http://image.lotte.com/lotte/mo2015/angular/mall/dearpet_pet_bg_hands_left.png\' alt=\'\'/>\r\n					<img\r\n						ng-if=\'screenType==1\'\r\n						class=\'not_my_pet_bg_right\'\r\n						src=\'http://image.lotte.com/lotte/mo2015/angular/mall/dearpet_pet_bg_hands_right.png\' alt=\'\'/>\r\n					<h3>MIMI TOUTOU에 오신것을 환영합니다. </h3>\r\n					<p>우리 아이의 다양한 맞춤 서비스가 제공됩니다.</p>\r\n					<button ng-click="petFunc(\'insert\')">\r\n						<span>\r\n							<img ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/photo_bg_dog_gray.png" alt=\'\'/>\r\n						</span>\r\n						<em>아이 정보 입력</em>\r\n					</button>\r\n				</div>\r\n				<!-- 등록된 대이타가 있을경우 -->\r\n				<div class=\'my_pet_list\' ng-if="screenData.pet_list.length">\r\n					<div\r\n						roll-swipe-banner\r\n						refesh-size\r\n						width320="1"\r\n						width640="1"\r\n						width900="1"\r\n						endFnc="petSwipeEnd"\r\n						info="screenData.pet_list"\r\n						id="pet_list_swipe">\r\n						<ul	class=\'mask swipeBox\'>\r\n							<li ng-repeat=\'item in screenData.pet_list\' class=\'\'>\r\n								<div class=\'table per100\' ng-class=\'{petTabletLayout:screenType>1}\'>\r\n									<div class=\'table-cell pet_photo\' ng-click=\'petFunc("petPhoto",(item.bbs_no||item.bbc_no))\'>\r\n										<div class=\'\' ng-if=\'!item.img_url&&item.type\'>\r\n											<img ng-if="item.type==10" ng-src=\'http://image.lotte.com/lotte/mo2015/angular/mall/default_dog.png\' alt=\'\'/>\r\n											<img ng-if="item.type==20" ng-src=\'http://image.lotte.com/lotte/mo2015/angular/mall/default_cat.png\' alt=\'\'/>\r\n											<img ng-if="item.type==30" ng-src=\'http://image.lotte.com/lotte/mo2015/angular/mall/default_etc.png\' alt=\'\'/>\r\n										</div>\r\n										<figure\r\n											ng-if="item.img_url"\r\n											class=\'female\'\r\n											ng-class=\'{\r\n													female:item.gender=="F",\r\n													male:item.gender=="M",\r\n													horizontal:item.rotate_code==2,\r\n		                                            rotate180:item.rotate_code==3,\r\n		                                            rotate90:item.rotate_code==6,\r\n		                                            rotateM90:item.rotate_code==8,\r\n		                                            vertical:item.rotate_code==4,\r\n		                                            horizontalRotate90:item.rotate_code==5,\r\n		                                            horizontalRotateM90:item.rotate_code==7\r\n												}\'\r\n											style=\'background:url({{item.img_url}}) no-repeat center center; background-size:cover\'>\r\n										</figure>\r\n										<img\r\n											ng-if=\'item.deco_img_url\'\r\n											class=\'deco_img\'\r\n											ng-src=\'{{item.deco_img_url}}\' alt=\'\'/>\r\n									</div>\r\n									<div class=\'table-cell pet_info\'>\r\n										<div class=\'info-header\' ng-click="petFunc(\'edit\',(item.bbs_no||item.bbc_no))">\r\n											<a>정보수정</a>\r\n										</div>\r\n										<div class=\'info-body\'>\r\n											<b>{{item.name}}</b>\r\n											<p>{{item.gender=="M"?"남아":"여아"}} / 생일 : {{item.birthday}}</p>\r\n											<a\r\n												class=\'active_state\'\r\n												ng-click="petFunc(\'active\',(item.bbs_no||item.bbc_no))"\r\n												ng-class=\'{active:item.active}\'>\r\n												이 아이로 활동하기\r\n											</a>\r\n										</div>\r\n									</div>\r\n								</div>\r\n							</li>\r\n						</ul>\r\n					</div>\r\n				</div>\r\n				<ul class=\'my_pet_indicator\' ng-if="screenData.pet_list.length>1">\r\n					<li\r\n						ng-repeat=\'item in screenData.pet_list\'\r\n						ng-class=\'{active:petSwipeIndex==$index}\'\r\n						ng-click=\'petFunc("indicator", $index+1 )\'>{{$index}}</li>\r\n				</ul>\r\n				<div class=\'fix_foot\'  ng-if="screenData.pet_list.length" ng-class=\'{showIndicator:screenData.pet_list.length}\'>\r\n					<div class=\'view_post clear\'>\r\n						<button ng-click="petFunc(\'myswag\')">내가 쓴 뽐내기</button>\r\n						<button class=\'add_heart\' ng-click="petFunc(\'likePost\')">좋아한 게시물 </button>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			<!-- // 등록 펫 목록 -->\r\n\r\n			<!-- 등록된 펫 이 있을경우 펫과 관련된 상품 목록 -->\r\n			<div class=\'pet_recoms dear_wrap new_dear_wrap\' ng-if="screenData.pet_list.length&&screenData.recom_list.length">\r\n				<div class=\'align_block clear\'>\r\n					<div\r\n						ng-repeat="group in screenData.recom_list"\r\n						ng-class=\'{\r\n								listType1:screenType>1&&screenData.recom_list.length<2,\r\n								listType2:screenType>1&&screenData.recom_list.length>1\r\n							}\'>\r\n						<div class=\'recom_head\'>\r\n							<h3 ng-bind-html=\'group.title\'></h3>\r\n						</div>\r\n						<ul class=\'clear pet_recom_item_list list_wrap three\'>\r\n							<li ng-repeat=\'item in group.items\'>\r\n								<a href="#" ticlick-old=\'m_DC_SpeDisp_Dearpet_Clk_Prd_A01\' ng-click="mallProductClick(item.goods_no, group.tclick+($index+1) )">\r\n									<div class="img_wrap"><img ng-src="{{item.sImgUrl}}" alt="{{items.brnd_nm}}"></div>\r\n									<div class=\'goods_info\'>\r\n										<em ng-if="item.brnd_nm">[{{item.brnd_nm}}]</em>\r\n										<span class="" ng-bind-html="item.goods_nm"></span>\r\n									</div>\r\n									<span class="price"><span class="">{{item.price2||item.price1}}</span>원\r\n								</a>\r\n							</li>\r\n						</ul>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			\r\n			<!--20170926펫상식(스토리) 배너 -->\r\n			<div ng-if="screenData.storyBanner!=null" class="mypet_story_wrap">		\r\n	            <div ng-if="screenData.storyBanner.items.length >1" class="bnr_swipe story_swipe">\r\n	                <div class="swipe_wrap"  id="roll-swipe-id-150000960" rolling="true" roll-swipe-banner interval="3000" width320="1" width640="1" width900="1" info="screenData.storyBanner.items" >\r\n	                    <ul class="swipeBox">\r\n	                        <li ng-repeat="bnrItem in screenData.storyBanner.items" ng-click="story_banner_swipe_click(bnrItem.img_link,$index+1)" >\r\n	                        	\r\n	                        	<a class="inner_img_wrap">\r\n	                        		<img class="story_banner_icon floating_text" ng-src="http://image.lotte.com/lotte/mobile/mobile_new/brandshop/kshop/mitou_story_banner_icon.png" />\r\n	                        		<span class="story_img" style="background:url({{bnrItem.img_url}}) center center no-repeat;"></span>\r\n<!-- 	                        		<img class="story_banner_img" ng-src="{{bnrItem.img_url}}" alt="bnrItem.title" /> -->\r\n	                        		<div class="title"><span class="content floating_text" ng-bind-html=\'bnrItem.title\'></span></div>\r\n	                        	</a>\r\n	                        </li>\r\n	                    </ul>\r\n	                    <ol class="bullet indicator" ng-if="screenData.storyBanner.items.length>1" >\r\n		                    <li ng-repeat="indicator in screenData.storyBanner.items"><span></span></li>\r\n		                </ol>\r\n	                </div>\r\n	                \r\n	            </div>\r\n	            <div ng-if="screenData.storyBanner.items.length < 2" class="bnr_swipe story_swipe">\r\n	            	<div class="swipe_wrap" >	             \r\n	                    <ul class="swipeBox">\r\n	                       <li ng-repeat="bnrItem in screenData.storyBanner.items" ng-click="story_banner_swipe_click(bnrItem.img_link,$index+1)">\r\n	                        <a class="inner_img_wrap">\r\n	                        		<img class="story_banner_icon floating_text" ng-src="http://image.lotte.com/lotte/mobile/mobile_new/brandshop/kshop/mitou_story_banner_icon.png" />\r\n	                        		<span class="story_img" style="background:url({{bnrItem.img_url}})center center no-repeat;"></span>\r\n<!-- 	                        		<img class="story_banner_img" ng-src="{{bnrItem.img_url}}" alt="bnrItem.title" /> -->\r\n	                        		<div class="title"><span class="content floating_text" ng-bind-html=\'bnrItem.title\'></span></div>\r\n	                        	</a>\r\n	                        </li>\r\n	                    </ul>\r\n	                  <!-- <ol class="bullet indicator" ng-if="screenData.storyBanner&&screenData.storyBanner.items.length>1" >\r\n	                   		<li ng-repeat="indicator in screenData.storyBanner.items" >\r\n	                   		<span>{{$index}}</span>\r\n	                   		</li>\r\n	                  </ol>  -->\r\n	                </div>\r\n	            </div>    \r\n	        </div> \r\n			<!--//20170926펫상식(스토리) 배너 -->\r\n\r\n			<div class="list_area" ng-if="screenData.newBestList&&screenData.newBestList.length">\r\n				<section class="dear_wrap new_best">\r\n					<h3 class="title">신상품 Best</h3>\r\n					<ul class="list_wrap three">\r\n						<li ng-repeat="item in screenData.newBestList" ng-if="$index<3">\r\n							<a href="#" ng-click="mallProductClick(item.goods_no, \'m_DC_SpeDisp_Dearpet_Clk_Prd_A0{{$index + 1}}\')">\r\n								<div class="img_wrap"><img ng-src="{{item.sImgUrl}}" alt="{{item.goods_nm}}"></div>\r\n								<div class=\'goods_info\'>\r\n									<em ng-if="item.brnd_nm">[{{item.brnd_nm}}]</em>\r\n									<span ng-bind-html="item.goods_nm"></span>\r\n								</div>\r\n								<span class="price"><span>{{item.price2}}</span>원<var ng-if="item.goodsCmpsCd == \'30\'">~</var></span>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n				</section>\r\n				<section class="dear_wrap list_area week_best" ng-if="screenData.weekBestList&&screenData.weekBestList.length">\r\n					<h3 class="title">한주간 Best</h3>\r\n					<ul class="list_wrap three">\r\n						<li ng-repeat="item in screenData.weekBestList" ng-if="$index<3">\r\n							<a href="#" ng-click="mallProductClick(item.goods_no, \'m_DC_SpeDisp_Dearpet_Clk_Prd_B0{{$index + 1}}\')">\r\n								<div class="img_wrap"><img ng-src="{{item.sImgUrl}}" alt="{{item.goods_nm}}"></div>\r\n								<div class=\'goods_info\'>\r\n									<em ng-if="item.brnd_nm">[{{item.brnd_nm}}]</em>\r\n									<span ng-bind-html="item.goods_nm"></span>\r\n								</div>\r\n								<span class="price"><span>{{item.price2}}</span>원<var ng-if="item.goodsCmpsCd == \'30\'">~</var></span>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n				</section>\r\n			</div>\r\n		\r\n			<div class="list_area isTablet">\r\n				<section class="dear_wrap list_area theme_plan"  ng-if="screenData.themePlan">\r\n					<p class="subtitle" ng-bind-html="screenData.themePlan.subtitle"></p>\r\n					<h3 class="title" ng-bind-html="screenData.themePlan.title"></h3>\r\n					<div class="plan">\r\n						<a href="#" ng-click="BannerClick(screenData.themePlan.plan.img_link, \'m_DC_SpeDisp_Dearpet_Clk_Ban_07\')">\r\n							<div class="img_wrap">\r\n								<img ng-src="{{screenData.themePlan.plan.img_url}}">\r\n							</div>\r\n							<div class="txt_area">\r\n								<p class="plan_title" ng-bind-html="screenData.themePlan.plan.title"></p>\r\n								<span class="plan_subtitle" ng-bind-html="screenData.themePlan.plan.subtitle"></span>\r\n							</div>\r\n						</a>\r\n					</div>\r\n					<ul class="list_wrap three">\r\n						<li ng-repeat="item in screenData.themePlan.goods_list.items" ng-if="$index<3">\r\n							<a href="#" ng-click="mallProductClick(item.goods_no, \'m_DC_SpeDisp_Dearpet_Clk_Prd_C0{{$index + 1}}\')">\r\n								<div class="img_wrap"><img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}"></div>\r\n								<div class=\'goods_info\'>\r\n									<em ng-if="item.brnd_nm">[{{item.brnd_nm}}]</em>\r\n									<span  ng-bind-html="item.goods_nm"></span>\r\n								</div>\r\n								<span class="price"><span>{{item.price | number}}</span>원<var ng-if="item.is_plan_prod == true">~</var></span>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n				</section>\r\n						<!-- 20170927 수의사 배너 첫번째 위치 /배너 유입이 지나치게 많아질경우 두번째 위치(최하단 캠페인영역위)로 프로에서 변경 -->\r\n						<!-- 20170927 수의사 배너 첫번째 위치 /배너 유입이 지나치게 많아질경우 두번째 위치(최하단 캠페인영역위)로 프로에서 변경 -->\r\n		<div class="advice_banner advece_banner_phone" ng-repeat="item in screenData.advice_banner.items" ng-if="item.banner_position==\'1\'">\r\n			<a href="" ng-click="advice_banner_click(item.img_link,petTclickList.ban11)">\r\n				<img ng-src="{{item.img_url}}">\r\n			</a>\r\n		</div>\r\n		<!-- //20170927 수의사 배너 첫번째 위치 -->\r\n				<!-- 폰용 -->\r\n				<div ng-if="screenType==1">\r\n					<section class="dear_wrap list_area social swag">\r\n						<p class="subtitle">도전! 스타일펫</p>\r\n						<h3 class="title">뽐내기</h3>\r\n						<a data-ctg-disp-no="5566438" data-ctg-name="뽐내기" data-ctg-before-disp-no="5566305" data-ctg-depth="2" class="more"><span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')">더보기</span></a>\r\n						<ul class="list_wrap">\r\n							<li>\r\n								<div class="img_wrap" data-ctg-disp-no="5566438" data-ctg-name="뽐내기" data-ctg-before-disp-no="5566305" data-ctg-depth="2">\r\n									<!-- img ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')" ng-src="{{screenData.swagView.img_url}}"-->\r\n									<div ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')" class=\'cover\' style=\'background:url({{screenData.swagView.img_url}}) no-repeat center center; background-size:cover; height:300px\'></div>\r\n									<div class="count_wrap">\r\n										<span class="like">{{screenData.swagView.like_count}}</span>\r\n										<span class="reply">{{screenData.swagView.reply_count}}</span>\r\n									</div>\r\n								</div>\r\n								<div class="txt_wrap">\r\n									<span class="userphoto">\r\n										<em\r\n											class=\'pet_img\'\r\n											ng-if="screenData.swagView.user_img"\r\n											ng-class=\'{\r\n											   horizontal:screenData.swagView.rotate_code==2,\r\n											   rotate180:screenData.swagView.rotate_code==3,\r\n											   rotate90:screenData.swagView.rotate_code==6,\r\n											   rotateM90:screenData.swagView.rotate_code==8,\r\n											   vertical:screenData.swagView.rotate_code==4,\r\n											   horizontalRotate90:screenData.swagView.rotate_code==5,\r\n											   horizontalRotateM90:screenData.swagView.rotate_code==7\r\n										    }\'\r\n											style=\'background:url({{screenData.swagView.user_img}}) center center no-repeat\'>\r\n										</em>\r\n										<img ng-if="!screenData.swagView.user_img" ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/v_dearpet_swag_photo.gif" />\r\n									</span>\r\n									<p data-ctg-disp-no="5566438" data-ctg-name="뽐내기" data-ctg-before-disp-no="5566305" data-ctg-depth="2"><span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')" ng-bind-html="screenData.swagView.text"></span></p>\r\n								</div>\r\n							</li>\r\n						</ul>\r\n					</section>\r\n				</div>\r\n				<!-- 태블릿용 -->\r\n				<div ng-if="screenType>1">\r\n					<section class="dear_wrap list_area social photo_area photo_review">\r\n						<p class="subtitle">BEST</p>\r\n						<h3 class="title">#포토후기</h3>\r\n						<a data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2" class="more"><span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn01\')">더보기</span></a>\r\n						<ul class="list_wrap">\r\n							<li>\r\n								<div class="txt_wrap">\r\n									<span class="userphoto" data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2">\r\n										<em\r\n											class=\'pet_img\'\r\n											ng-if="screenData.photoView.user_img"\r\n											ng-class=\'{\r\n											   horizontal:screenData.photoView.rotate_code==2,\r\n											   rotate180:screenData.photoView.rotate_code==3,\r\n											   rotate90:screenData.photoView.rotate_code==6,\r\n											   rotateM90:screenData.photoView.rotate_code==8,\r\n											   vertical:screenData.photoView.rotate_code==4,\r\n											   horizontalRotate90:screenData.photoView.rotate_code==5,\r\n											   horizontalRotateM90:screenData.photoView.rotate_code==7\r\n										    }\'\r\n											style=\'background:url({{screenData.photoView.user_img}}) center center no-repeat\'>\r\n										</em>\r\n										<img\r\n											ng-if="!screenData.photoView.user_img"\r\n											ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn01\')"\r\n											ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/v_dearpet_photoview_photo.gif" /></span>\r\n									<p>\r\n										<span ng-if="!screenData.photoView.user_img">{{screenData.photoView.user_name.substr(0,6) | hidestr}}</span>\r\n										<span ng-if="screenData.photoView.user_img">{{screenData.photoView.user_name}}</span>\r\n									</p>\r\n								</div>\r\n								<p data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2">상품후기: <span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Ban_10\')" ng-bind-html="screenData.photoView.text"></span></p>\r\n								<div class="img_wrap" data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2"><img ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Ban_10\')" ng-src="{{screenData.photoView.img_url}}"></div>\r\n								<div class="prod" ng-click="mallProductClick(screenData.photoView.goods_no, \'m_DC_SpeDisp_Dearpet_Clk_Prd_D0{{$index + 1}}\')">\r\n									<div class="imgArea"><span class="img_wrap"><img ng-src="{{screenData.photoView.goods_img}}" alt="{{screenData.photoView.goods_nm}}"></span></div>\r\n									<div class="txt_wrap">\r\n										<span class="title"><em ng-if="screenData.photoView.brnd_nm">[{{screenData.photoView.brnd_nm}}]</em><var ng-bind-html="screenData.photoView.goods_nm"></var></span>\r\n										<span class="price"><span>{{screenData.photoView.price | number}}</span>원<var ng-if="screenData.dearpetGramView.is_plan_prod == true">~</var></span>\r\n									</div>\r\n								</div>\r\n							</li>\r\n						</ul>\r\n					</section>\r\n				</div>\r\n			</div>\r\n	\r\n			<div class="list_area isTablet">\r\n				<section class="dear_wrap list_area social photo_area dearpetgram">\r\n					<p class="subtitle">실시간 이야기</p>\r\n					<h3 class="title">#미뚜그램</h3>\r\n					<a data-ctg-disp-no="5566436" data-ctg-name="디어펫그램" data-ctg-before-disp-no="5566305" data-ctg-depth="2" class="more"><span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn02\')">더보기</span></a>\r\n					<ul class="list_wrap">\r\n						<li ng-repeat="item in screenData.dearpetGramView.items">\r\n							<a data-ctg-disp-no="5566436" data-ctg-name="디어펫그램" data-ctg-before-disp-no="5566305" data-ctg-depth="2"><img ng-click="gallerydearpetClick($event, item.bbc_no, \'m_DC_SpeDisp_Dearpet_Clk_Prd_E0{{$index + 1}}\')" src="{{item.img_url}}"/></a>\r\n						</li>\r\n					</ul>\r\n				</section>\r\n\r\n				<!-- 폰용 -->\r\n				<div ng-if="screenType==1">\r\n					<section class="dear_wrap list_area social photo_area photo_review">\r\n						<p class="subtitle">BEST</p>\r\n						<h3 class="title">#포토후기</h3>\r\n						<a data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2" class="more"><span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn01\')">더보기</span></a>\r\n						<ul class="list_wrap">\r\n							<li>\r\n								<div class="txt_wrap">\r\n									<span class="userphoto" data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2">\r\n										<em\r\n											class=\'pet_img\'\r\n											ng-if="screenData.photoView.user_img"\r\n											ng-class=\'{\r\n											   horizontal:screenData.photoView.rotate_code==2,\r\n											   rotate180:screenData.photoView.rotate_code==3,\r\n											   rotate90:screenData.photoView.rotate_code==6,\r\n											   rotateM90:screenData.photoView.rotate_code==8,\r\n											   vertical:screenData.photoView.rotate_code==4,\r\n											   horizontalRotate90:screenData.photoView.rotate_code==5,\r\n											   horizontalRotateM90:screenData.photoView.rotate_code==7\r\n										    }\'\r\n											style=\'background:url({{screenData.photoView.user_img}}) center center no-repeat\'>\r\n										</em>\r\n										<img\r\n											ng-if="!screenData.photoView.user_img"\r\n											ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn01\')"\r\n											ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/v_dearpet_photoview_photo.gif" />\r\n									</span>\r\n									<p>\r\n										<span ng-if="!screenData.photoView.user_img">{{screenData.photoView.user_name.substr(0,6) | hidestr}}</span>\r\n										<span ng-if="screenData.photoView.user_img">{{screenData.photoView.user_name}}</span>\r\n									</p>\r\n								</div>\r\n								<p data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2">상품후기: <span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Ban_10\')" ng-bind-html="screenData.photoView.text"></span></p>\r\n								<div class="img_wrap" data-ctg-disp-no="5566437" data-ctg-name="포토후기" data-ctg-before-disp-no="5566305" data-ctg-depth="2">\r\n									<!-- img ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Ban_10\')" ng-src="{{screenData.photoView.img_url}}" -->\r\n									<div class=\'cover photo\' ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Ban_10\')" style="background:url({{screenData.photoView.img_url}}) no-repeat center center"></div>\r\n								</div>\r\n								<div class="prod" ng-click="mallProductClick(screenData.photoView.goods_no, \'m_DC_SpeDisp_Dearpet_Clk_Prd_D0{{$index + 1}}\')">\r\n									<div class="imgArea"><span class="img_wrap"><img ng-src="{{screenData.photoView.goods_img}}" alt="{{screenData.photoView.goods_nm}}"></span></div>\r\n									<div class="txt_wrap">\r\n										<div class=\'goods_info\'>\r\n											<span class="title"><em ng-if="screenData.photoView.brnd_nm">[{{screenData.photoView.brnd_nm}}]</em><var ng-bind-html="screenData.photoView.goods_nm"></var></span>\r\n										</div>\r\n										<span class="price"><span>{{screenData.photoView.price | number}}</span>원<var ng-if="screenData.dearpetGramView.is_plan_prod == true">~</var></span>\r\n									</div>\r\n								</div>\r\n							</li>\r\n						</ul>\r\n					</section>\r\n				</div>\r\n				<!-- 태블릿용 -->\r\n				<div ng-if="screenType>1">\r\n					<section class="dear_wrap list_area social swag">\r\n						<p class="subtitle">도전! 스타일펫</p>\r\n						<h3 class="title">뽐내기</h3>\r\n						<a\r\n							data-ctg-disp-no="5566438"\r\n							data-ctg-name="뽐내기"\r\n							data-ctg-before-disp-no="5566305"\r\n							data-ctg-depth="2"\r\n							class="more">\r\n							<span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')">\r\n								더보기\r\n							</span>\r\n						</a>\r\n						<ul class="list_wrap">\r\n							<li>\r\n								<div\r\n									data-ctg-disp-no="5566438"\r\n									data-ctg-name="뽐내기"\r\n									data-ctg-before-disp-no="5566305"\r\n									data-ctg-depth="2"\r\n									class="img_wrap">\r\n									<img\r\n										ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')"\r\n										ng-src="{{screenData.swagView.img_url}}">\r\n									<div class="count_wrap">\r\n										<span class="like">{{screenData.swagView.like_count}}</span>\r\n										<span class="reply">{{screenData.swagView.reply_count}}</span>\r\n									</div>\r\n								</div>\r\n								<div class="txt_wrap">\r\n									<span class="userphoto">\r\n										<em\r\n											class=\'pet_img\'\r\n											ng-if="screenData.swagView.user_img"\r\n											ng-class=\'{\r\n											   horizontal:screenData.swagView.rotate_code==2,\r\n											   rotate180:screenData.swagView.rotate_code==3,\r\n											   rotate90:screenData.swagView.rotate_code==6,\r\n											   rotateM90:screenData.swagView.rotate_code==8,\r\n											   vertical:screenData.swagView.rotate_code==4,\r\n											   horizontalRotate90:screenData.swagView.rotate_code==5,\r\n											   horizontalRotateM90:screenData.swagView.rotate_code==7\r\n										    }\'\r\n											style=\'background:url({{screenData.swagView.user_img}}) center center no-repeat\'>\r\n										</em>\r\n										<img\r\n											ng-if="!screenData.swagView.user_img"\r\n											ng-src="http://image.lotte.com/lotte/mo2015/angular/mall/v_dearpet_swag_photo.gif" />\r\n									</span>\r\n									<p data-ctg-disp-no="5566438" data-ctg-name="뽐내기" data-ctg-before-disp-no="5564054" data-ctg-depth="2"><span ng-click="galleryMoreClick($event, \'m_DC_SpeDisp_Dearpet_Clk_Btn03\')"><em ng-bind-html="screenData.swagView.text"></em></span></p>\r\n								</div>\r\n							</li>\r\n						</ul>\r\n					</section>\r\n				</div>\r\n			</div>										<!-- 20170927 수의사 배너 첫번째 위치 /배너 유입이 지나치게 많아질경우 두번째 위치(최하단 캠페인영역위)로 프로에서 변경 -->\r\n		<div class="advice_banner advece_banner_pad"  ng-repeat="item in screenData.advice_banner.items" ng-if="item.banner_position==\'1\'">\r\n			<a href="" ng-click="advice_banner_click(item.img_link,petTclickList.ban11)">\r\n				<img ng-src="{{item.img_url}}">\r\n			</a>\r\n		</div>\r\n		<!-- //20170927 수의사 배너 첫번째 위치 -->\r\n			<section class="dear_wrap statege">\r\n				<ul class="tab">\r\n					<li class="a"><a ng-click="tabDepChange(\'a\');" ng-class="{on:screenData.take == \'a\'}">강아지</a></li>\r\n					<li class="b"><a ng-click="tabDepChange(\'b\');" ng-class="{on:screenData.take == \'b\'}">고양이</a></li>\r\n				</ul>\r\n				<div class="tab_contents tab01" ng-if="screenData.take == \'a\'">\r\n					<p class="subtitle" ng-bind-html="screenData.strategeList[0].subtitle"></p>\r\n					<h3 class="title" ng-bind-html="screenData.strategeList[0].title"></h3>\r\n					<ul class="list_wrap two">\r\n						<li ng-repeat="item in screenData.strategeList[0].list.items" ng-if="$index<4">\r\n							<a href="#" ng-click="stategeBannerClick(item.img_link, \'m_DC_SpeDisp_Dearpet_Clk_Prd_F0{{$index + 1}}\')">\r\n								<div class="img_wrap">\r\n									<img ng-src="{{item.img_url}}" alt="{{item.title}}">\r\n								</div>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n				</div>\r\n				<div class="tab_contents tab02" ng-if="screenData.take == \'b\'">\r\n					<p class="subtitle" ng-bind-html="screenData.strategeList[1].subtitle"></p>\r\n					<h3 class="title" ng-bind-html="screenData.strategeList[1].title"></h3>\r\n					<ul class="list_wrap two">\r\n						<li ng-repeat="item in screenData.strategeList[1].list.items" ng-if="$index<4">\r\n							<a href="#" ng-click="stategeBannerClick(item.img_link, \'m_DC_SpeDisp_Dearpet_Clk_Prd_G{{$index + 1}}\')">\r\n								<div class="img_wrap">\r\n									<img ng-src="{{item.img_url}}" alt="{{item.title}}">\r\n								</div>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n				</div>\r\n			</section>\r\n				<!-- 20170927 수의사 배너 두번째 위치 -->\r\n			<div class="advice_banner" ng-repeat="item in screenData.advice_banner.items track by $index" ng-if="item.banner_position==\'2\'">\r\n				<a href="" ng-click="advice_banner_click(item.img_link,petTclickList.ban12)">\r\n					<img ng-src="{{item.img_url}}">\r\n				</a>\r\n			</div>\r\n			<!-- 20170927 수의사 배너 두번째 위치 -->\r\n			<section class="dear_wrap dearpet_campain">\r\n				<h3 class="title" ng-click=\'appDown()\'>미미뚜뚜 캠페인</h3>\r\n				<ul class="list_wrap two">\r\n					<li ng-repeat="item in screenData.dearpetCampainList" ng-if="$index<2">\r\n						<a href="#" ng-click="BannerClick(item.img_link, \'m_DC_SpeDisp_Dearpet_Clk_Ban_0{{$index + 8}}\')">\r\n							<div class="img_wrap"><img ng-src="{{item.img_url}}" alt="{{item.title}}"></div>\r\n							<span class="title" ng-bind-html="item.title"></span>\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</section>\r\n		</section>\r\n	</section>\r\n</section>\r\n');
}]);