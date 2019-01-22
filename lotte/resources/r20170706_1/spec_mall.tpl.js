angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/unit/comm_unit.html",'<div class="comm-unit">\r\n    <a href="" ng-click="clickUnit()">\r\n        <span class="thumb">\r\n            <img ng-src="{{imgPath+item.sImgUrl}}" alt="{{item.goodsNm}}" ng-if="srhObj.imgListGbn!=\'lv-unit\'"/>\r\n            <img ng-src="{{imgPath+item.bImgUrl}}" alt="{{item.goodsNm}}" ng-if="srhObj.imgListGbn==\'lv-unit\'"/>\r\n        </span>\r\n        <span class="cont01">\r\n            <p class="tl">{{item.goodsNm}}</p>\r\n            <p class="icon">\r\n                <span ng-repeat="flag in item.flag" class="{{flag}}"></span>\r\n            </p>\r\n            <p class="money">\r\n                <del class="small" ng-if="item.price1"><span>{{item.price1}}</span>원</del>\r\n                <span class="price" ng-class="{plan_type_unit : item.goodsCmpsCd == \'30\'}" ng-if="item.price2"><span>{{item.price2}}</span></span>\r\n            </p>\r\n        </span>\r\n        <!--\r\n        상품상세 할인율과 상이하여 주석처리(추후 상품상세 할인율 로직을 적용해야함, 현재는 들어오느 데이터중 정상가 데이터가 없어, 계산이 불가.)\r\n        현업 : ux기획 이종봉팀장님\r\n        작업 : IT운영팀 김낙운\r\n        -->\r\n        <!-- <div class="sale" ng-if="item.saleRate">\r\n            <p><span>{{item.saleRate}}</span>%</p>\r\n        </div> -->\r\n    </a>\r\n</div>'),a.put("/lotte/resources_dev/mall/spec_mall_main.html",'<section>\r\n    <!-- main visual -->\r\n    <div class="kshop_spot swipe_wrap" ng-if="swipeBanner" roll-swipe-banner id="rolltopbann" rolling="true" width320="1" width640="1" width900="1" info="top_banner">\r\n        <ul class="swipeBox">\r\n            <li ng-repeat="banner in swipeBanner" ng-if="!(swipeBanner.length%2==1 && $index==swipeBanner.length-1 && screenType > 1 && swipeBanner.length>2)" ng-class="{viewOne:screenType>1 && swipeBanner.length==1}">\r\n                <a ng-click="goSwipeBnrLink(banner.linkUrl, $index);"><img ng-src="{{banner.imgUrl}}" alt="{{banner.alt}}" /></a>\r\n            </li>\r\n        </ul>\r\n        <div class="swipe_indicator">\r\n	        <ul class="indicator">\r\n            <li ng-repeat="banner in swipeBanner"><span>{{$index}}</span></li>\r\n	        </ul>\r\n        </div>\r\n    </div>\r\n    <!-- //main visual -->\r\n\r\n	<spec-mall-cate type="main"></spec-mall-cate>\r\n\r\n    <!-- main content -->\r\n    <div class="kshop_con">\r\n      <!-- 20170418 롯데그룹관 -->\r\n       <div class="con kshop_lottestore" ng-if="kShopUI.dispNo == \'5553048\' && lotteStore != undefined">\r\n           <h3>{{mainData.lotteStore[0].alt}}</h3>\r\n           <ul class="lotteGroupList" ng-repeat="ulItem in lotteStore" ng-init="$pindex = $index">\r\n               <li ng-repeat="item in ulItem track by $index"><a ng-click="linkLotteGroup(item.linkUrl, $pindex, $index)" ng-if="item.imgUrl != null"><img ng-src="{{item.imgUrl}}"></a></li>\r\n           </ul>\r\n       </div>\r\n\r\n		<!-- 2016.11.07 상품 리스트 노출기준 수정 -->\r\n		<div class="prod_con">\r\n	        <div class="con" ng-repeat="(key, prdList) in mainData.prdList" ng-if="mainCtgNameData[key]" ng-hide="screenType > 1 && $index == prdListC">\r\n	            <h3>{{prdList.ctgName}}</h3>\r\n	            <div class="listWrap" ng-controller="productCtrl">\r\n					<div class="unitWrap">\r\n						<div product-container template-type="image" total-count="prdList.product.length" products="prdList.product"></div>\r\n					</div>\r\n				</div>\r\n	        </div>\r\n		</div>\r\n\r\n		<!-- 20170418 쌤쏘나이트 카테고리 -->\r\n		<div class="con kshop_lottestore" ng-if="kShopUI.dispNo == \'5571254\' && lotteStore != undefined">\r\n			<h3>{{mainData.lotteStore[0].alt}}</h3>\r\n			<ul class="lotteGroupList" ng-repeat="ulItem in lotteStore" ng-init="$pindex = $index">\r\n				<li ng-repeat="item in ulItem track by $index"><a ng-click="linkLotteGroup(item.linkUrl, $pindex, $index)" ng-if="item.imgUrl != null"><img ng-src="{{item.imgUrl}}"></a></li>\r\n			</ul>\r\n		</div>\r\n    </div>\r\n\r\n\r\n    <!--2016.11.10 둥둥이배너 chasu : 1 ~ 3 -->\r\n    <!-- <div ng-if="kShopUI.dispNo == \'5558814\'">\r\n        <dungdung id="ddpop" start="201612301000" end="201612310000"></dungdung>\r\n    </div> -->\r\n    <!-- //main content -->\r\n\r\n    <!-- main link -->\r\n    <div class="kshop_s_banner" ng-if="mainData.topHtml!=\'\'" ng-bind-html="mainData.topHtml"></div>\r\n    <!-- //main link -->\r\n</section>\r\n'),a.put("/lotte/resources_dev/mall/spec_mall_cate.html",'<div class="smcCateContainer">\r\n	\r\n	<!-- 메인 페이지 카테고리 -->\r\n	<div class="smcCateMain" ng-if="smcCateType==\'main\'">\r\n	\r\n		<!-- 아이콘 슬라이드형 -->\r\n		<div class="smcIconType cnt{{smcCateList.length}}" ng-if="smcListType==\'icon\'">\r\n			<div lotte-slider>\r\n				<ul style="min-width:{{82*smcCateList.length}}px">\r\n					<li ng-repeat="cate in smcCateList track by $index">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>\r\n							<span style="background-image:url({{cate.img_url}})" class="img"></span>\r\n							<span class="txt">{{cate.name}}</span>\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		\r\n		<!-- 리스트형 -->\r\n		<div class="smcListType" ng-if="smcListType==\'list\'">\r\n			<!-- 6개 미만 -->\r\n			<div ng-if="smcCateList.length <= 6">\r\n				<ul>\r\n					<li ng-repeat="cate in smcCateList track by $index">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>{{cate.name}}</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<!-- 6개 이상 -->\r\n			<div ng-if="smcCateList.length > 6">\r\n				<ul ng-if="smcListMore==false">\r\n					<li ng-repeat="cate in smcCateList | limitTo:5">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>{{cate.name}}</a>\r\n					</li>\r\n					<li class="more">\r\n						<a ng-click="smcCateListShowMore()">더보기</a>\r\n					</li>\r\n				</ul>\r\n				<ul ng-if="smcListMore==true">\r\n					<li ng-repeat="cate in smcCateList track by $index">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>{{cate.name}}</a>\r\n					</li>\r\n					<!-- <li class="more">\r\n						<a>더보기</a>\r\n					</li> -->\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		\r\n	</div>\r\n	\r\n	<!-- 서브 페이지 카테고리 -->\r\n	<div class="smcSubCate" ng-if="smcCateType==\'sub\'">\r\n		<div class="smcNavigator" ng-class="{open:smcSubNaviList.visible,d0:smcSubNaviList.depth==0,d1:smcSubNaviList.depth==1,d2:smcSubNaviList.depth==2}">\r\n			<div class="navi d{{$index}}" ng-repeat="cate in smcSubIndicator track by $index">\r\n				<a ng-click="smcShowSubNavi(cate, $index)"><span>{{cate.name}}</span></a>\r\n			</div>\r\n		</div>\r\n		<div class="smcSubNavi" ng-if="smcSubNaviList.visible">\r\n			<div class="smcSubNaviList">\r\n				<ul lotte-ng-list-swipe swipe-id="smcSubNaviSwipe" swipe-list-model="smcSubNaviList.list" swipe-slide-item="true"\r\n					swipe-max-ratio="0.2" swipe-min-distance="40" swipe-responsive="true" swipe-responsive320="1" swipe-responsive640="1">\r\n					<li ng-repeat="item in smcSubNaviList.list track by $index">\r\n						<a ng-repeat="ctg in item track by $index" ng-href={{smcGetNaviUrl(ctg)}} ng-link3d-touch\r\n							ng-class="{on:\r\n								(smcSubNaviList.depth==0 && smcSubIndicator[0].ctg_no==ctg.ctg_no)\r\n								|| (smcSubNaviList.depth==1 && smcSubIndicator[1].ctg_no==ctg.ctg_no)\r\n								|| (smcSubNaviList.depth==2 && smcSubIndicator[2].ctg_no==ctg.ctg_no)\r\n							}">{{ctg.name}}</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<div class="smcSubNaviIndi">\r\n				<ul ng-if="smcSubNaviList.list.length > 1">\r\n					<li ng-repeat="item in smcSubNaviList.list track by $index" ng-class="{on:$index==swipeIdx}">{{$index}}</li>\r\n				</ul>\r\n				<a class="close" ng-click="smcHideSubNavi()">닫기</a>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	\r\n</div>')}]);