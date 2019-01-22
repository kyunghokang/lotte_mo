angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/sub/product_sub_header.html",'<div class="sub_page_header">\n	<button class="btn_prev" ng-click="gotoPrepage()">이전</button>\n	<h2>{{productSubTitle}}</h2>\n</div>'),a.put("/lotte/resources_dev/product/m/sub/product_collect_benefits_container.html",'<section ng-show="contVisible" class="cont_minheight"> <!--* 상품상세 서브페이지: 혜택 모아보기-->\r\n	<!--20180515 L.POINT 회원 특별할인  팝업-->\r\n	<div class="commonPop lpop" id="lpointPopup" ng-if="pageUI.benefitOpen">\r\n	    <div class="bg" ng-click="pageUI.benefitOpen = !pageUI.benefitOpen"></div>\r\n	    <div class="box">\r\n	        <div class="popBox">\r\n	            <h2>참좋은혜택가 할인내역</h2>\r\n	            <div class="cont">\r\n	                <div class="ptable list" ng-if="pageUI.loadData.immed_pay_dscnt_amt && pageUI.loadData.immed_pay_dscnt_amt > 0">\r\n	                    <div class="cell ls">일시불할인</div>\r\n	                    <div class="cell rs"><b>{{pageUI.loadData.immed_pay_dscnt_amt | number}}</b>원</div>\r\n	                </div>\r\n	                <div class="ptable list" ng-if="pageUI.loadData.inst_cpn_aply_unit_price && pageUI.loadData.inst_cpn_aply_unit_price > 0">\r\n	                    <div class="cell ls">쿠폰할인</div>\r\n	                    <div class="cell rs"><b>{{pageUI.loadData.inst_cpn_aply_unit_price | number}}</b>원</div>\r\n	                </div>\r\n	                <div class="ptable list" ng-if="pageUI.loadData.lpoint_mem_dscnt_price && pageUI.loadData.lpoint_mem_dscnt_price > 0">\r\n	                    <div class="cell ls">L.POINT회원 특별할인</div>\r\n	                    <div class="cell rs"><b>{{pageUI.loadData.lpoint_mem_dscnt_price | number}}</b>원</div>\r\n	                </div>\r\n	                <div class="ptable total" ng-if="pageUI.loadData.total_dscnt_price">\r\n	                    <div class="cell ls">총 할인금액</div>\r\n	                    <div class="cell rs"><b>{{pageUI.loadData.total_dscnt_price | number}}</b>원</div>\r\n	                </div>	                	                	                \r\n	            </div>\r\n	            <div class="foot" ng-click="pageUI.benefitOpen = !pageUI.benefitOpen">\r\n	                닫기\r\n	            </div>\r\n	        </div>\r\n	    </div>\r\n	</div>\r\n	<!--20181116 무이자혜택 카드혜택 팝업-->\r\n	<div class="bsPop pop_nintCard ng-scope" ng-if="pageUI.nintCardOpen">\r\n		<h2 class="ptit">무이자 할부 혜택</h2>\r\n		<div class="pInnder">\r\n			<div class="pTxtBox">\r\n				<img ng-src="{{pageUI.loadData.nintCardImgUrl}}">\r\n			</div>\r\n		</div>\r\n		<div class="pClose" ng-click="pageUI.nintCardOpen = !pageUI.nintCardOpen">\r\n			닫기\r\n		</div>\r\n	</div>\r\n	<div class="popBg" ng-if="pageUI.nintCardOpen" ng-click="pageUI.nintCardOpen = !pageUI.nintCardOpen"></div>\r\n\r\n	<!-- <div class="commonPop quick_layer icCardPop" id="icCardPopup" ng-if="pageUI.nintCardOpen">\r\n	    <div class="bg" ng-click="pageUI.nintCardOpen = !pageUI.nintCardOpen"></div>\r\n	    <div class="box">\r\n	        <div class="popBox">\r\n	            <h2>무이자 할부 혜택</h2>\r\n	            <div class="cont">\r\n	                <img ng-src="{{pageUI.loadData.nintCardImgUrl}}">\r\n	            </div>\r\n	            <div class="foot" ng-click="pageUI.nintCardOpen = !pageUI.nintCardOpen">\r\n	                닫기\r\n	            </div>\r\n	        </div>\r\n	    </div>\r\n	</div> -->\r\n	<!--오늘도착 안내 -->\r\n	<div ng-show="pageUI.pointGuideOpen">\r\n		<div class="bsPopBg" ng-click="pageUI.pointGuideOpen = !pageUI.pointGuideOpen"></div>\r\n		<div class="bsPop pop_pointGuide">\r\n			<div class="pInnder">\r\n				<div class="pTxtBox">\r\n					<p>\r\n						<span ng-if="pageUI.loadData.rsvLpoint">상품적립금 {{pageUI.loadData.rsvLpoint | number}}점<br /></span>\r\n						<span ng-if="pageUI.loadData.rsvPlusCard">롯데포인트플러스카드 결제시<br />최대 {{pageUI.loadData.rsvPlusCard | number}}점 적립</span>				\r\n					</p>\r\n					<div class="stit">적립 기준</div>\r\n					<ul>\r\n						<li>① 상기 표시된 적립금은 쿠폰 등 할인 금액에 따라 변동될 수 있습니다.</li>\r\n						<li>② 무이자할부 이용시 롯데카드 적립은 제외됩니다.</li>\r\n						<li>③ 적립쿠폰은 2배 적립에서 제외됩니다.</li>\r\n						<li>④ 카드사에서 제공되는 적립금은 롯데포인트 플러스카드 결제분에 한해 산정된 적립율로 지급됩니다. (롯데포인트플러스카드와 현금/포인트 복합 결제시 현금/포인트 결제금액 제외)</li>\r\n						<li>⑤ 롯데닷컴 ID기준의 멤버스 회원과 결제하신 롯데포인트플러스카드의 소유주가 다른 경우 롯데카드 적립금은 적립되지 않습니다. <br />(롯데닷컴 적립금은 정상 지급)</li>\r\n					</ul>\r\n				</div>\r\n			</div>\r\n			<a  ng-click="pageUI.pointGuideOpen = !pageUI.pointGuideOpen" class="pClose">닫기</a>\r\n		</div>\r\n	</div>	\r\n	\r\n	<product-sub-header></product-sub-header>\r\n	\r\n	<div class="benefits_info">\r\n		<div class="benefits_box">\r\n			<div class="benefits_top">\r\n                <div class="nm">참좋은혜택가<span ng-click="pageUI.benefitOpen = true" ng-if="pageUI.loadData.total_dscnt_price">?</span></div>\r\n				<div class="price"><strong>{{pageUI.loadData.price | number}}</strong>원</div>\r\n			</div>\r\n			<ul ng-if="pageUI.loadData.emDscntTxt || pageUI.loadData.secDscntTxt || pageUI.loadData.thrdDscntTxt">\r\n				<li ng-if="pageUI.loadData.emDscntTxt">\r\n					<p class="nm">{{pageUI.loadData.emDscntTxt}} </p>\r\n					<p class="price"><strong>- {{pageUI.loadData.emDscntPrc | number}}</strong>원 할인</p>\r\n				</li>\r\n				<li ng-if="pageUI.loadData.secDscntTxt">\r\n					<p class="nm">{{pageUI.loadData.secDscntTxt}} </p>\r\n					<p class="price"><strong>- {{pageUI.loadData.secDscntPrc | number}}</strong>원 할인</p>\r\n				</li>\r\n				<li ng-if="pageUI.loadData.thrdDscntTxt">\r\n					<p class="nm">{{pageUI.loadData.thrdDscntTxt}}</p>\r\n					<p class="price"><strong>- {{pageUI.loadData.thrdDscntPrc | number}}</strong>원 할인</p>\r\n				</li>\r\n			</ul>\r\n			<div class="benefits_bottom" ng-hide="pageUI.loadData.price == pageUI.loadData.finalDscntPrc">\r\n				<div class="nm">최대할인 적용가</div>\r\n				<div class="price"><strong>{{pageUI.loadData.finalDscntPrc | number}}</strong>원</div>\r\n			</div>\r\n		</div>\r\n		<div class="login_ck" ng-if="!loginInfo.isLogin">\r\n			<p>* 로그인을 하시면 고객님의 쿠폰이 추가 적용됩니다.</p>\r\n		</div>\r\n		<div class="login_ck" ng-if="pageUI.loadData.staffImmedDscntTxt">\r\n			<p>* {{pageUI.loadData.staffImmedDscntTxt}}</p>\r\n		</div>\r\n	</div>\r\n\r\n	<div class="prd_title_line" ng-if="pageUI.loadData.clmDscntPromList || pageUI.loadData.nintCardMaxMonth || pageUI.loadData.rsvLpoint || pageUI.loadData.rsvPlusCard">\r\n		<p> 한번 더! 추가할인 혜택 및 적립</p>\r\n	</div>\r\n	<div class="benefits_add" ng-if="pageUI.loadData.clmDscntPromList || pageUI.loadData.nintCardMaxMonth || pageUI.loadData.rsvLpoint || pageUI.loadData.rsvPlusCard">\r\n		<ul class="card_info">\r\n			<li ng-repeat="item in pageUI.loadData.clmDscntPromList.items">\r\n				<div>\r\n					<p class="card">{{item.fvrNm}}  <em ng-if="item.fvrPrc > 0"><span class="price">{{item.fvrPrc | number}}</span>원</em></p>\r\n					<p class="txt">{{item.fvrDesc}}</p>\r\n					<p class="txt">{{item.fvrLmtDesc}}</p>\r\n				</div>\r\n			</li>\r\n			<li class="cdGuide" ng-if="pageUI.loadData.nintCardMaxMonth || pageUI.loadData.nintCardImgUrl">\r\n				<p class="card" ng-if="pageUI.loadData.nintCardMaxMonth"><strong>무이자</strong> {{pageUI.loadData.nintCardMaxMonth}}</p>\r\n				<div class="btn" ng-if="pageUI.loadData.nintCardImgUrl"><a ng-click="pageUI.nintCardOpen = !pageUI.nintCardOpen" class="btn_sty3">카드안내</a></div>\r\n			</li>\r\n			<li ng-if="pageUI.loadData.rsvLpoint || pageUI.loadData.rsvPlusCard">\r\n				<p class="point">\r\n					<div ng-if="pageUI.loadData.rsvLpoint">L.POINT 적립  <span class="price">{{pageUI.loadData.rsvLpoint | number}}P</span><a class="layer_tip" ng-if="!pageUI.loadData.rsvPlusCard">Tip</a></div>\r\n					<div ng-if="pageUI.loadData.rsvPlusCard">롯데포인트플러스카드로 결제 시 <strong>{{pageUI.loadData.rsvPlusCard | number}}P </strong><a class="layer_tip" ng-click="pageUI.pointGuideOpen = !pageUI.pointGuideOpen">Tip</a></div>\r\n				</p>\r\n			</li>\r\n		</ul>\r\n		<ul class="benefits_desc">\r\n			<li>상기 추가할인 혜택 및 적립 금액은 \'최대할인 적용가\' 기준으로 계산되었으며, 실제 할인/적립은 최종 결제금액을 기준으로 적용됩니다. </li>\r\n			<!--<li>추가할인쿠폰은 결제 전 주문서에서 확인가능합니다.</li>-->\r\n		</ul>\r\n	</div>\r\n\r\n	<div class="prd_title_line" ng-if="pageUI.loadData.saunList">\r\n		<p>구매하고 혜택 받으세요!</p>\r\n	</div>\r\n	<div class="lpoint_info" ng-if="pageUI.loadData.saunList">\r\n		<ul class="lpoint_list">\r\n			<li ng-repeat="item in pageUI.loadData.saunList.items">\r\n				<p class="point">{{item.fvrTgtNm}}</p>\r\n				<p class="ti" ng-if="item.goodsTgtNm">{{item.goodsTgtNm}}</p>\r\n				<p class="ti" ng-if="item.evtNm">{{item.evtNm}}</p>\r\n				<p class="date" ng-if="item.buyTerm">구매기간 :  {{item.buyTerm}}</p>\r\n				<p class="card" ng-if="item.fvrCard || item.fvrDesc"><span>{{item.fvrCard}}</span> {{item.fvrDesc}}</p>\r\n				<div class="btn"><a ng-click="goEventSaun(item.evtNo,\'m_RDC_ProdDetail_benefit_Clk_Idx\'+numberFill(($index+1),2),\'구매사은_\'+numberFill(($index+1),2))" class="btn_sty2">자세히 보기</a></div>\r\n			</li>\r\n		</ul>\r\n		<ul class="benefits_desc">\r\n			<li>최대할인 적용가 {{pageUI.loadData.finalDscntPrc | number}}원 기준인 리스트이며, 실제 적립 기준은 각 결제금액 기준으로 적립됩니다. </li>\r\n			<li>현재 보시고 있는 상품 기준의 구매사은 이벤트 리스트 입니다. <br />구매 전 자세히 보기를 누르셔서 해당하는 더 큰 혜택을 받아가세요.</li>\r\n		</ul>\r\n	</div>\r\n	<div class="benefits_card" ng-if="pageUI.loadData.immedDscntCardInfo">\r\n		<p ng-class="{maxtxt: pageUI.loadData.cardtxtlen}">{{pageUI.loadData.immedDscntCardInfo}}</p>\r\n	</div>\r\n	<div class="benefits_ad" ng-if="pageUI.loadData.adTxt">\r\n		<a ng-click="linkClick(pageUI.loadData.adUrl,\'m_RDC_ProdDetail_benefit_Clk_ban01\', pageUI.loadData.adTxt )"><span>{{adResult}}</span> <strong>{{adTxt}}</strong></a>\r\n	</div>\r\n\r\n	<!--공통 로딩커버-->\r\n	<div class="loading_cover" ng-if="jsonLoading">\r\n		<div class="loading"></div>\r\n	</div>\r\n</section>')}]);