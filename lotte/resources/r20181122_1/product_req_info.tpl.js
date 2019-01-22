angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/sub/product_sub_header.html",'<div class="sub_page_header">\n	<button class="btn_prev" ng-click="gotoPrepage()">이전</button>\n	<h2>{{productSubTitle}}</h2>\n</div>'),a.put("/lotte/resources_dev/product/m/sub/product_req_info_container.html",'<section ng-show="contVisible" class="cont_minheight"> <!--상품 필수정보표기-->\r\n	<!-- 무료포장 선물카드 -->\r\n	<div ng-if="pageUI.giftServiceInfo">\r\n		<div class="bsPop pop_gift">\r\n			<div class="pInnder">\r\n				<div ng-if="pageUI.loadData.giftPkgImgUrl">\r\n					<div class="mtit">무료포장</div>\r\n					<div class="pTxtBox tp0">\r\n						<ul class="dot_list">\r\n							<li>· 주문서에서 무료포장 선택 시 제공됩니다.<br>브랜드사 사정에 따라 포장이 다르거나 제공되지 않을 수 있습니다.<br>(대형 사이즈 상품 포장 불가)</li>\r\n						</ul>\r\n						<div class="thumb">\r\n							<!-- <span ng-style="{\'background-image\':\'url({{pageUI.loadData.giftPkgImgUrl}})\' }"></span> -->\r\n							<img ng-src="{{pageUI.loadData.giftPkgImgUrl}}" alt="">\r\n						</div>\r\n					</div>\r\n				</div>\r\n				<div ng-if="pageUI.loadData.futMsgImgUrl">\r\n					<div class="mtit" ng-class="{tLine:pageUI.loadData.giftPkgImgUrl}">선물카드</div>\r\n					<div class="pTxtBox tp0">\r\n						<ul class="dot_list">\r\n							<li>· 선물과 함께 받아보실 수 있는 실물 카드입니다.</li>\r\n						</ul>\r\n						<div class="thumb">\r\n							<!-- <span ng-style="{\'background-image\':\'url({{pageUI.loadData.futMsgImgUrl}})\' }"></span> -->\r\n							<img ng-src="{{pageUI.loadData.futMsgImgUrl}}" alt="">\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			<a ng-click="giftServiceInfoClose()" class="pClose">닫기</a>\r\n		</div>\r\n	</div>\r\n	\r\n	<product-sub-header></product-sub-header>\r\n	<div class="prod_detail_page_wrap p_essen_info">\r\n		<div class="detail_base_wrap">\r\n			<table class="info_table">\r\n				<!-- 20180727 선물서비스 문구추가-->\r\n				<tr ng-if="pageUI.loadData.giftChk && pageUI.loadData.giftInfo">\r\n					<td>선물서비스</td>\r\n					<td>{{pageUI.loadData.giftInfo}}</td>\r\n				</tr>\r\n				<tr ng-repeat="item in pageUI.loadData.itemInfoList.items">\r\n					<td>{{item.key}}</td>\r\n					<td ng-class="{\'blue bold\':item.key == \'선물서비스\'}">\r\n						<p ng-if="item.key == \'선물서비스\' && pageUI.loadData.giftInfo" class="gift_text">{{pageUI.loadData.giftInfo}}</p>\r\n						<span ng-if="item.key != \'선물서비스\'">{{item.value}}</span>\r\n						<ul class="thumb_list" ng-if="item.key == \'선물서비스\'" ng-click="giftServiceInfoClick(\'op_prodDetail\',\'\')">\r\n							<li ng-if="pageUI.loadData.giftPkgImgUrl"><span class="thumb cover"><img ng-src="{{pageUI.loadData.giftPkgImgUrl}}" alt=""></span></li>\r\n							<li ng-if="pageUI.loadData.futMsgImgUrl"><span class="thumb cover"><img ng-src="{{pageUI.loadData.futMsgImgUrl}}" alt=""></span></li>\r\n						</ul>\r\n						<span ng-if="item.key == \'선물서비스\'" ng-click="giftServiceInfoClick(\'op_prodDetail\',\'\')">{{item.value}}</span>\r\n					</td>\r\n				</tr>\r\n				<!-- // 20180727 선물서비스 문구추가-->\r\n			</table>				\r\n				\r\n			<div class="certi_info" ng-if="pageUI.loadData.sftCertList.items.length > 0">\r\n				<p class="info_tit">제품 안전 인증 정보</p>\r\n				<ul class="markInfo_list">\r\n					<li ng-repeat="item in pageUI.loadData.sftCertList.items">\r\n						<div class="info_desc"ng-class="{mark:item.markImgYn == \'Y\'}">\r\n							<span class="markImg"></span>\r\n							<span ng-if="pageUI.loadData.sftCertList.items">{{item.kcTitle}} <var ng-if="item.kpsNo">: {{item.kpsNo}}</var></span>\r\n						</div>\r\n						<p class="info_etc" ng-if="item.kpsKndCd != \'11\'">본 상품은 국가 통합인증(KC 마크) 대상 품목으로 아래의 국가통합인증 (KC마크)을(를) 필하였습니다.</p>\r\n					</li>\r\n				</ul>\r\n\r\n			</div>\r\n			\r\n			<!-- 위탁자 판매정보 -->\r\n			<div ng-if="pageUI.loadData.consignInfo.name">\r\n				<div class="consignerInfo">위탁자 판매 정보</div> \r\n				<table class="info_table">\r\n					<tr>\r\n						<td>업체명</td>\r\n						<td>{{pageUI.loadData.consignInfo.name}}</td>\r\n					</tr>\r\n					<tr>\r\n						<td>주소</td>\r\n						<td>{{pageUI.loadData.consignInfo.address}}</td>\r\n					</tr>\r\n					<tr>\r\n						<td>통신사판매<br />신고번호</td>\r\n						<td>{{pageUI.loadData.consignInfo.code}}</td>\r\n					</tr>\r\n					<tr>\r\n						<td colspan="2">※ 본 상품정보(상품상세정보, 상품기본정보 등)의 내용은 위탁판매자가 직접 등록한 정보입니다. 만약 해당 상품정보에 오류가 있을 경우, 롯데닷컴 고객센터(1577-1110)로 연락 주시면 즉시 조치토록 하겠습니다. </td>\r\n					</tr>\r\n				</table>\r\n			</div>\r\n			<!-- //위탁자 판매정보 -->\r\n\r\n			<!-- 기타 상세정보 -->\r\n			<div ng-if="pageUI.loadData.etcDetailInfo.brnd_intro_cont || pageUI.loadData.etcDetailInfo.attd_mtr_cont || pageUI.loadData.etcDetailInfo.as_cont">\r\n				<div class="consignerInfo">기타 상세정보</div> \r\n				<table class="info_table">\r\n					<tr ng-if="pageUI.loadData.etcDetailInfo.brnd_intro_cont">\r\n						<td>브랜드소개</td>\r\n						<td>{{pageUI.loadData.etcDetailInfo.brnd_intro_cont}}</td>\r\n					</tr>\r\n					<tr ng-if="pageUI.loadData.etcDetailInfo.attd_mtr_cont">\r\n						<td>주의사항</td>\r\n						<td>{{pageUI.loadData.etcDetailInfo.attd_mtr_cont}}</td>\r\n					</tr>\r\n					<tr ng-if="pageUI.loadData.etcDetailInfo.as_cont">\r\n						<td>A/S</td>\r\n						<td>{{pageUI.loadData.etcDetailInfo.as_cont}}</td>\r\n					</tr>\r\n				</table>\r\n			</div>\r\n			<!-- //기타 상세정보 -->\r\n		</div>\r\n	</div>\r\n\r\n	<!--공통 로딩커버-->\r\n	<div class="loading_cover" ng-if="jsonLoading">\r\n		<div class="loading"></div>\r\n	</div>\r\n</section>')}]);