angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/category/m/beauty_evt_review_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<section class="pageLoading" ng-show="pageLoading">\r\n		<p class="loading half"></p>\r\n	</section>\r\n	<section ng-show="!pageLoading" class="evt_review_wrap">\r\n		<div class="evt_top">\r\n			<div class="evt_img">\r\n				<img ng-src="{{evtData.evtImgUrl}}" alt="{{evtData.title}}" />\r\n			</div>\r\n			<div class="evt_info">\r\n				<h2>{{evtData.title}}</h2>\r\n				<ul>\r\n					<li>\r\n						<strong>증정상품</strong>{{evtData.evtPrdNm}}\r\n					</li>\r\n					<li class="floatL">\r\n						<strong>행사기간</strong>{{evtData.evtStrDate}} ~ {{evtData.evtEndDate}}\r\n					</li>	\r\n					<li class="floatR">\r\n						<strong>응모조건</strong>구매회원\r\n					</li>\r\n					<li class="floatL">\r\n						<strong>당첨발표</strong>{{evtData.winDate}}\r\n					</li>\r\n					<li class="floatR">\r\n						<strong>당첨인원</strong>{{evtData.winNum}}명 추첨\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		<div class="evt_etc">\r\n			<div class="evt_method">\r\n				<h3>상품평 이벤트 신청 방법</h3>\r\n				<ul>\r\n					<li>\r\n						<span class="no">Step1</span>\r\n						<span class="txt">이벤트를 진행중인 상품을 구매하거나 사용.</span>\r\n					</li>\r\n					<li>\r\n						<span class="no">Step2</span>\r\n						<span class="txt">직접 사용한 경험을 바탕으로 상품평 작성.</span>\r\n					</li>\r\n				</ul>\r\n				<a ng-click="myReviewClk()" class="btn_rvw_write">상품평 작성하기</a>\r\n			</div>\r\n			<div class="evt_faq">\r\n				<h3>이벤트 당첨자 확인사항</h3>\r\n				<ul id="faq_list">\r\n					<li ng-repeat="x in evtData.evtFaq.items" ng-click="faqAccordion($index)" ng-class="{on:faqIdx==$index}">\r\n						<div class="qst">{{x.q}}</div>\r\n						<div class="asw" ng-bind-html="::x.a"></div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n		<div class="list_wrap" ng-controller="productCtrl">\r\n			<div class="prd_list">\r\n				<!-- 상품리스트 유형 선택 -->\r\n				<div class="unit_type" >\r\n					<p class="unit_tit">전체<em> {{evtData.prdList.items.length|number}}</em>개</p>\r\n					<ul>\r\n						<li class="r1"><a href="#" ng-class="{on:templateType==\'list\'}" ng-click="changeTemplate(\'list\')">리스트형</a></li>\r\n						<li class="r2"><a href="#" ng-class="{on:templateType==\'image\'}" ng-click="changeTemplate(\'image\')">이미지형</a></li>\r\n						<li class="r3"><a href="#" ng-class="{on:templateType==\'swipe\'}" ng-click="changeTemplate(\'swipe\')">스와이프형</a></li>\r\n					</ul>\r\n				</div>\r\n				<div product-container template-type="image" templatetype="templateType"  total-count="evtData.prdList.items.length" products="evtData.prdList.items" class="prd_list"></div>\r\n			</div>\r\n		</div>\r\n	</section>\r\n</section>')}]);