angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/sub/product_sub_header.html",'<div class="sub_page_header">\n	<button class="btn_prev" ng-click="gotoPrepage()">이전</button>\n	<h2>{{productSubTitle}}</h2>\n</div>'),a.put("/lotte/resources_dev/product/m/sub/product_qna_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<product-sub-header></product-sub-header>\r\n	\r\n	<div class="prd_title">\r\n		<p>Q&amp;A <em class="cnt" ng-class="{disable:!pageUI.loadData.totalCnt}">({{(!pageUI.loadData.totalCnt? 0:pageUI.loadData.totalCnt) | currency:\'\':0}})</em></p>\r\n		<div class="pt_rbtn"><span class="btn_sty2" ng-click="linkClick(pageUI.loadData.inqQuestUrl,\'m_RDC_ProdDetail_allQNA_Clk_Quest\')">상품문의하기</span></div>\r\n	</div>\r\n\r\n	<div class="qna_area">\r\n		<!--데이터 없을때-->\r\n		<p class="empty_ment div_line_t" ng-if="!pageUI.loadData.totalCnt">Q&A를 통해서 궁금증을 해결하세요.</p>\r\n\r\n		<ul>\r\n			<li ng-repeat="item in pageUI.loadData.qnaList.items">\r\n				<div class="customerInfo">\r\n					{{item.wrtrId}}님 <em>|</em> {{item.inqMkDt}}\r\n				</div>\r\n				<div class="question">\r\n					<strong>Q :</strong> {{item.inqCont}}\r\n				</div>\r\n				<div class="answer">\r\n					<strong>A :</strong> {{item.ansCont}}\r\n				</div>\r\n			</li>\r\n		</ul>\r\n	</div>\r\n\r\n	<!--공통 로딩커버-->\r\n	<div class="loading_cover" ng-if="jsonLoading">\r\n		<div class="loading"></div>\r\n	</div>\r\n</section>')}]);