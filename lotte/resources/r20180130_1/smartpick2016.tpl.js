angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/smartpick2016_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n    <div ng-if="smp.top_ban_list.items" class="topBann"  ng-click="linkUrl(smp.top_ban_list.items[0], \'m_DC_Smartpick_Clk_Ban01\', \'\')">\r\n        <img ng-src="{{smp.top_ban_list.items[0].img_url}}">\r\n    </div>\r\n    <!-- 스와이프 배너 리스트-->\r\n	<section ng-if="smp.swipe_ban_list.items"\r\n		ng-controller="lotteNgSwipeCtrl" class="top_swipe_wrap" ng-class="{pad:screenType > 1}">\r\n		<div class="swipe_wrap"roll-swipe-banner id="rolltopbann" rolling="true" width320="1" width640="1" width900="1" info="top_banner">\r\n			<ul class="swipeBox">\r\n				<li ng-repeat="item in smp.swipe_ban_list.items track by $index" ng-if="!($index%2 == 0 && $index==smp.swipe_ban_list.items.length-1 && screenType > 1)">\r\n					<a ng-click="linkUrl(item, \'m_DC_Smartpick_Swp_Ban_idx\',  $index + 1)">\r\n						<div class="img_wrap">\r\n							<img ng-src="{{item.img_url}}" alt="{{item.banner_nm}}" />\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n      <div class="swipe_indicator">\r\n        <ul class="bullet indicator">\r\n          <li ng-repeat="item in smp.swipe_ban_list.items track by $index"><span>{{$index}}</span></li>\r\n        </ul>\r\n      </div>\r\n		</div>\r\n		<!-- <ul ng-if="smp.swipe_ban_list.items" class="indicator">\r\n			<li ng-repeat="item in smp.swipe_ban_list.items track by $index" ng-class="{on: swipeIdx == $index}" ng-hide="($index%2==1 && screenType > 1) || ($index==smp.swipe_ban_list.items.length-1 && $index%2==0 && screenType > 1)"><span>{{$index}}</span></li>\r\n		</ul> -->\r\n	</section>\r\n\r\n    <section class="smp_list">\r\n        <!-- 상단 스마트픽 정보 -->\r\n        <div class="topInfo">\r\n            <p>{{smp.smp_sub_str}}</p>\r\n            <b>{{smp.smp_main_str}}</b>\r\n        </div>\r\n        <div class="myStore" ng-class="{on:showBranchLayer}">\r\n           <div class="my" ng-if="!loginInfo.login">본점 </div>\r\n            <div class="my" ng-if="loginInfo.login">{{loginInfo.name}}님의 단골지점 : <b>{{branch_list.fav_branch.branch_nm|trim}}</b></div>\r\n            <div class="store"><a href="#" ng-click="showHideStoreList()" ng-class="{on:showBranchLayer}">단골지점 설정</a></div>\r\n        </div>\r\n        <!--단골지점설정 탭-->\r\n        <div class="select_store" ng-class="{showlayer:showBranchLayer}">\r\n            <div class="storelist_layer">\r\n                <div class="inform" ng-if="!loginInfo.login">\r\n                    로그인 후 단골지점을 설정할 수 있습니다.\r\n                    <a href="#" ng-click="goLogin()">로그인</a>\r\n                </div>\r\n                <div class="inform" ng-if="loginInfo.login">\r\n                    <span ng-if="branch_list.fav_branch==undefined">단골지점을 선택해주세요.</span>\r\n                    <span ng-if="branch_list.fav_branch">고객님의 단골지점은\r\n                        <b>{{branch_list.fav_branch.branch_nm | trim}}</b>\r\n                    입니다.</span>\r\n                </div>\r\n                <ul>\r\n                    <li ng-repeat="group in branch_list.items">\r\n                        <ol>\r\n                            <li>{{group.branch_grp_nm}}</li>\r\n                            <li ng-repeat="branch in group.branch_list.items" ng-class="{on:branch.is_fav}"><a href="#" ng-click="branchClick(this)">{{branch.branch_nm | trim}}</a></li>\r\n                        </ol>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <ul class="storeInfo type{{smp.branch_detail_info.length}}" >\r\n            <li ng-if=\'smp.branchInfoView[0]\'><div class="icon" ng-click="calendarHolidayClick()"></div>영업일</li>\r\n            <li ng-if=\'smp.branchInfoView[1]\'><div class="icon t2" ng-click="floorInfo()"></div>층별안내</li>\r\n            <li ng-if=\'smp.branchInfoView[2]\'><div class="icon t3" ng-click="dmCoupon()" ></div>DM쿠폰북</li>\r\n            <li ng-if=\'smp.branchInfoView[3]\'><div class="icon t4" ng-click="showPickup()" ></div>픽업장소/시간</li>\r\n        </ul>\r\n        <!--상품리스트-->\r\n        <ol class="prod_list_02">\r\n            <li ng-repeat="item in products track by $index">\r\n                <!-- 일반상품 : 이미지형 -->\r\n                <div class="unit_list_02">\r\n                    <span class="unit_zoom" ng-click="zoomImageClick(getProductImage(item))">크게보기</span>\r\n                    <a href="#" ng-click="linkProduct(item,\'m_DC_Smartpick_Clk_Prd_idx\', $index + 1, \'\')">\r\n                        <div class="soldout" ng-show="item.soldout">SOLD OUT</div>\r\n                        <div class="thumb">\r\n                            <img ng-src="{{item.img_url}}" alt="{{item.goods_nm}}" err-src />\r\n                            <p class="flag">\r\n                                <span class="flag depart" ng-show="item.is_dept">롯데백화점</span>\r\n                                <span class="flag smart" ng-show="item.is_smartpick">스마트픽</span>\r\n                            </p>\r\n                        </div>\r\n                        <div class="info">\r\n                            <span class="tit"><span ng-show="item.brand_nm">[<span ng-bind-html="item.brand_nm"></span>]</span> <span ng-bind-html="item.goods_nm"></span></span>\r\n                            <p class="pr_box">\r\n                                <span class="price"><em>{{item.discounted_price|number}}</em>원<span ng-if="item.is_plan_prod">~</span></span>\r\n                                <span class="price2" ng-show="item.original_price!=item.discounted_price && item.original_price !=0 && !item.is_sale_promotion">\r\n                                    <em>{{item.original_price|number}}</em>원\r\n                                </span>\r\n                            </p>\r\n                            <!-- ng-show="item.has_coupon" -->\r\n                            <p class="coupon" ng-show="!item.is_sale_promotion"><span ng-show="item.original_price&&item.sale_rate!=\'0\'&&item.original_price!=item.discounted_price"><em class="no">{{item.sale_rate}}</em><em class="po">%</em></span><span ng-show="item.has_coupon">쿠폰포함</span></p>\r\n                        </div>\r\n                    </a>\r\n\r\n<!--                    <div class="info2">\r\n                        <span class="review" ng-click="linkProduct(item,\'tClickCode\', $index + 1, \'&tabIdx=1\')">상품평 <em>({{item.review_count|number}})</em></span>\r\n                        <span class="wish_icon"  ng-class="{on:item.has_wish}" ng-click="addWishClick(item, \'tclickCode\')">위시리스트</span>\r\n                    </div>\r\n-->                </div>\r\n                <!-- //일반상품 : 이미지형 -->\r\n\r\n            </li>\r\n        </ol>\r\n        <!--더보기-->\r\n        <div class="moreBtn">\r\n            <div class="smpMore" ng-click="viewMorePick()">{{branch_list.fav_branch.branch_nm | trim}} 스마트픽 상품 더보기<div class="icon"></div></div>\r\n        </div>\r\n    </section>\r\n    <!--배너 리스트-->\r\n	<section ng-if="smp.foot_ban_list.items" class="foot_banner" ng-class="{pad:screenType > 1}">\r\n        <ul>\r\n            <li ng-repeat="item in smp.foot_ban_list.items track by $index" ng-hide="$index%2 == 0 && $index==smp.foot_ban_list.items.length-1 && screenType > 1">\r\n                <a ng-click="linkUrl(item, \'m_DC_Smartpick_Clk_Ban_idx\',  $index + 1)">\r\n                    <div class="img_wrap">\r\n                        <img ng-src="{{item.img_url}}" alt="{{item.banner_nm}}" />\r\n                    </div>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n	</section>\r\n        <!--픽업장소/시간 팝업-->\r\n        <div class="pop_pickup" ng-show="pickupFlag">\r\n            <div class="dim"  ng-click="hidePickup()"></div>\r\n            <div class="info">\r\n               <div class="box">\r\n                <div class="title">픽업 가능 장소/시간 안내</div>\r\n                <div class="list">\r\n                    <dl ng-repeat="item in smp.pickup_info.items">\r\n                       <dt>{{item.place}}</dt>\r\n                       <dd>{{item.time}}</dd>\r\n                    </dl>\r\n                </div>\r\n                <div class="close" ng-click="hidePickup()">닫기</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--영업일-->\r\n        <section class="calendar_holiday" ng-show="calendarHoliday" calendar-holiday>\r\n            <span class="close" ng-click="calenderHolidayClose()"></span>\r\n            <div class="head">\r\n                <h5>\r\n                   <strong ng-bind="date | date:\'yyyy\'"></strong> 년\r\n                   <strong ng-bind="date | date:\'MM\'"></strong> 월\r\n                </h5>\r\n            </div>\r\n            <section class="calendar">\r\n                <div class="week" ng-repeat="val in dateHead" ng-class="{sun:($index == 0)}">{{val}}</div>\r\n                <div ng-repeat="i in day track by $index"><span ng-class="{minute30:(dept_store.biz_dd_sct_class_nms[$index] == \'minute30\'),minute60:(dept_store.biz_dd_sct_class_nms[$index] == \'minute60\'),closed:(dept_store.biz_dd_sct_class_nms[$index] == \'closed\')}"><strong ng-class="{on:(cdate.getDate() == i)}">{{i}}</strong></span></div>\r\n            </section>\r\n            <div class="info">\r\n                <ul>\r\n                    <li class="closed">휴점</li>\r\n                    <li class="minute30">30분 연장</li>\r\n                    <li class="minute60">60분 연장</li>\r\n                </ul>\r\n            </div>\r\n            <div class="info"><p class="time">영업시간 AM 10:30 ~ PM 08:00</p></div>\r\n        </section>\r\n        <div ng-if="smpcurDispNo.curDispNo == \'5553631\'">\r\n			<dungdung id="ddpop" start="201701271000" end="201701280000"></dungdung>\r\n        </div>\r\n</section>\r\n')}]);