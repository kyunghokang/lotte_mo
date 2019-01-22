angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/unit/comm_unit.html",'<div class="comm-unit">\r\n    <a href="" ng-click="clickUnit()">\r\n        <span class="thumb">\r\n            <img ng-src="{{imgPath+item.sImgUrl}}" alt="{{item.goodsNm}}" ng-if="srhObj.imgListGbn!=\'lv-unit\'"/>\r\n            <img ng-src="{{imgPath+item.bImgUrl}}" alt="{{item.goodsNm}}" ng-if="srhObj.imgListGbn==\'lv-unit\'"/>\r\n        </span>\r\n        <span class="cont01">\r\n            <p class="tl">{{item.goodsNm}}</p>\r\n            <p class="icon">\r\n                <span ng-repeat="flag in item.flag" class="{{flag}}"></span>\r\n            </p>\r\n            <p class="money">\r\n                <del class="small" ng-if="item.price1"><span>{{item.price1}}</span>원</del>\r\n                <span class="price" ng-class="{plan_type_unit : item.goodsCmpsCd == \'30\'}" ng-if="item.price2"><span>{{item.price2}}</span></span>\r\n            </p>\r\n        </span>\r\n        <!--\r\n        상품상세 할인율과 상이하여 주석처리(추후 상품상세 할인율 로직을 적용해야함, 현재는 들어오느 데이터중 정상가 데이터가 없어, 계산이 불가.)\r\n        현업 : ux기획 이종봉팀장님\r\n        작업 : IT운영팀 김낙운\r\n        -->\r\n        <!-- <div class="sale" ng-if="item.saleRate">\r\n            <p><span>{{item.saleRate}}</span>%</p>\r\n        </div> -->\r\n    </a>\r\n</div>'),a.put("/lotte/resources_dev/mall/spec_mall_main.html",'<section class=\'update_20171026\'>\r\n    <!-- main visual -->\r\n    <div class="kshop_spot swipe_wrap" ng-if="swipeBanner && swipeBanner.length > 0" roll-swipe-banner id="rolltopbann" rolling="true" width320="1" width640="1" width900="1" info="top_banner">\r\n        <ul class="swipeBox">\r\n            <li ng-repeat="banner in swipeBanner" ng-if="!(swipeBanner.length%2==1 && $index==swipeBanner.length-1 && screenType > 1 && swipeBanner.length>2)" xxx-ng-class="{viewOne:screenType>1 && swipeBanner.length==1}">\r\n                <a ng-click="goSwipeBnrLink(banner.linkUrl, $index);"><img ng-src="{{banner.imgUrl}}" alt="{{banner.alt}}" /></a>\r\n            </li>\r\n        </ul>\r\n        <div class="swipe_indicator">\r\n	        <ul class="indicator">\r\n            <li ng-repeat="banner in swipeBanner"><span>{{$index}}</span></li>\r\n	        </ul>\r\n        </div>\r\n    </div>\r\n    <!-- //main visual -->\r\n\r\n    <spec-mall-cate type="main"></spec-mall-cate>\r\n\r\n    <!-- 마이클 코어스 / 일반 spec_mall 분기 처리-->\r\n\r\n    <!-- 20180608 마이클코어스 directive 영역-->\r\n    <spec-mk-mall-main ng-if="kShopUI.type == \'mk_template\'"></spec-mk-mall-main>\r\n    <!-- // 20180608 마이클코어스 directive 영역-->\r\n\r\n    <!-- normal spec_mall 영역 -->\r\n    <section ng-if="kShopUI.type != \'mk_template\'">\r\n        <!-- 메인 띠 배너 -->\r\n        <div class="ksop_line_banner" ng-if="mainData.event">\r\n            <a ng-href="{{mainData.event.linkUrl}}">\r\n                <img ng-src="{{mainData.event.imgUrl}}" alt="{{mainData.event.alt}}"/>\r\n            </a>\r\n        </div>\r\n\r\n        <!-- main content -->\r\n        <div class="kshop_con result_wrap cate_prod">\r\n            <!-- 20170418 롯데그룹관 -->\r\n           <div class="con kshop_lottestore" ng-if="lotteStore && lotteStore.length">\r\n               <h3><p>{{mainData.lotteStore[0].alt}}</p></h3>\r\n               <ul class="lotteGroupList" ng-repeat="ulItem in lotteStore | limitTo:4" ng-init="$pindex = $index" ng-show="!lotteStoreMore">\r\n                   <li ng-repeat="item in ulItem track by $index" ng-class="{\'more\' : $pindex == 3 && $index == 2}">\r\n                       <a ng-if="!($pindex == 3 && $index == 2)" ng-click="linkLotteGroup(item.linkUrl, $pindex, $index)">\r\n                           <img ng-src="{{item.imgUrl}}">\r\n                       </a>\r\n                       <a ng-if="$pindex == 3 && $index == 2" ng-click="clickLotteStoreMore()">+ 더보기</a>\r\n                   </li>\r\n               </ul>\r\n               \r\n               <ul class="lotteGroupList" ng-repeat="ulItem in lotteStore" ng-init="$pindex = $index" ng-show="lotteStoreMore">\r\n                   <li ng-repeat="item in ulItem track by $index">\r\n                       <a ng-click="linkLotteGroup(item.linkUrl, $pindex, $index)" ng-if="item.imgUrl != null">\r\n                           <img ng-src="{{item.imgUrl}}">\r\n                       </a>\r\n                   </li>\r\n               </ul>\r\n           </div>\r\n\r\n            <!-- 20171211 new Arrivals -->\r\n            <div class="con w100 new_arrivals" ng-if="mainData.newArrivals.length">\r\n                <h3><p>NEW ARRIVALS</p></h3>\r\n                <div hw-slider margin-right="1" class="swipe_wrap">\r\n                    <ul class="prd_unit_type01_line bd_middleLine">\r\n                        <li ng-repeat="item in mainData.newArrivals">\r\n                            <a ng-click="productView(item,null,null,tClickBase+screenID+\'_Clk_Prd_idx\'+($index+1) )">\r\n                                <div class="imageCon">\r\n                                    <img ng-src="{{item.img_url}}" alt="" />\r\n                                </div>\r\n                                <div class="titleCon">\r\n                                    <div class="name">{{item.goods_nm}}</div>\r\n                                    <div class="ti"><strong>{{(itme.original_price||item.discounted_price) | number}}</strong>원<em ng-if="item.is_sale_promotion">~</em></div>\r\n                                </div>\r\n                            </a>\r\n                        </li>\r\n                        <!--li class="bestMore">\r\n                            <a class="txt_store" ng-href="/mylotte/m/myfeed.do?{{rScope.baseParam}}&tclick=m_RDC_main_{{rScope.pageUI.curDispNo}}_M2030_Swp_more">\r\n                                <p>추천<br />더보기</p>\r\n                            </a>\r\n                        </li-->\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n\r\n	    	<!-- 2016.11.07 상품 리스트 노출기준 수정 -->\r\n	    	<div class="prod_con">\r\n	            <div class="con" ng-repeat="(key, prdList) in mainData.prdList" ng-if="mainCtgNameData[key]" ng-hide="screenType > 1 && $index == prdListC">\r\n	                <h3><p>{{prdList.ctgName}}<p></h3>\r\n	                <div class="listWrap" ng-controller="productCtrl">\r\n	    				<div class="unitWrap">\r\n	    					<div product-container template-type="cate_prod_double" total-count="prdList.product.length" products="prdList.product"></div>\r\n	    				</div>\r\n	    			</div>\r\n	            </div>\r\n	    	</div>\r\n\r\n            <!-- 20171026 || 최대 6개 2개씩 한묶음 // 짝수 출력으로 홀수 일경우 출력 안함 -->\r\n            <div class="prod_con up_20171027">\r\n                <div ng-repeat="prdList in mainData.prdList2" ng-if="prdList.product.length||prdList.items.length">\r\n                    <div class="con" ng-if="prdList.unitType!=\'pinterest\'">\r\n                        <h3 ng-if="prdList.product.length"><p>{{prdList.ctgName}}</p></h3>\r\n                        <div class="listWrap" ng-controller="productCtrl">\r\n                            <div class="unitWrap">\r\n                                <div product-container template-type="cate_prod_double" total-count="prdList.product.length" products="prdList.product"></div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!-- M45 -->\r\n                    <div class="con" ng-if="prdList.unitType==\'pinterest\'">\r\n                        <h3 ng-if="prdList.items.length"><p>{{prdList.title}}</p></h3>\r\n                        <div class="pinterest_list">\r\n                            <ul class="pl">\r\n                                <li class="rud_prd_10oclock">\r\n                                    <a ng-click="ptrDetail(prdList.items[0].setNo)" ng-style="{\'background-image\':\'url({{prdList.items[0].imgUrl}})\'}">\r\n                                        <div class="thumb" ></div>\r\n                                        <div class="info">\r\n                                            <p class="toptit"></p>\r\n                                            <p class="tit">\r\n                                                <span>{{prdList.items[0].txt}}</span>\r\n                                            </p>\r\n                                        </div>\r\n                                    </a>\r\n                                </li>\r\n                                <li>\r\n                                    <a ng-click="ptrDetail(prdList.items[2].setNo)" ng-style="{\'background-image\':\'url({{prdList.items[2].imgUrl}})\'}">\r\n                                        <div class="thumb" ></div>\r\n                                        <div class="info">\r\n                                            <p class="tit">{{prdList.items[2].txt}}</p>\r\n                                        </div>\r\n                                    </a>\r\n                                </li>\r\n                            </ul>\r\n                            <ul class="pr">\r\n                                <li>\r\n                                    <a ng-click="ptrDetail(prdList.items[1].setNo)" ng-style="{\'background-image\':\'url({{prdList.items[1].imgUrl}})\'}">\r\n                                        <div class="thumb" ></div>\r\n                                        <div class="info">\r\n                                            <p class="tit">{{prdList.items[1].txt}}</p>\r\n                                        </div>\r\n                                    </a>\r\n                                </li>\r\n                                <li class="prd_10oclock">\r\n                                    <a ng-click="ptrDetail(prdList.items[3].setNo)" ng-style="{\'background-image\':\'url({{prdList.items[3].imgUrl}})\'}">\r\n                                        <div class="thumb"></div>\r\n                                        <div class="info">\r\n                                            <p class="tit">{{prdList.items[3].txt}}</p>\r\n                                        </div>\r\n                                    </a>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 20171211 BEST -->\r\n            <div class="con w100 new_arrivals" ng-if="mainData.best.length">\r\n                <h3><p>BEST</p></h3>\r\n                <div hw-slider margin-right="1" class="swipe_wrap">\r\n                    <ul class="prd_unit_type01_line bd_middleLine">\r\n                        <li ng-repeat="item in mainData.best">\r\n                            <a ng-click="productView(item,null,null,tClickBase+screenID+\'_Clk_Prd_idx\'+($index+1) )">\r\n                                <div class="imageCon">\r\n                                    <img ng-src="{{item.img_url}}" alt="" />\r\n                                </div>\r\n                                <div class="titleCon">\r\n                                    <div class="name">{{item.goods_nm}}</div>\r\n                                    <div class="ti"><strong>{{(itme.original_price||item.discounted_price) | number}}</strong>원<em ng-if="item.is_sale_promotion">~</em></div>\r\n                                </div>\r\n                            </a>\r\n                        </li>\r\n                        <!--li class="bestMore">\r\n                            <a class="txt_store" ng-href="/mylotte/m/myfeed.do?{{rScope.baseParam}}&tclick=m_RDC_main_{{rScope.pageUI.curDispNo}}_M2030_Swp_more">\r\n                                <p>추천<br />더보기</p>\r\n                            </a>\r\n                        </li-->\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 20170418 쌤쏘나이트 카테고리 -->\r\n            <div class="con kshop_lottestore" ng-if="(kShopUI.dispNo == \'5571254\' || kShopUI.dispNo == \'5603898\') && lotteStore != undefined">\r\n                <h3><p>{{mainData.lotteStore[0].alt}}</p></h3>\r\n                <ul class="lotteGroupList" ng-repeat="ulItem in lotteStore" ng-init="$pindex = $index">\r\n                    <li ng-repeat="item in ulItem track by $index"><a ng-click="linkLotteGroup(item.linkUrl, $pindex, $index)" ng-if="item.imgUrl != null"><img ng-src="{{item.imgUrl}}"></a></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!--2016.11.10 둥둥이배너 chasu : 1 ~ 3 -->\r\n        <!-- <div ng-if="kShopUI.dispNo == \'5558814\'">\r\n            <dungdung id="ddpop" start="201612301000" end="201612310000"></dungdung>\r\n        </div> -->\r\n        <!-- //main content -->\r\n\r\n        <!-- main link -->\r\n        <div class="kshop_s_banner" ng-if="mainData.topHtml!=\'\'" ng-bind-html="mainData.topHtml"></div>\r\n        <!-- //main link -->\r\n    </section>\r\n    <!-- // normal spec_mall 영역 -->\r\n</section>\r\n'),a.put("/lotte/resources_dev/mall/spec_mall_cate.html",'<div class="smcCateContainer">\r\n	\r\n	<!-- 메인 페이지 카테고리 -->\r\n	<div class="smcCateMain" ng-class="{spec_mkc:kShopUI.type == \'mk_template\'}" ng-if="smcCateType==\'main\'">\r\n		<!-- 아이콘 슬라이드형 -->\r\n		<div class="smcIconType cnt{{smcCateList.length}}" ng-if="smcListType==\'icon\'">\r\n			<div lotte-slider>\r\n				<ul style="width:{{smcCateWidth*smcCateList.length}}px">\r\n					<li ng-repeat="cate in smcCateList track by $index" style="width:{{smcCateWidth}}px">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>\r\n							<span style="background-image:url({{cate.img_url}})" class="img"></span>\r\n							<span class="txt">{{cate.name}}</span>\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		\r\n		<!-- 리스트형 -->\r\n		<div class="smcListType" ng-if="smcListType==\'list\'">\r\n			<!-- 6개 미만 -->\r\n			<div ng-if="smcCateList.length <= 6">\r\n				<ul>\r\n					<li ng-repeat="cate in smcCateList track by $index">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>{{cate.name}}</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<!-- 6개 이상 -->\r\n			<div ng-if="smcCateList.length > 6">\r\n				<ul ng-if="smcListMore==false">\r\n					<li ng-repeat="cate in smcCateList | limitTo:5">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>{{cate.name}}</a>\r\n					</li>\r\n					<li class="more">\r\n						<a ng-click="smcCateListShowMore()">더보기</a>\r\n					</li>\r\n				</ul>\r\n				<ul ng-if="smcListMore==true">\r\n					<li ng-repeat="cate in smcCateList track by $index">\r\n						<a ng-href="{{smcGetSubUrl1(cate)}}" ng-link3d-touch>{{cate.name}}</a>\r\n					</li>\r\n					<!-- <li class="more">\r\n						<a>더보기</a>\r\n					</li> -->\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		\r\n		<!-- 20180607 마이클코어스 2단 카테고리 형 -->\r\n		<div class="smcDepthType cnt{{smcCateList.length}}" ng-if="smcListType==\'depth\'">\r\n			<div class="depthWrap" lotte-slider>\r\n				<ul class="smcCateUl">\r\n					<li ng-repeat="cate in smcCateList track by $index" class="dpList">\r\n						<a href="#" ng-click="subCateShow($index)" ng-link3d-touch><span ng-class="{on:mainSubCateNo == $index}">{{cate.name}}</span></a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<div class="sub_cate_wrap" ng-if="subShow">\r\n				<div class="sub_cate_inWrap">\r\n					<ul>\r\n						<li ng-repeat="cate2 in smcCateList[mainSubCateNo].sctgs track by $index">\r\n							<a href="#" ng-href="{{smcGetSubUrl2(cate2)}}" ng-link3d-touch>{{cate2.name}}</a>\r\n						</li>\r\n					</ul>\r\n					<span class="closeSubCate" ng-click="subCateClose();">닫기</span>\r\n				</div>\r\n			</div>\r\n			<div class="sub_dimm" ng-if="subShow" ng-click="subCateClose();"></div>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 서브 페이지 카테고리 -->\r\n	<div class="smcSubCate" ng-if="smcCateType==\'sub\'">\r\n		<div class="smcNavigator cd{{smcSubNaviList.currentDepth}}" ng-class="{open:smcSubNaviList.visible,d0:smcSubNaviList.depth==0,d1:smcSubNaviList.depth==1,d2:smcSubNaviList.depth==2}">\r\n			<div class="navi d{{$index}}" ng-repeat="cate in smcSubIndicator track by $index">\r\n				<a ng-click="smcShowSubNavi(cate, $index)"><span>{{cate.name}}</span></a>\r\n			</div>\r\n		</div>\r\n		<div class="smcSubNavi" ng-if="smcSubNaviList.visible">\r\n			<div class="smcSubNaviList">\r\n				<ul lotte-ng-list-swipe swipe-id="smcSubNaviSwipe" swipe-list-model="smcSubNaviList.list" swipe-slide-item="true"\r\n					swipe-max-ratio="0.2" swipe-min-distance="40" swipe-responsive="true" swipe-responsive320="1" swipe-responsive640="1">\r\n					<li ng-repeat="item in smcSubNaviList.list track by $index">\r\n						<a ng-repeat="ctg in item track by $index" ng-href={{smcGetNaviUrl(ctg)}} ng-link3d-touch\r\n							ng-class="{on:\r\n								(smcSubNaviList.depth==0 && smcSubIndicator[0].ctg_no==ctg.ctg_no)\r\n								|| (smcSubNaviList.depth==1 && smcSubIndicator[1].ctg_no==ctg.ctg_no)\r\n								|| (smcSubNaviList.depth==2 && smcSubIndicator[2].ctg_no==ctg.ctg_no)\r\n							}">{{ctg.name}}</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<div class="smcSubNaviIndi">\r\n				<ul ng-if="smcSubNaviList.list.length > 1">\r\n					<li ng-repeat="item in smcSubNaviList.list track by $index" ng-class="{on:$index==swipeIdx}">{{$index}}</li>\r\n				</ul>\r\n				<a class="close" ng-click="smcHideSubNavi()">닫기</a>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	\r\n</div>'),a.put("/lotte/resources_dev/mall/michaelkors/spec_michaelkors_main.html",'<section class="mk_mall_wrap">\r\n    <!-- Top Banner area -->\r\n    <div class="top_banner_area" ng-if="MkMallmain.mkTopBanner && MkMallmain.mkTopBanner.imgUrl">\r\n        <a href="#" ng-click="goMkLink(MkMallmain.mkTopBanner,\'Ban_main\')" ng-link3d-touch>\r\n           <img ng-src="{{MkMallmain.mkTopBanner.imgUrl}}" alt="" />\r\n        </a>\r\n    </div>\r\n    <!-- // Top Banner area -->\r\n    <!-- Text Banner area-->\r\n    <div class="title_area" ng-if="MkMallmain.mkTitle.text1">\r\n        <dl>\r\n            <dt class="text_01"><a href="#" ng-click="goMkLink(MkMallmain.mkTitle,\'Title_\',1)" ng-link3d-touch>{{MkMallmain.mkTitle.text1}}</a></dt>\r\n            <dd class="text_02" ng-if="MkMallmain.mkTitle.text2">\r\n                <a href="#" ng-click="goMkLink(MkMallmain.mkTitle,\'Title_\',2)" ng-link3d-touch>{{MkMallmain.mkTitle.text2}}</a>\r\n            </dd>\r\n            <dd class="text_03" ng-if="MkMallmain.mkTitle.text3">\r\n                <a href="#" ng-click="goMkLink(MkMallmain.mkTitle,\'Title_\',3)" ng-link3d-touch>{{MkMallmain.mkTitle.text3}}</a>\r\n            </dd>\r\n        </dl>\r\n    </div>\r\n    <!-- // Text Banner area-->\r\n    <!-- Inventory Banner area (01~04) -->\r\n    <div class="inventory_wrap_top" ng-if="MkMallmain.mkInventoryTop && MkMallmain.mkInventoryTop.length > 0">\r\n        <ul class="invent_top_list">\r\n            <li ng-repeat="topItem in MkMallmain.mkInventoryTop" ng-if="topItem.imgUrl && topItem.linkUrl">\r\n                <div class="invent_img_wrap">\r\n                    <a href="#" ng-click="goMkLink(topItem,\'Ban0\' +($index+1))" ng-link3d-touch>\r\n                        <img ng-src="{{topItem.imgUrl}}" alt="" />\r\n                    </a>\r\n                </div>\r\n                <div class="invent_cont_wrap">\r\n                    <p class="inv_text1" ng-if="topItem.text1">\r\n                       <a href="#" ng-click="goMkLink(topItem,\'Txt0\'+($index+1)+\'_\',1)" ng-link3d-touch>{{topItem.text1}}</a>\r\n                    </p>\r\n                    <p class="inv_text2" ng-if="topItem.text2">\r\n                       <a href="#" ng-click="goMkLink(topItem,\'Txt0\'+($index+1)+\'_\',2)" ng-link3d-touch>{{topItem.text2}}</a>\r\n                    </p>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <!-- // Inventory Banner area (01~04) -->\r\n    <!-- Inventory Banner area (05~07) -->\r\n    <div class="inventory_wrap_btm" ng-if="MkMallmain.mkInventoryBtm && MkMallmain.mkInventoryBtm.length > 0">\r\n        <ul class="invent_btm_list">\r\n            <li ng-repeat="btmItem in MkMallmain.mkInventoryBtm" ng-if="btmItem.imgUrl && btmItem.linkUrl">\r\n                <div class="invent_img_wrap">\r\n                    <a href="#" ng-click="goMkLink(btmItem,\'Ban0\'+ (startIdx + ($index + 1)))" ng-link3d-touch>\r\n                        <img ng-src="{{btmItem.imgUrl}}" alt="" />\r\n                    </a>\r\n                </div>\r\n                <div class="invent_cont_wrap_all">\r\n                    <div class="invent_cont_wrap">\r\n                        <p class="inv_text1" ng-if="btmItem.text1">\r\n                           <a href="#" ng-click="goMkLink(btmItem,\'Txt0\'+(startIdx + ($index + 1))+\'_\', 1)" ng-link3d-touch>{{btmItem.text1}}</a>\r\n                        </p>\r\n                        <p class="inv_text2" ng-if="btmItem.text2">\r\n                           <a href="#" ng-click="goMkLink(btmItem,\'Txt0\'+(startIdx + ($index + 1))+\'_\', 2)" ng-link3d-touch>{{btmItem.text2}}</a>\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <!-- // Inventory Banner area (05~07) -->\r\n</section>')}]);