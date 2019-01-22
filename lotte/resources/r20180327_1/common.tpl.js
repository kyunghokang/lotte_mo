angular.module("lotteComm").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/layout/header_2018.html",'<section ng-show="!hideLotteHeaderFlag">\r\n	<div app-down-bnr ng-if="appDownBnrFlag"></div>\r\n	<header class="sub_header_top_wrap" ng-show="!appObj.isNativeHeader" id="lotteHeader">\r\n		<div class="inner_wrap" ng-class="{headerFixed: headerFixed}">\r\n			<!-- 햄버거 메뉴/ 로고/검색/ 장바구니 -->\r\n			<h1 class="logo" ng-class="{hideBack:hideHeaderBack}"><button ng-click="gotoMainHeader()" class="btn_main">LOTTE.COM</button></h1>\r\n\r\n			<button ng-if="!hideHeaderBack" ng-click="gotoPrepage()" class="btn_prev">이전</button>\r\n			<!-- 검색창 (음성검색/스타일 추천) -->\r\n			<div class="header_srh_wrap" ng-class="{\r\n				web: !appObj.isApp,\r\n				app: appObj.isApp && speechSrhFlag && stylePushFlag && screenType >= 2,\r\n				app_speech_only: speechSrhFlag && !stylePushFlag && screenType >= 2,\r\n				app_stylesrh_only: !speechSrhFlag && stylePushFlag && screenType >= 2\r\n				}">\r\n				<div class="srh_box">\r\n					<label ng-click="showSrhLayerHeader()" for="keyword" class="btn_srh"></label>\r\n					<div ng-if="appObj.isApp && screenType >= 2" class="app_btn_area">\r\n						<!-- button ng-if="speechSrhFlag" ng-click="speechSrhLink()" class="btn_mic">음성검색</button>\r\n						<button ng-if="stylePushFlag" ng-click="stylePushLink()" class="btn_stylesrh" ng-class="{after_line: speechSrhFlag}">스타일 추천</button -->\r\n						<!--\r\n								<div ng-if="stylePushFlag && showStyleDesc" class="imgsrh_desc">\r\n									<i></i>\r\n									스타일도 검색해보세요\r\n									<button class="btn_close" ng-click="hideStylePushDesc()">닫기</button>\r\n								</div>\r\n								-->\r\n					</div>\r\n				</div>\r\n			</div>\r\n\r\n			<button ng-click="showSideCtgHeader()" class="btn_ctg" ng-class="{hideBack:hideHeaderBack}">카테고리<i ng-if="intTodayDate && intLastCtgFlagDate && intTodayDate < intLastCtgFlagDate" class="reddot"></i></button>\r\n			<button ng-click="gotoCart()" class="btn_cart">장바구니<i ng-if="cartCount && cartCount > 0" class="cnt">{{cartCount}}</i></button>\r\n			<div class="btn_super" ng-click="superMove()"><img ng-src="{{sub_site_move}}" alt="" /></div>\r\n		</div>\r\n	</header>\r\n	<!--<section id="headerSpace" ng-style="!appObj.isNativeHeader ? {\'padding-top\':\'48px\'}:{}"></section>-->\r\n</section>'),a.put("/lotte/resources_dev/layout/sub_header_2017.html",'<section>\r\n	<div class="sub_header_wrap">\r\n		<header id="head_sub" ng-show="subTitle" class="fixedSubHeader" ng-class="{wine: screenData.isWine && !screenData.isComm, fixedHeader: fixedHeader && subHeaderFixed && !appObj.isNativeHeader}">\r\n			<h2 ng-class="{search:searchCntTxt}" class="{{addCls}}">\r\n				<!--<span ng-if="kShopUI.dispNo != \'5558814\'">\r\n					<span class="title" ng-bind="subTitle" ></span>\r\n					<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n				</span>\r\n				<span ng-if="kShopUI.dispNo == \'5558814\'">\r\n					<style>#head_sub h2 a.noAfter:after{display:none}</style>\r\n					<a ng-href="/mall/spec_mall.do?{{baseParam}}&dispNo=5558814#/" class="noAfter">\r\n					<span class="title" ng-bind="subTitle" ></span>\r\n					<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n					</a>\r\n				</span>-->\r\n\r\n				<!-- 전문관 로고 클릭 시, 홈이동 -->\r\n				<span ng-if="specHeadLogoLink(subTitle)!=\'\' && !isBrandProdList">\r\n					<style>#head_sub h2 a.noAfter:after{display:none}</style>\r\n					<a ng-href="{{specHeadLogoLink(subTitle)}}" class="noAfter">\r\n						<span class="title" ng-bind="subTitle" ></span>\r\n						<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n					</a>\r\n				</span>\r\n				<span ng-if="specHeadLogoLink(subTitle)==\'\' && !isBrandProdList">\r\n					<span class="title" ng-bind="subTitle" ></span>\r\n					<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n				</span>\r\n				<span ng-if="specHeadLogoLink(subTitle)==\'\' && isBrandProdList">\r\n					<a ng-click="brandSelectAll()">\r\n						<span class="title" ng-bind="subTitle" ></span>\r\n						<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n					</a>\r\n				</span>\r\n				<span ng-if="specHeadLogoLink(subTitle)!=\'\' && isBrandProdList">\r\n					<a ng-click="brandSelectAll()">\r\n						<span class="title" ng-bind="subTitle" ></span>\r\n						<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n					</a>\r\n				</span>\r\n\r\n			</h2>\r\n			<p class="prev {{addCls}}" ng-if="isShowBack">\r\n				<a ng-click="gotoPrepage()">이전</a>\r\n			</p>\r\n			<p class="this" ng-if="isShowThisSns">\r\n				<!-- 2017.02.17 공유하기 수정 -->\r\n				<a ng-if="planShopSns == undefined" ng-click="showSharePop()">공유</a>\r\n				<a ng-if="planShopSns == true && !hasSharePreFunc" ng-click="showSharePop({shareImg:share_img})">공유</a>\r\n				<a ng-if="planShopSns == true && hasSharePreFunc" ng-click="showSharePopPre()">공유</a><!-- 2017.09.21 공유하기 전처리 함수가 있는 경우 -->\r\n			</p>\r\n			<p class="this type2" ng-if="orderSgl">\r\n		      <a href="#" onclick="normalOrd();" class="lpoint_btn3">일반 주문결제</a>\r\n		  	</p>\r\n			<div class="introduce_comment_wrap" id="disappear" ng-if="orderSgl">\r\n				<p class="introduce_comment">고객님의 쇼핑패턴에 최적화된 빠른 결제용 주문서입니다</p>\r\n			</div>\r\n			<div class="this camera" ng-if="showHeaderCamera">\r\n				<span class="btn"></span>\r\n				<input \r\n				 id="file_input"\r\n		         type=\'file\'\r\n		         ng-click="sendTclick(\'m_DC_\' + screenID + \'_clk_camera\')"\r\n		         onchange="angular.element(this).scope().detectFile(this)" \r\n		         accept="image/*"/>\r\n			</div>\r\n		</header>\r\n		<!--<section id="subHeaderSpace" style="padding-top:47px;"></section>-->\r\n	</div>\r\n</section>\r\n'),a.put("/lotte/resources_dev/layout/sub_header_search_2017.html",'<header id="head_sub" class="subTitleSearch" ng-class="{wine: screenData.isWine && !screenData.isComm, fixed: subHeaderFixed}"><!--  ng-show="subTitle" -->\r\n\r\n	<!-- <h2 ng-class="{search:searchCntTxt}" class="{{addCls}}">\r\n		<span>\r\n			<span class="title" ng-bind="subTitle" ></span>\r\n			<em ng-if="searchCntTxt" class="fixed_txt" ng-bind="searchCntTxt"></em>\r\n		</span>\r\n	</h2> -->\r\n	<div class="search_area">\r\n		<label for="keyword" ng-click="showSrhLayerHeader()">\r\n			<div lotte-slider class="keywords" id="searchKeywordSlider">\r\n				<div onclick="event.stopPropagation()">\r\n					<span ng-bind-html="getSearchKeyword()"></span>\r\n					<span class="include" ng-repeat="item in postParams.reQuery track by $index" ng-click="deleteRequeryKeyword(item)">{{item}}</span>\r\n				</div>\r\n			</div>\r\n		</label>\r\n		<label for="keyword" class="clearAll" ng-click="showSrhLayerHeader(true)">삭제</label>\r\n	</div>\r\n	<p class="prev {{addCls}}">\r\n		<a ng-click="gotoPrepage()">이전</a>\r\n	</p>\r\n	<!-- <p class="this" ng-if="isShowThisSns">\r\n		<a ng-click="showSharePop()">공유</a>\r\n	</p> -->\r\n</header>'),a.put("/lotte/resources_dev/layer/layer_search_2017.html",'<section class="searchLayerContainer">\r\n<section id="feSrhLayer" ng-show="showSrh" ng-class="{on:showSrh, wider:screenType>=2}">\r\n    <form id="searchForm" novalidate name="searchForm" action="{{srhUrl}}" ng-submit="submitSearch($event)">\r\n    <fieldset>\r\n        <legend class="blind">키워드 검색</legend>\r\n        <input type="hidden" ng-model="c" name="c" value="{{fnSrhParam(\'c\')}}" />\r\n        <input type="hidden" ng-model="udid" name="udid" value="{{fnSrhParam(\'udid\')}}" />\r\n        <input type="hidden" ng-model="v" name="v" value="{{fnSrhParam(\'v\')}}" />\r\n        <input type="hidden" ng-model="cn" name="cn" value="{{fnSrhParam(\'cn\')}}" />\r\n        <input type="hidden" ng-model="cdn" name="cdn" value="{{fnSrhParam(\'cdn\')}}" />\r\n        <input type="hidden" ng-model="schema" name="schema" value="{{fnSrhParam(\'schema\')}}" />\r\n        <input type="hidden" ng-model="dpml_no" name="dpml_no" value="1"/>\r\n        <input type="hidden" ng-model="type" name="type" value=""/>\r\n        <input type="hidden" ng-model="dispCnt" name="dispCnt" value="30"/>\r\n        <input type="hidden" ng-model="reqType" name="reqType" value="N"/>\r\n        <input type="hidden" ng-model="reqKind" name="reqKind" value="C"/>\r\n        <input type="hidden" ng-model="tclick" name="tclick" value="{{tclick}}"/>\r\n            <section class="srh_layer">\r\n                <div class="srh_wrap">\r\n                    <div class="srh_ipt">\r\n                        <input type="search" srh-focus="showSrh" ng-model="keyword" name="keyword" id="keyword" placeholder="검색어를 입력하세요" autocomplete="off" autocapitalize="off" autocorrect="off" required speech x-webkit-speech\r\n                        	ng-keyup="showAutoSrh($event)" ng-focus="showAutoSrhFocus()" />\r\n                    </div>\r\n                    <label ng-click="delSrhText()" ng-show="isAutoSrhingClear" class="btn_del" for="keyword">검색어 삭제</label>\r\n                    <a ng-click="submitSearch($event)" class="btn_srh">검색</a>\r\n                    <!-- 이전버튼 추가 ckh -->\r\n                    <p class="prev {{addCls}}">\r\n                        <a ng-click="closeSrhLayor(\'tclick\')">이전</a>\r\n                    </p>\r\n                    <!-- //이전버튼 추가 ckh -->\r\n                </div>\r\n\r\n                <div class="srh_custom">\r\n                	<a ng-click="customSearchPage()"><span><b>맞춤설정</b></span></a><!-- //텍스트 변경 ckh -->\r\n                	<a ng-click="goStyleIntro()" class="camera {{\'camera_cnt_\' + headerStyleRecomIcoCnt}}"><span><b>스타일 추천</b></span></a>\r\n                </div>\r\n\r\n				<!--검색어 탭-->\r\n                <!-- <div class="nsh_tab" ng-show="!isAutoSrhing">\r\n                    <a ng-click="sendTclick(tClickBase + \'SrhLayer_Clk_tap_1\');searchLayerTabIdx = 0" class="nsh_tab_a" ng-class="{on:searchLayerTabIdx==0}">최근검색어</a>\r\n                    <a ng-click="sendTclick(tClickBase + \'SrhLayer_Clk_tap_2\');searchLayerTabIdx = 1" class="nsh_tab_a" ng-class="{on:searchLayerTabIdx==1}">인기</a>\r\n                    <a ng-click="sendTclick(tClickBase + \'SrhLayer_Clk_tap_3\');searchLayerTabIdx = 2" class="nsh_tab_a" ng-class="{on:searchLayerTabIdx==2}">급상승</a>\r\n                </div> -->\r\n\r\n\r\n                <div class="nsh_cont" ng-show="!isAutoSrhing">\r\n	                <div class="nsh_indicator">\r\n	                	<span ng-repeat="item in [0, 1, 2] track by $index" ng-class="{on:searchLayerTabIdx==item}" ng-click="searchLayerTabSelect(item);sendTclick(tClickBase + \'SrhLayer_Swp_pg0\' + (item+1))"></span>\r\n	                </div>\r\n                   <div class="brlistBox">\r\n                       <ul class="brlist nsh_ang" rn-carousel rn-carousel-index="searchLayerTabIdx" rn-carousel-duration="100">\r\n                           <li class="nsh_li">\r\n                                <!-- 최근 검색어 목록 -->\r\n                                <div class="nsh_title">최근 검색어</div>\r\n                                <div class="nsh_div srh_recent" ng-class="{empty:recentKwData==undefined || recentKwData.length==0}">\r\n                                    <ol>\r\n                                        <li ng-repeat="(key, item) in recentKwData" ng-if="recentKwData">\r\n                                            <a ng-href="{{getSearchListUrl(item, \'m_RDC_SrhLayer_ClkW_Rst_A\')}}" onclick="return false;"\r\n                                            	ng-click="researchRecentKeyword($event, \'m_RDC_SrhLayer_ClkW_Rst_A\')" class="word"><em>{{item.keytxt}}</em><span>{{item.date}}</span></a>\r\n                                            <a ng-click="delRecentOneKeyword(key)" class="del">최근 검색어 삭제</a>\r\n                                        </li>\r\n                                        <!-- <li ng-show="recentKwData==undefined || recentKwData.length==0" class="none">최근 검색한 기록이 없습니다.</li> -->\r\n                                    </ol>\r\n                                </div>\r\n                                <div class="nsh_btns">\r\n                                	<a class="left"  ng-click="delRecentAllKeyword()">전체 삭제</a>\r\n                                	<a class="right" ng-click="closeSrhLayor(\'tclick\')">취소</a>\r\n                                </div>\r\n                           </li>\r\n                            <li class="nsh_li nsh_popular">\r\n                                <!-- 인기 검색어 목록 -->\r\n                                <div class="nsh_title">인기 검색어</div>\r\n                                <div class="nsh_div" id="nsh_best">\r\n                                    <ol>\r\n                                        <li ng-repeat="item in srhBestData.result_best.items">\r\n                                            <a style="background-image:url({{item.img_url}});" class="word"\r\n                                            	ng-click="searchBestKeyword(\'{{item.hkeyword}}\', \'m_RDC_SrhLayer_ClkW_Rst_B_m_RDC_SrhLayer_ClkW_Rst_B_\'+ numberFill(($index+1),2))">\r\n                                            	<span>{{$index + 1}}. {{item.hkeyword}}</span>\r\n                                            </a>\r\n                                        </li><!-- fn_goSearch -->\r\n\r\n                                    </ol>\r\n                                </div>\r\n                                <div class="nsh_btns">\r\n                                	<a class="right" ng-click="closeSrhLayor(\'tclick\')">취소</a>\r\n                                </div>\r\n                            </li>\r\n                            <li class="nsh_li nsh_lately" ng-class="{editing:latelyGoodsEditing}">\r\n                                <!-- 최근본상품 -->\r\n                                <div class="nsh_title">최근 본 상품</div>\r\n                                <div class="nsh_div" id="nsh_speed" ng-class="{empty:latelyGoodsList.length==0}">\r\n                                    <ol>\r\n                                    	<li ng-repeat="item in latelyGoodsList track by $index">\r\n                                    		<div style="-webkit-transition-delay:{{$index*0.02}}s; transition-delay:{{$index*0.1}}s;">\r\n	                                    		<a ng-href="{{getProductViewUrl(item, \'m_RDC_SrhLayer_ClkW_Rst_D\', true)}}" onclick="return false;" ng-click="productView(item, \'\', \'\', \'m_RDC_SrhLayer_ClkW_Rst_D\')" class="prod">\r\n	                                    			<span class="img"><img ng-src="{{item.img_url}}" /></span>\r\n	                                    			<span class="name"><em ng-if="item.brand_nm">{{item.brand_nm}}</em>{{item.goods_nm}}</span>\r\n	                                    			<span class="price" ng-class="{plan:item.is_plan_prod}">{{item.sale_price | number}}</span>\r\n	                                    		</a>\r\n	                                    		<a class="del" ng-click="delLatelyGoods(item)">삭제</a>\r\n                                    		</div>\r\n                                    	</li>\r\n                                    </ol>\r\n                                </div>\r\n                                <div class="nsh_btns">\r\n                                	<a class="left"  ng-click="editLatelyGoods()"></a>\r\n                                	<a class="right" ng-click="closeSrhLayor(\'tclick\')">취소</a>\r\n                                </div>\r\n                            </li>\r\n                       </ul>\r\n                    </div>\r\n                </div>\r\n\r\n               <!-- 자동완성 -->\r\n                <div class="srh_auto" ng-show="isAutoSrhing">\r\n                    <ol>\r\n                        <li ng-repeat="item in srhAutoData">\r\n                            <a ng-href="{{getSearchListUrl(item, \'M_Search_Autocomplete_Web\')}}" onclick="return false;"\r\n                            	ng-click="goAutoSrh(\'{{$index}}\', \'&tclick=M_Search_Autocomplete_Web\')" class="kword" ng-if="item.type" ng-bind-html="item.keyword"></a>\r\n                            <div ng-click="searchSet(\'{{$index}}\');" class="arrowkey" ng-if="item.type"></div>\r\n                            <a ng-href="{{getSearchListUrl(item, \'M_Search_Autocomplete_Web\')}}" onclick="return false;"\r\n                            	ng-click="goAutoSrh(\'{{$index}}\', \'&tclick=M_Search_Autocomplete_Web&cateNo={{item.cateNum}}\')" class="categoryWord" ng-if="!item.type">{{item.cateStr}}</a>\r\n                        </li>\r\n                    </ol>\r\n                </div>\r\n\r\n                <!-- <div class="srh_bar" ng-if="isAutoSrhing">\r\n                    <div class="barInfo" ng-show="searchLayerTabIdx != 0 || isAutoSrhing">\r\n                        <div class="bestInfo" ng-show="isAutoSrhing">버튼 터치하면 검색어를 수정할 수 있습니다.</div>\r\n                    </div>\r\n                    <a ng-click="closeSrhLayor(\'tclick\')" class="close">닫기</a>\r\n                </div> -->\r\n            </section>\r\n            <!--<section ly-cover class="srh_cover" ng-click="closeSrhLayor()"></section>-->\r\n    </fieldset>\r\n</form>\r\n</section>\r\n<custom-search></custom-search>\r\n</section>'),a.put("/lotte/resources_dev/layout/footer.html",'<footer id="footer">\r\n	<div class="footerNoti" ng-if="mainNotice.total_count > 0">\r\n        <a ng-click="noticeListUrl(item.bbc_no)" ng-repeat="item in mainNotice.items">{{item.bbc_tit_nm}}</a>\r\n    </div>\r\n	<div class="directOn no"  ng-click="fnDirectBoxOpen()"><i>바로방문ON</i></div>\r\n	<div class="directOff" ng-class="{no:mainNotice.total_count == 0}" ng-if="cookieVisitchk == \'N\'" ng-click="fnDirectBoxOpen()"><i>바로방문OFF</i></div>\r\n	<div class="directPop" ng-class="{on:vDirectBoxDispYn}">\r\n		<div class="directPopInner">\r\n			<div class="dTitle">바로방문</div>\r\n			<div class="dCont">\r\n				<div class="chkOn">롯데닷컴에 오시면<br>언제나 바로방문ON을 확인하세요!</div>\r\n				<ul class="dInfo1">\r\n					<li>바로방문 OFF일 경우 바로방문ON혜택(쿠폰사용, 구매사은 신청등) 제공에 제한이 있을 수 있습니다.</li>\r\n					<li>APP에서 바로방문ON이 표시되지 않으면 <span>APP을 종료한 후</span> 재 실행해 주시면 정상적으로 표시 됩니다. </li>\r\n				</ul>\r\n				<div class="dTitle2">APP 종료 방법</div>\r\n				<dl>\r\n					<dt>IOS</dt>\r\n					<dd>홈버튼을 2번 누르고 실행중인 앱을 위로 끌어올려 주시면 종료됩니다.</dd>\r\n				</dl>\r\n				<dl class="android">\r\n					<dt>Android</dt>\r\n					<dd>BACK키를 2회이상 연속으로 터치해 주시면 종료됩니다.</dd>\r\n				</dl>\r\n			</div>\r\n			<a ng-click="fnDirectBoxClose()" class="dClose">닫기</a>\r\n		</div>\r\n	</div>\r\n    <ul class="menu01">\r\n		<li><a ng-href="{{footLink_mylotte}}">{{footTxt_mylotte}}</a><i></i></li> \r\n        <li><a ng-click="pcClick()">PC버전</a><i></i></li>\r\n        <li><a ng-href="{{footTxtUrl3}}">장바구니</a><i></i></li>\r\n        <li><a ng-href="{{footTxtUrl4}}">고객센터</a><i></i></li>\r\n        <li>\r\n            <a href="#" ng-click="loginProc()" ng-bind="(loginInfo.isLogin)?\'로그아웃\':\'로그인\'"></a>\r\n        </li>\r\n    </ul>\r\n    <div class="info">\r\n        <ul class="menu02">\r\n            <li><strong>(주)롯데닷컴</strong></li>\r\n            <li><a ng-click="companyClick()">회사소개</a></li>\r\n            <li><a ng-click="ftcClick()">사업자정보확인</a></li>\r\n            <li><a ng-click="forwardClick()">채무지급보증안내</a></li>\r\n        </ul>\r\n        <p class="add">\r\n            <span class="addFirst">대표이사 : 김경호 </span>\r\n            <span class="line">서울시 중구 을지로 158 10층(을지로4가, 삼풍빌딩)</span>\r\n            <span class="line">사업자등록번호 : 101-81-52964 통신판매업신고 : 중구 제00402호</span>\r\n            <span class="line">고객만족센터 : <a href="tel:1577-1110">1577-1110</a>  webmaster@lotte.com</span><br/>\r\n			<span class="line">개인정보보호책임자 : 윤상선</span> <span class="line">청소년보호책임자 : 김찬기</span><br/>\r\n            <span>호스팅 사업자 : (주)롯데닷컴</span>\r\n        </p>\r\n    </div>\r\n    <div class="menu03">\r\n        <ul>\r\n            <li><a ng-href="{{agreeUrl}}">이용약관</a></li>\r\n            <li><a ng-href="{{privacyUrl}}"><strong>개인정보처리방침</strong></a></li>\r\n            <li><a ng-href="{{protectYouthUrl}}">청소년보호정책</a></li>\r\n            <li ng-if="appObj.isApp"><a ng-click="infoAppAlarm()">앱알림 설정안내</a></li>\r\n        </ul>\r\n    </div>\r\n    <div class="capyright">Copyright © LOTTE.com, Inc. All rights Reserved.</div>\r\n    <div class="footerLogo">\r\n    	<ul>\r\n    		<!--<li class="f_logo"><img src="http://image.lotte.com/lotte/mo2017/common/f_logo.png" alt="LOTTE.com" /></li> -->\r\n    		<li class="f_txt"><img src="http://image.lotte.com/lotte/mo2017/common/f_txt_renewer.png" alt="미 같이의 가치를 추구합니다." /></li>\r\n    	</ul>\r\n    </div>\r\n\r\n    <div ng-if="stgServerChk && stgServerMonitor" class="web_toast">\r\n        테스트용입니다. (결함아님)<br />\r\n        URL : {{testLocation}}<br />\r\n        curDispNo : {{testCurDispNo}}<br />\r\n        curDispStcCD : {{testCurDispStcCD}}<br />\r\n        tclick : {{testTclick}}<br />\r\n        cn (채널값) : {{testCn}}<br />\r\n        cdn (채널상세값) : {{testCdn}}\r\n        <button ng-click="closeStgServerMonitor()">닫기</button>\r\n    </div>\r\n    <keep-popup></keep-popup>\r\n    <!--ADPNUT SCRIPT-->\r\n    <iframe src="//tag.adpnut.com/prd/view?shopid=lotte17" width="0" height="0" frameborder="0"></iframe>\r\n</footer>\r\n'),a.put("/lotte/resources_dev/layout/lotte_sidectg_2017_1.html",'<div class="left_nav_wrap" ng-class="{on: isShowSideCtg}">\r\n	<!-- 헤더 -->\r\n	<div class="header_wrap">\r\n		<h1 class="logo"><button ng-click="closeSideCtg()" class="btn_logo">LOTTE.COM</button></h1>\r\n		<button ng-click="closeSideCtg()" class="btn_close">탐색레이어 닫기</button>\r\n	</div>\r\n\r\n	<!-- 카테고리 -->\r\n	<div lnb-category class="ctg_wrap">\r\n		<section class="ctg_list_wrap">\r\n			<h3 class="tit">카테고리</h3>\r\n			<ul class="ctg_list">\r\n				<li ng-repeat="item in sideCtgData.ctgAll track by $index" class="depth1 {{item.type}}" ng-class="{on: pageOpt.curCtgDepth1Idx == $index,\r\n				 prev: pageOpt.curCtgDepth1Idx-1 == $index}">\r\n					<a ng-if="item.type == \'mall\' || item.type == \'depart\'" ng-click="ctgSelect($index)">\r\n						<span class="img_wrap">\r\n							<img ng-show="pageOpt.curCtgDepth1Idx != $index" ng-src="{{item.iconImgUrl_off}}">\r\n							<img ng-show="pageOpt.curCtgDepth1Idx == $index" ng-src="{{item.iconImgUrl}}">\r\n						</span>\r\n						<span ng-if="item.type != \'depart\'" class="tit">{{item.name}}</span>\r\n						<span ng-if="item.type == \'depart\'" ng-show="pageOpt.curCtgDepth1Idx != $index" class="tit"><img ng-src="{{sideCtgData.departImgUrl_off}}" /></span>\r\n						<span ng-if="item.type == \'depart\'" ng-show="pageOpt.curCtgDepth1Idx == $index" class="tit"><img ng-src="{{sideCtgData.departImgUrl}}" /></span>\r\n					</a>\r\n					<a ng-if="item.type != \'mall\' && item.type != \'depart\'" ng-click="ctgSelect($index)" class="{{item.type}}">\r\n						<span class="img_wrap"><img ng-src="{{item.iconImgUrl}}"></span>\r\n						<span class="tit">{{item.name}}</span>\r\n					</a>\r\n					<ul class="sub_list" ng-style="{\'height\': pageOpt.curCtgDepth1Idx == $index ? pageOpt.subListHeight+\'px\' : 0}">\r\n						<li ng-repeat="subItem in item.lctgs track by $index" class="depth2">\r\n							<a ng-if="subItem.name" ng-click="goCategory(subItem.type, item.type || \'normal\', item.name, subItem.name, subItem.link, subItem.outlink)">\r\n								<span ng-if="subItem.name.indexOf(\'Dear Pet\') > -1" class="dearpetOpenicon">\r\n								</span>{{subItem.name}} \r\n								<span ng-if="subItem.desc" class="desc">{{subItem.desc}}</span>\r\n								<span ng-if="subItem.flag" class="ctg_flag" style="color:#{{subItem.flagColor}}">{{subItem.flag}}</span>\r\n							</a>\r\n						</li>\r\n					</ul>\r\n				</li>\r\n			</ul>\r\n		</section>\r\n		<div class="mid_wrap">\r\n			<section class="brand_wrap">\r\n				<h3 class="tit">찾고 있는 브랜드 빠르게 검색하자</h3>\r\n				<div class="brand_search">\r\n					<a ng-click="goBrandSearch()">브랜드 검색</a>\r\n				</div>\r\n			</section>\r\n			<section ng-if="sideCtgData.specialStore && sideCtgData.specialStore.length > 0" class="recomm_list_wrap">\r\n				<h3 class="tit">롯데닷컴에서 추천하는 전문관</h3>\r\n				<div class="recomm_list swipeWrap">\r\n	                <ul lotte-ng-list-swipe \r\n	                	class="recommond_swipe"\r\n	                	swipe-id="ctgRecommSwipe" \r\n	                	swipe-slide-item="true" \r\n	                	swipe-list-model="sideCtgData.specialStore" \r\n	                	swipe-responsive="true" \r\n			        	swipe-autoheight="true" \r\n			        	swipe-responsive320="1" \r\n			        	swipe-responsive640="1" \r\n			        	swipe-responsive900="1" \r\n			        	swipe-slide-item="true" \r\n			        	swipe-max-ratio="0.2" \r\n			        	swipe-min-distance="40"  >\r\n	                    <li ng-repeat="items in sideCtgData.specialStore track by $index">\r\n			                <ul class="prd_type13 float_ul">\r\n			                    <li ng-repeat="item in items track by $index">\r\n			                        <a href="#" ng-click="goSpecialStore(item.linkUrl, item.tclick)">\r\n			                            <div class="imageCon" ng-class="{center : $index % 3 == 1, right : $index % 3 == 2}">\r\n			                                <img ng-src="{{item.iconImgUrl}}">\r\n			                            </div>\r\n			                        </a>\r\n			                    </li>\r\n			                </ul>\r\n		            	</li>\r\n	                </ul>\r\n	              </div>\r\n			</section>\r\n			<section class="app_list_wrap">\r\n				<h3 class="tit">롯데 패밀리 추천 앱</h3>\r\n				<ul class="app_list">\r\n					<li ng-repeat="item in sideCtgData.lotteApp track by $index">\r\n						<a ng-click="appLink(item.appName, item.linkUrl, item.tclick)" class="{{item.iconClass}}">\r\n							<img ng-src="{{item.iconImgUrl}}" alt="{{item.name}}">\r\n							<span class="name">{{item.name}}</span>\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</section>\r\n		</div>\r\n	</div>\r\n</div>'),a.put("/lotte/resources_dev/layout/actionbar_2018.html",'<section id="lotteActionbar" class="actionbar" ng-show="!appObj.isApp && !actionbarHideFlag">\r\n    <ul class="actionbar_wrap">\r\n        <li class="home" ng-class="{on:cur_pageid == 1 && !isShowSideCtg}"><button ng-click="gotoMainFooter()" class="btn_main">홈</button></li>\r\n        <li class="ctg" ng-class="{on: isShowSideCtg}"><button ng-click="showSideCtgFooter()" class="btn_ctg"><i ng-if="intTodayDate && intLastCtgFlagDate && intTodayDate < intLastCtgFlagDate" class="reddot"></i>카테고리</button></li>\r\n        <li class="order" ng-class="{on:cur_pageid == 2}"><button ng-click="gotoOrderLstFooter()" class="btn_order"><i ng-if="orderStateFlag" class="newOrderState">N</i>주문배송</button></li>\r\n        <li class="mylotte" ng-class="{on:cur_pageid == 3}"><button ng-click="gotoMyPageFooter()" class="btn_mylotte">마이롯데</button></li>\r\n        <li class="recent" ng-class="{on:cur_pageid == 5,active:latelyGoodsData}"><button class="btn_recent" ng-click="gotoLateProdFooter()">최근본상품<img ng-src="{{latelyGoodsData[0].img_url}}" ng-if="latelyGoodsData[0].img_url" /></button></li>\r\n    </ul>\r\n</section>'),a.put("/lotte/resources_dev/common/comm_footer.html",'<div>\r\n    <base-cover></base-cover>\r\n    <iframe id="tclick_iframe" src="" style="visibility: hidden; display: none;"></iframe>\r\n    <div class="bookmarListkLayer" style="display:none">\r\n        <input type="hidden" name="common_param" value="{{baseParam}}"/>\r\n        <input type="hidden" name="android_yn" ng-value="({{appObj.isAndroid}})?\'Y\':\'N\'"/>\r\n        <input type="hidden" name="app_yn" ng-value="({{appObj.isApp}})?\'Y\':\'N\'"/>\r\n        <input type="hidden" name="app_save" value="Y"/>\r\n        <input type="hidden" name="available" value="true"/>\r\n    </div>\r\n    <div id="storage_layer" style="display:none;position:absolute;z-index:999;width:100%;height:100%;">\r\n        <iframe id="storage_frame" name="storage_frame" style="display:none;border:none;background:#FFFFFF;width:100%;height:100%;" src="" height="0" scrolling="no"></iframe>\r\n    </div>\r\n</div>'),a.put("/lotte/resources_dev/sns/share_box.html",'<section>\r\n	<h5 ><!-- <i></i> -->{{snsTitle}}</h5>\r\n    <ul>\r\n       <li class="kakaotalk" ng-if="talkFlag" id="kakaotalk">\r\n           <a ng-click="shareSNS(\'kakaotalk\')"><i></i>카카오톡</a>\r\n       </li>  \r\n       <li class="twitter" ng-if="twitFlag">\r\n           <a ng-click="shareSNS(\'twitter\')"><i></i>트위터</a>\r\n       </li>\r\n       <li class="kakaostory" ng-if="stotyFlag">\r\n           <a ng-click="shareSNS(\'kakaostory\')"><i></i>카카오스토리</a>\r\n       </li>            \r\n       <li class="sms" ng-if="smsFlag">\r\n           <a ng-click="shareSNS(\'sms\')"><i></i>문자</a>\r\n       </li>\r\n       <li class="facebook" ng-if="faceFlag">\r\n           <a ng-click="shareSNS(\'facebook\')"><i></i>페이스북</a>\r\n       </li>     \r\n       <li ng-if="appObj.isApp && mailFlag" class="mail">\r\n           <a ng-click="shareSNS(\'mail\')"><i></i>메일</a>\r\n       </li>\r\n       <li class="urlcopy" ng-if="urlFlag" >\r\n           <a ng-click="shareSNS(\'url_copy\')" id="copyUrl"><i></i>URL 복사</a>\r\n       </li>       \r\n     \r\n    </ul>\r\n    <div ng-if="appFlag" class="share_app">\r\n    	<a ng-click="shareSNS(\'moreapp\')"><!-- <i></i> -->다른 앱으로 공유</a>\r\n    </div>\r\n    <div class="url_copy" ng-if="!appObj.isApp && urlCopyFlag">\r\n    	<span>URL</span>\r\n    	<!-- <input type="text" id="cnShareUrl" ng-value="cnShareUrl"> -->\r\n    	<a href="{{cnShareUrl}}" onclick="return false;" class="clipUrl">{{cnShareUrl}}</a>\r\n    </div>\r\n   	<div class="btn_close" ng-show="shareBoxVisible" ng-click="hideSharePop()">\r\n       <a href="">닫기</a>\r\n	</div>\r\n	\r\n</section>\r\n'),a.put("/lotte/resources_dev/sns/sms_box.html",'<div class="share_this">\r\n	<h5 ><i></i>친구에게 공유하기</h5>\r\n	<dl class="sms">\r\n	    <dt>휴대폰번호</dt>\r\n	    <dd>\r\n	        <input type="tel" name="sms_phoneNo" id="sms_phoneNo" ng-model="sms_phoneNo" ng-maxlength="11" class="txt01" placeholder="휴대폰번호 숫자만 입력해 주세요." numeric-only autofocus>\r\n	        <span>예) 01012345678</span>\r\n	    </dd>\r\n	    <dt>발송내용</dt>\r\n	    <dd class="txt" id="sms_msg">\r\n	        <p ng-bind-html="smsTxt"></p>\r\n	    </dd>\r\n	</dl>\r\n	<div class="btn01">\r\n	    <!-- <div> -->\r\n	        <a href="" ng-click="hideSharePop()" class="c_btn col05">\r\n	            <span>취소</span>\r\n	        </a>\r\n	    <!-- </div>\r\n	    <div> -->\r\n	        <a href="" ng-click="sendShareSMS()" class="c_btn col01">\r\n	            <span>문자전송</span>\r\n	        </a>\r\n	    <!-- </div> -->\r\n    </div>\r\n</div>'),a.put("/lotte/resources_dev/sns/share_pop.html",'<div id="sharePop" class="pop_sns" ng-show="sharePopVisible" ng-if="sharePopVisible" ng-class="{on:sharePopVisible}">\r\n	<share-box ng-show="shareBoxVisible"></share-box>\r\n	<sms-box ng-show="smsBoxVisible"></sms-box>\r\n</div>'),a.put("/lotte/resources_dev/layer/keep_popup.html",'<div id="keep_popup" ng-if="pop_type > 0" class="keep_popup" ng-class="{open:pop_type > 0}">\r\n   	<div class="pop_wrap">\r\n   		<h3><img ng-src="http://image.lotte.com/lotte/mobile/common/keep_pop_tit.png" alt="#"></h3>\r\n   		<div class="coupon_area">\r\n   			<img ng-src="{{keepCoupon.img_url_addr}}" alt="쿠폰 할인 정보">\r\n   			<a ng-click="keepLinkUrl(keepCoupon.coupon_no,\'couponDown\',\'m_DC_PausePop_clk_Btn01\')"><img ng-src="http://image.lotte.com/lotte/mobile/common/keep_pop_coupon_btn.jpg" alt="쿠폰 다운로드"></a>\r\n		</div>\r\n		<div class="cont_box" ng-if="pop_type == 1">\r\n			<h4><img ng-src="http://image.lotte.com/lotte/mobile/common/keep_pop_cont_tit01.jpg" alt="이 상품은 어떠세요?"></h4>\r\n			<div class="cont keepPrd">\r\n				<ul>\r\n					<li ng-repeat="item in keepPrdList">\r\n						<a ng-click="keepLinkUrl(item.goods_no,\'prdList\',\'m_DC_PausePop_clk_Prd{{$index+1}}\')">\r\n							<div class="keepPrdImg">\r\n								<img ng-src="{{item.img_url_addr}}" alt="#">\r\n							</div>\r\n							<div class="txt_box">\r\n								<p class="text" ng-bind-html="item.goods_nm"></p>\r\n								<p class="price"><strong>{{item.price | number}}</strong>원<em ng-if="item.isPlanPrd">~</em></p>\r\n							</div>\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		<div class="cont_box" ng-if="pop_type == 2">\r\n			<h4><img ng-src="http://image.lotte.com/lotte/mobile/common/keep_pop_cont_tit02.jpg" alt="추가 기획전"></h4>\r\n			<div class="cont keepSpdpList">\r\n				<ul>\r\n					<li ng-repeat="item in keepSpdpList">\r\n						<a ng-click="keepLinkUrl(item.spdp_no,\'planList\',\'m_DC_PausePop_clk_Ban{{$index+1}}\')">\r\n							<div class="keepPrdImg">\r\n								<img ng-src="{{item.img_url_addr}}" alt="#">\r\n							</div>\r\n							<div class="txt_box">\r\n								<p class="tit"><strong>{{item.conts_tit_nm}}</strong></p>\r\n								<p class="text" ng-bind-html="item.conts_desc_cont"></p>\r\n							</div>							\r\n						</a>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		<div class="cont_box" ng-if="pop_type == 3">\r\n			<h4><img ng-src="http://image.lotte.com/lotte/mobile/common/keep_pop_cont_tit03.jpg" alt="닷컴만의 추가혜택"></h4>\r\n			<div class="cont bnrType">\r\n				<a ng-click="keepLinkUrl(keepAddBanner.lnk_url_addr,\'baseLink\',\'m_DC_PausePop_clk_Ban03\')"><img ng-src="{{keepAddBanner.img_url_addr}}" alt="bnrImg"></a>\r\n			</div>\r\n		</div>\r\n   		<a ng-click="keepPopClose()"><img ng-src="http://image.lotte.com/lotte/mobile/common/keep_pop_close.png" alt="#"></a>\r\n   	</div>\r\n	<div id="msg" style="display: none">&nbsp;</div>\r\n    <style>\r\n        .keep_popup{position:fixed;top:0;left:0;width:100%;height:100%;z-index:20000;background-color:rgba(0,0,0,.65);display:none}\r\n        .keep_popup.open{display:block}\r\n		.keep_popup .pop_wrap{width:320px;position:relative;top:50%;left:0;margin:0 auto;transform: translate(0,-50%)-ms-transform: translate(0, -50%);-webkit-transform: translate(0, -50%);}\r\n		.keep_popup .pop_wrap .cont_box,.keep_popup .pop_wrap .coupon_area{background:#fff;height:auto}\r\n		.keep_popup .pop_wrap .cont_box .cont{padding:15px 15px 20px;}\r\n		\r\n		.keep_popup .pop_wrap .cont_box .cont {overflow:hidden}\r\n		.keep_popup .pop_wrap .cont_box .cont  ul li{float:left;width:142px;overflow:hidden;background:#5d997f;}\r\n		.keep_popup .pop_wrap .cont_box .cont  ul li:first-child {margin-right:6px;background: #da98a4} \r\n		.keep_popup .pop_wrap .cont_box .cont  ul li .keepPrdImg{width:142px;max-height: 121px;overflow:hidden}\r\n		.keep_popup .pop_wrap .cont_box .cont  ul li .txt_box{padding:8px 14px 0;color:#fff;letter-spacing: -0.7px;height:67px}\r\n		.keep_popup .pop_wrap .cont_box .cont  ul li .txt_box .tit strong{font-size:14px; height:18px;width: 114px;overflow: hidden;display:inline-block}\r\n		.keep_popup .pop_wrap .cont_box .cont  ul li .txt_box .text{font-size:13px;line-height:17px;height:34px;padding-top:3px;overflow:hidden}\r\n		\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd{padding:15px 28px 8px;}\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li{float:left;width:125px;overflow:hidden;background:#fff;}\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li:first-child {margin-right:14px;} \r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li .keepPrdImg{width:125px;max-height: 125px;overflow:hidden}\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li .txt_box{color:#333;padding:0px 5px;font-size:14px;height:74px;line-height:18px;letter-spacing:-0.6px}\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li .txt_box .text{padding-top:0;margin-bottom: 7px;overflow:hidden;font-size:14px;height: 34px;}\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li .txt_box .price{height:20px;overflow:hidden}\r\n		.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li .txt_box .price strong{font-size:18px}\r\n		.keep_popup .pop_wrap .cont_box .cont.bnrType{padding:15px 15px 20px}\r\n		@media screen and (max-width:320px){\r\n			.keep_popup .pop_wrap{width:284px}\r\n			.keep_popup .pop_wrap .cont_box .cont  ul li{width: 124px;}\r\n			.keep_popup .pop_wrap .cont_box .cont  ul li:first-child{margin-right:5px}\r\n			.keep_popup .pop_wrap .cont_box .cont  ul li .keepPrdImg{width:124px;max-height:107px}\r\n			.keep_popup .pop_wrap .cont_box .cont  ul li .txt_box .tit strong{width:100%}\r\n			\r\n			.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li{width:108px}\r\n			.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li:first-child{margin-right:12px}\r\n			.keep_popup .pop_wrap .cont_box .cont.keepPrd  ul li .keepPrdImg{width:108px;max-height:108px}\r\n		}		\r\n	</style>\r\n</div>'),
a.put("/lotte/resources_dev/layer/assent_layer.html",'\r\n<section class="assent_pop_wrap" ng-show="assentShow">\r\n	<h3>결제 서비스 이용약관</h3>\r\n	<ul>\r\n		<li ng-class="{on:index == 0}"><span class="tabs tab_first" ng-click="assentTab(0)">전자금융거래<br/>이용약관</span></li>\r\n		<li ng-class="{on:index == 1}"><span class="tabs" ng-click="assentTab(1)">개인정보 수집<br/>및 이용안내</span></li>\r\n		<li ng-class="{on:index == 2}"><span class="tabs" ng-click="assentTab(2)">개인정보 제 3자<br/>제공/위탁 안내</span></li>\r\n    </ul>\r\n    <section id="clauseHolder"></section>\r\n	<span class="assent_pop_close" ng-click="closePop()">닫기</span>\r\n</section>')}]);