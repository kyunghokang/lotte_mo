angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mylotte/pointcoupon/m/point_l_point_container.html",'<section ng-show="contVisible" class="cont_minheight">\n	<!-- L-money / param : l_point  -->\n	<section class="mylotte_point" ng-show="!isShowLoadingImage">\n		<nav class="tab_nav">\n			<ul>\n				<li><a ng-click="lPointClick()">L.POINT <span><strong>{{maxData.lt_point | number}}</strong>점</span></a></li>\n				<li class="on"><a ng-click="ltPointClick()">L-money <span><strong>{{maxData.l_point | number}}</strong>점</span></a></li>\n				<li><a ng-click="depositClick()">보관금 <span><strong>{{maxData.deposit | number}}</strong>원</span></a></li>\n			</ul>\n		</nav>\n	<div class="tab_con on">\n		<section class="pay_box" ng-if="maxData.total_l_point_blnc != 0">\n			<p>3일 이내 소멸 예정 L-money <span class="num">{{maxData.total_l_point_blnc | number}}</span>점</p>\n			<p class="desc">적립 잔여 L-money 중 사용하고 남은 잔여만 소멸됩니다.</p>\n		</section>\n\n		<!-- 포인트 적립.사용 내역 -->\n		<section class="point_list" ng-if="pointDelData.length != 0">\n			<table id="tb_point_list" class="tbl_list_01" summary="상세내용, 소멸예정 포인트가 나와있는 표">\n				<caption>소멸예정 내역 상세 테이블</caption>\n				<colgroup>\n					<col width="65%">\n					<col width="35%">\n				</colgroup>\n				<thead>\n					<tr>\n						<th scope="col">상세내용</th>\n						<th scope="col">소멸예정</th>\n					</tr>\n				</thead>\n				<tbody>\n					<tr ng-repeat="items in pointDelData">\n						<td>\n							<span class="date">{{items.occur_dtime | htmlRemove}}</span>\n							<p>{{items.mm_title}}</p>\n							<p>{{items.disapper_info}}</p>\n						</td>\n						<td class="point"><strong>{{items.tobe_del_blnc | number}}</strong></td>\n					</tr>\n				</tbody>\n			</table>\n		</section>\n		<!-- // 포인트 적립.사용 내역 -->\n\n		<!-- 포인트 적립.사용 내역 -->\n		<section class="point_list" ng-if="pointListData.length==0">\n			<h3>L-money 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n			<p class="cont_no">적립/사용 내역이 없습니다.</p>\n		</section>\n		<section class="pointListData" ng-if="pointListData.length!=0">\n			<h3>L-money 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n			<table id="tb_point_list" class="tbl_list_01" summary="상세내용, 적립/사용 포인트가 나와있는 표">\n				<caption>L.POINT 적립/사용 내역 상세 테이블</caption>\n				<colgroup>\n					<col width="65%">\n					<col width="35%">\n				</colgroup>\n				<thead>\n					<tr>\n						<th scope="col">상세내용</th>\n						<th scope="col">적립/사용</th>\n					</tr>\n				</thead>\n				<tbody>\n					<tr ng-repeat="items in pointListData">\n						<td>\n							<span class="date">{{items.occur_dtime | htmlRemove}}</span>\n							<p>{{items.mm_title}}</p>\n							<p>{{items.mm_gbn_nm}} {{items.mm_gbn_value}} {{items.point_info}}</p>\n						</td>\n						<td ng-if="items.point_sign == \'+\'" class="point plus"><strong>+{{items.occur_amt | number}}</strong></td>\n						<td ng-if="items.point_sign == \'-\'" class="point minus"><strong>-{{items.occur_amt | number}}</strong></td>\n					</tr>\n				</tbody>\n			</table>\n		</section>\n		<!-- // 포인트 적립.사용 내역 -->			\n		\n		<!-- 더보기 버튼 -->\n		<section class="more_view" ng-if="thisPage < page_end">\n			<div><a href="#" ng-click="moreListClick()"><span><strong>더보기</strong> (<label id="currentCnt">{{pointListData.length}}</label>/<label id="totalCnt">{{pointList_tot_cnt}}</label>)</a></span></div>\n		</section>\n		<!--// 더보기 버튼 -->\n	</div>\n\n	<!-- L-money 사용 안내 -->\n	<dl class="slideGuide" ng-click="depositViewClick1()">\n		<dt >L-money 사용 안내</dt>\n		<dd ng-if="depositView1 == true">\n			<ul>\n				<li>신용카드, 인터넷뱅킹, 계좌이체, 포인트와 함께 사용하실 수 있습니다.</li>\n				<li>지급 시 유효기간을 별도 고지한 경우를 제외하고 L-money의 유효기간은 발행일로부터 5년입니다.</li>\n				<li>결제 시 10원 단위 이상으로 원하는 금액만큼 사용하실 수 있습니다.</li>\n				<li>2015년 9월 3일 이전에 롯데상품권(지류/모바일)으로 전환된 L-money는 현금영수증 발행이 가능합니다.</li>\n				<li>그 외 이벤트 등으로 적립된 L-money는 현금영수증 발행이 불가합니다.</li>\n				<li>백화점상품권으로 전환한 L-money의 유효기간은 발행일로부터 5년이며,경과 또는 회원탈퇴시 자동소멸 됩니다.<br/>(2015년9월3일 이전 전환한 L-money에 한함)</li>\n				<li>이벤트 당첨 L-money의 경우 이벤트마다 별도의 유효기간이 적용되며, 현금환불이 불가합니다.</li>\n			</ul>\n		</dd>\n	</dl>\n		\n	<!-- 선물전자지급수단 주요사항 -->\n	<dl class="slideGuide" ng-click="depositViewClick2()">\n		<dt >선물전자지급수단 주요사항</dt>\n		<dd ng-if="depositView2 == true">\n			<h6>항목</h6>\n			<p>선물전자지급수단 주요사항 고지</p>					\n			<h6>회사정보</h6>\n			<ul>\n			   <li>주식회사 롯데닷컴/대표이사 김경호 </li>\n			   <li>서울시 중구 을지로 158(을지로4가 삼풍빌딩) 10층</li>\n			   <li>고객만족센터 : 1577-1110</li>\n			   <li>전자우편 : webmaster@lotte.com</li>\n			   <li>자본금 : 232억원</li>\n			   <li>자본금현황 : 422억</li>\n			</ul>\n			<h6>소비자피해보상 보험계약 등 관련 정보</h6>\n			<p>L- money는 전자상거래등에서 소비자보호에 관한 법률 제24조 및 금융 위원회설치등에 관한법률 제38조에 의하여 금융기관에 예치중임.</p>\n			<h6>남은금액 현금 환불과 관련된 사항</h6>\n			<ul>\n			   <li>이벤트 등으로 적립된 비현금성 L- money는 현금 환불 불가</li>\n			   <li>2015년 9월 3일 이전에 롯데상품권(지류/모바일)으로 전환된 L-money</li>\n			   <li>1만원 초과 시 : 발생액의 60%이상 사용시 잔액 환불 가능</li>\n			   <li>1만원 이상 시 : 발생액의 80%이상 사용시 잔액 환불 가능</li>\n			</ul>\n			<h6>반품시 처리기준 및 현금화 관련 사항</h6>\n			<p>L- money 결제건 취소시 L- money로 재적립</p>\n			<h6>해당 결제수단을 사용할 수 있는 사이버몰 현황</h6>\n			<p>롯데닷컴, 엘롯데, 롯데슈퍼, 무지, 유니클로 등</p>\n			<h6>해당 결제수단의 사용상 제한 및 주의사항</h6>\n			<ul>\n			   <li>이벤트 등으로 적립된 비현금성 L- money는 현금환불 불가</li>\n			   <li>회원 탈퇴 시 자동 소멸</li>\n			</ul>\n		</dd>\n	</dl>\n\n	</section>\n	<!-- 로딩이미지 -->\n    <div class="listLoading" ng-show="isShowLoadingImage" style="height:300px">\n    	<p class="noData"><p class="loading half"></p></p>\n    </div>\n</section>'),a.put("/lotte/resources_dev/mylotte/pointcoupon/m/point_lt_point_container.html",'<section ng-show="contVisible" class="cont_minheight">\n	<!-- L-point / param : lt_point  -->\n	<section class="mylotte_point" ng-show="!isShowLoadingImage">\n		<nav class="tab_nav">\n			<ul>\n				<li class="on"><a ng-click="lPointClick()">L.POINT <span><strong>{{maxData.lt_point | number}}</strong>점</span></a></li>\n				<li><a ng-click="ltPointClick()">L-money <span><strong>{{maxData.l_point | number}}</strong>점</span></a></li>\n				<li><a ng-click="depositClick()">보관금 <span><strong>{{maxData.deposit | number}}</strong>원</span></a></li>\n			</ul>\n		</nav>\n		<div class="tab_con on">\n			<!-- 소멸예정 포인트 사용안함 11.08 결함번호 846\n			<section class="pay_box">\n				<p>3일 이내 소멸 예정 L.POINT <span class="num">{{maxData.total_l_point_blnc}}</span>점</p>\n			</section>			\n			 -->\n			 \n			<!-- 적립대기 포인트 -->\n			<section class="point_list waiting_point" ng-if="pointSaveData.length != 0">\n				<h3>적립대기 포인트</h3>\n				<table ng-repeat="items in pointSaveData" id="tb_point_list" class="tbl_list_01" summary="적립대기 포인트가 나와있는 표">\n					<caption>L.POINT 적립/사용 내역 상세 테이블</caption>\n					<colgroup>\n						<col width="35%">\n						<col width="65%">\n					</colgroup>\n					<thead>\n					<tr>\n						<th scope="col" colspan="2" class="order_num"><strong>주문번호</strong> {{items.ord_no}}</th>\n					</tr>\n					</thead>\n					<tbody class="add_point">\n					<tr>\n						<th>상품명</th>\n						<td ng-bind-html="items.goods_nm"></td>\n					</tr>\n					<tr>\n						<th>적립대기포인트</th>\n						<td>\n							<strong>+{{items.save_point}}</strong>\n							<span class="btn on" ng-if="items.down_yn == \'Y\'" ng-click="pointSaveClick(items.ord_no)">적립하기</span>\n							<span class="btn" ng-if="items.down_yn == \'N\'">적립대기</span>\n						</td>\n					</tr>\n					</tbody>\n				</table>\n				<!--L.POINT는 2AM~ <p class="desc">  4AM시까지 시스템 점검 시에는 적립이 불가능합니다.</p>-->\n			</section>\n			<!-- // 포인트 적립.사용 내역 -->\n			\n			<section class="point_list" ng-if="pointListData.length != 0">\n				<h3>L.POINT 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n				<table id="tb_point_list" class="tbl_list_01" summary="상세내용, 적립/사용 포인트가 나와있는 표">\n					<caption>L.POINT 적립/사용 내역 상세 테이블</caption>\n					<colgroup>\n						<col width="65%">\n						<col width="35%">\n					</colgroup>\n					<thead>\n						<tr>\n							<th scope="col">상세내용</th>\n							<th scope="col">적립/사용</th>\n						</tr>\n					</thead>\n					<tbody>\n						<tr ng-repeat="items in pointListData">\n							<td>\n								<span class="date">{{items.occur_dtime | htmlRemove}}</span>\n								<p>{{items.mm_title}}</p>\n								<p ng-if="items.ord_no">주문번호 {{items.mm_gbn_value}}</p>\n							</td>\n							<td ng-if="items.point_sign == \'+\'" class="point plus"><strong>+{{items.occur_amt | number}}</strong></td>\n							<td ng-if="items.point_sign == \'-\'" class="point minus"><strong>-{{items.occur_amt | number}}</strong></td>\n						</tr>\n					</tbody>\n				</table>\n			</section>\n			<!-- // 포인트 적립.사용 내역 -->\n			<section class="point_list" ng-if="pointListData.length == 0">\n				<h3>L.POINT 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n				<p class="cont_no">적립/사용 내역이 없습니다.</p>\n			</section>\n			\n			<!-- 더보기 버튼 -->\n			<section class="more_view" ng-if="thisPage < page_end">\n				<div><a href="#" ng-click="moreListClick()"><span><strong>더보기</strong> (<label id="currentCnt">{{pointListData.length}}</label>/<label id="totalCnt">{{pointList_tot_cnt}}</label>)</a></span></div>\n			</section>\n			<!--// 더보기 버튼 -->\n\n			<!-- L.POINT 사용 안내 -->\n			<dl class="slideGuide" ng-click="depositViewClick1()">\n				<dt >L.POINT 사용 안내</dt>\n				<dd ng-if="depositView1 == true">\n					<ul>\n					   <li>L.POINT는 롯데닷컴 및 L.POINT 제휴사에서 상품구매 또는 이용 후 적립 받으실 수 있는 포인트입니다.</li>\n					   <li>L.POINT는 1점 이상이면 사용이 가능합니다.</li>\n					   <li>할인쿠폰을 사용한 주문의 경우, 포인트 적립 시 할인 받은 금액을 제외한 금액기준으로 부여됩니다.</li>\n					   <li>L.POINT의 유효기간은 적립일로부터 5년입니다.<br/>(단, 롯데카드에서 적립된 포인트는 유효기간 없음)</li>\n					   <li>롯데백화점 지류/모바일 상품권으로 전환된 L.POINT 는 현금영수증 발행이 가능합니다.<br/> 그외 이벤트 등으로 적립된 L.POINT 는 현금영수증 발행이 불가능 합니다.<br/>&#40;현금영수증 발행은 L.POINT에 문의 바랍니다. <a class="lPointC" ng-click="lPointGoLink()">http://www.lpoint.com</a>&#41;</li>\n					</ul>\n				</dd>\n			</dl>\n\n		</div>\n	</section><!-- 로딩이미지 -->\n    <div class="listLoading" ng-show="isShowLoadingImage" style="height:300px">\n    	<p class="noData"><p class="loading half"></p></p>\n    </div>\n</section>'),a.put("/lotte/resources_dev/mylotte/pointcoupon/m/point_clover_container.html",'<section ng-show="contVisible" class="cont_minheight">\n	<section class="mylotte_point" ng-show="!isShowLoadingImage">\n		<div class="bg_white">\n			<!-- 클로버 내역 -->\n			<section class="clover_info">\n				<!-- 나의 총 클로버 -->\n				<div class="extinction_clover">\n					<p class="tot_clover">나의 총 클로버 <span><strong>{{maxData.useable_clover | number}}</strong>개</span></p>\n					<a ng-click="cloverLink()" class="tot_clover_link">클로버 안내</a>\n				</div>\n				<!-- // 나의 총 클로버 -->\n				<div ng-if="maxData.tobe_del_clover != 0" class="extinction_box">\n					<p class="extinction_count">30일 이내 소멸 예정 클로버 <strong>{{maxData.tobe_del_clover | number}}</strong>개</p>\n					<p class="desc">적립 클로버 중 사용하고 남은 잔여클로버만 소멸됩니다.</p>\n				</div>\n	\n				<!--<div class="btn_areaC" ng-if="maxData.tobeDelCloverList.items.length == 0">\n					<a class="btn_style2s bi-mr disabled">상세보기</a>\n				</div>-->\n				\n				<div class="btn_areaC" ng-if="maxData.tobeDelCloverList.items.length != 0">\n					<a ng-click="delCloverView()" class="btn_style2s bi-mr" ng-class="{on:!delCloverListViewFlag}">소멸예정내역 보기</a>\n				</div>\n				\n				<!-- 소멸 예정 클로버 -->\n				<section class="point_list extinction" ng-if="delCloverListViewFlag == true">\n					<h3>소멸 예정 클로버 <span>(30일 이내)</span></h3>\n					<table id="tb_point_list" class="tbl_list_01" summary="상세내용, 소멸예정 포인트가 나와있는 표">\n						<caption>소멸예정 내역 상세 테이블</caption>\n						<colgroup>\n							<col width="65%">\n							<col width="35%">\n						</colgroup>\n						<thead>\n							<tr>\n								<th scope="col">상세내용</th>\n								<th scope="col">소멸예정</th>\n							</tr>\n						</thead>\n						<tbody>\n							<tr ng-repeat="items in delCloverListData">\n								<td>\n									<span class="date" >{{items.occur_dtime | htmlRemove}}</span>\n									<p>{{items.mm_title}}</p>\n								</td>\n								<td class="point minus"><strong>-{{items.occur_amt}}</strong></td>\n							</tr>\n						</tbody>\n					</table>\n				</section>\n				<!-- // 소멸 예정 클로버 -->\n				\n			</section>\n	\n			<!-- 포인트 적립.사용 내역 -->\n			<section class="point_list" ng-if="cloverListData.length != 0">\n				<h3>클로버 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n				<table id="tb_point_list" class="tbl_list_01" summary="상세내용, 적립/사용 포인트가 나와있는 표">\n					<caption>L.POINT 적립/사용 내역 상세 테이블</caption>\n					<colgroup>\n						<col width="65%">\n						<col width="35%">\n					</colgroup>\n					<thead>\n						<tr>\n							<th scope="col">상세내용</th>\n							<th scope="col">적립/사용</th>\n						</tr>\n					</thead>\n					<tbody ng-repeat="items in cloverListData">\n						<tr>\n							<td>\n								<span class="date">{{items.occur_dtime | htmlRemove}}</span>\n								<p>{{items.mm_title}}</p>\n							</td>\n						<td ng-if="items.point_sign == \'+\'" class="point plus"><strong>+{{items.occur_amt | number}}</strong></td>\n						<td ng-if="items.point_sign == \'-\'" class="point minus"><strong>-{{items.occur_amt | number}}</strong></td>\n						</tr>\n					</tbody>\n				</table>\n			</section>\n			<!-- // 포인트 적립.사용 내역 -->\n	\n			<!-- 클로버 사용 내역 -->\n			<section class="point_list" ng-if="cloverListData.length == 0">\n				<h3>클로버 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n				<p class="cont_no">적립/사용 내역이 없습니다.</p>\n			</section>\n			<!-- // 클로버 사용 내역 -->\n	\n			<!-- 더보기 버튼 -->\n			<section class="more_view" ng-if="cloverListData.length != cloverPointList_tot_cnt">\n				<div><a href="#" ng-click="moreListClick()"><span><strong>더보기</strong> (<label id="currentCnt">{{cloverListData.length}}</label>/<label id="totalCnt">{{cloverPointList_tot_cnt}}</label>)</a></span></div>\n			</section>\n			<!--// 더보기 버튼 -->		\n		</div>\n\n		<!-- 클로버 사용 안내 -->\n		<dl class="slideGuide" ng-click="depositViewClick1()" >\n			<dt >클로버 사용 안내</dt>\n			<dd ng-if="depositView1 == true">\n				<ul>\n				   <li>클로버는 롯데닷컴에서 제공하는 행운의 마일리지로써 구매 이외에 다양한 활동으로 쌓으실 수 있습니다.</li>\n				   <li>클로버와 교환하실 수 있는 쇼핑혜택<br/>할인쿠폰, 무료배송권, L-money와 교환</li>\n				   <li>쿠폰 사용기간 : 교환일로부터 1일 이내</li>\n				   <li>L-money 사용기간 : 교환일로부터 7일 이내</li>\n				</ul>\n			</dd>\n		</dl>\n	</section>\n    <div class="listLoading" ng-show="isShowLoadingImage" style="height:300px">\n    	<p class="noData"><p class="loading half"></p></p>\n    </div>\n	<!-- //클로버 -->\n</section>'),a.put("/lotte/resources_dev/mylotte/pointcoupon/m/point_coupon_container.html",'<section ng-show="contVisible" class="cont_minheight">\n	<section class="mylotte_point" ng-show="!isShowLoadingImage">\n		\n		<div class="bg_white" >\n			\n			<!-- 쿠폰내역 header -->\n			<section class="coupon_header">\n				<span>사용 가능한 쿠폰 <em>{{maxData.coupon_cnt}}</em>장</span>\n				<div class="btn_list">\n					<a ng-click="paperCouponRegi()" class="btn_style2s">페이퍼 쿠폰 등록</a>\n				</div>\n			</section>\n			\n			<!--// 쿠폰내역 header -->\n			<section class="point_list"  ng-if="couponListData.length == 0">\n				<p class="cont_no">사용가능한 쿠폰 내역이 없습니다.</p>\n			</section>\n				\n	\n			<section class="coupon_list">\n				<ul>\n					<li ng-repeat="items in couponListData" ng-class="{plusSale : \'blue\', sale: \'sky\', save : \'sky\', support : \'sky\', freeDlv : \'sky\'}[items.couponKind]" >\n						<h3>{{items.promNm}}</h3>\n						<a href="#">\n							<div class="coupon_datail">\n								<!-- 최대할인 -->\n								<div class="cpnnum" ng-if="items.couponKind == \'plusSale\'">\n									<span><strong>{{items.fvrValStr}}</strong>{{items.unitName}}</span>\n									<p>추가할인</p>\n								</div>\n								<!-- 할인 -->\n								<div class="cpnnum" ng-if="items.couponKind == \'sale\'">\n									<span><strong>{{items.fvrValStr}}</strong>{{items.unitName}}</span>\n									<p>할인</p>\n								</div>\n								<!-- 적립 -->\n								<div class="cpnnum" ng-if="items.couponKind == \'save\'">\n									<span><strong>{{items.fvrValStr}}</strong>{{items.unitName}}</span>\n									<p>적립</p>\n								</div>\n								<!-- 쇼핑지원권 -->\n								<div class="cpnnum" ng-if="items.couponKind == \'support\'">\n									<span><strong>{{items.fvrVal}}</strong>{{items.unitName}}</span>\n									<p>쇼핑지원권</p>\n								</div>\n								<!-- 무료배송권 -->\n								<div class="cpnnum" ng-if="items.couponKind == \'freeDlv\'">\n									<span class="free_delivery"></span>\n									<p>무료배송권</p>\n								</div>\n								<div class="cpninfo">\n									<p><span>사용조건</span>{{items.useCondition}}</p>\n									<p><span>사용기간</span> ~{{items.avalEndDtime | limitTo:10}}</p>\n									<p><span>최대할인</span>{{items.maxFvrVal}}</p>\n									<p class="d-day"><em>{{items.remainDay}}</em>일 남았습니다.</p>\n								</div>\n							</div>\n						</a>\n					</li>\n				</ul>\n			</section>\n	\n			<!-- 더보기 버튼 -->\n			<section class="more_view" ng-if="thisPage < page_end">\n				<div><a href="#" ng-click="moreListClick()"><span><strong>더보기</strong> (<label id="currentCnt">{{couponListData.length}}</label>/<label id="totalCnt">{{couponList_tot_cnt}}</label>)</a></span></div>\n			</section>\n			<!--// 더보기 버튼 -->\n			\n		</div>\n	</section>\n    <div class="listLoading" ng-show="isShowLoadingImage" style="height:300px">\n    	<p class="noData"><p class="loading half"></p></p>\n    </div>\n</section>\n'),a.put("/lotte/resources_dev/mylotte/pointcoupon/m/point_deposit_container.html",'<section ng-show="contVisible" class="cont_minheight">\n	<section class="mylotte_point" ng-show="!isShowLoadingImage">\n		<!-- 탭메뉴 -->\n		<nav class="tab_nav">\n			<ul>\n				<li ><a ng-click="lPointClick()">L.POINT <span><strong>{{maxData.lt_point | number}}</strong>점</span></a></li>\n				<li><a ng-click="ltPointClick()">L-money <span><strong>{{maxData.l_point | number}}</strong>점</span></a></li>\n				<li class="on"><a ng-click="depositClick()">보관금 <span><strong>{{maxData.deposit | number}}</strong>원</span></a></li>\n			</ul>\n		</nav>\n	<div class="tab_con on">\n		<!-- 보관금 -->\n		<section class="pay_box" ng-if="maxData.deposit != 0">\n			<p class="tl">사용/환불 가능한 보관금 <span class="num">{{maxData.deposit | number}}</span>원</p>\n			<a class="btn_style2s ptr" ng-click="goRefundDetail()" >환불요청</a>\n		</section>\n		<!-- 포인트 적립.사용 내역 -->\n		<section class="point_list" ng-if="pointListData.length == 0">\n			<h3>보관금 적립/사용 내역 <span>(최근 3개월간)</span></h3>\n			<p class="cont_no">적립/사용 내역이 없습니다.</p>\n		</section>\n		<!-- // 포인트 적립.사용 내역 -->\n\n		<!-- 보관금 적립.사용 내역 보관금 (json에 없음) -->\n		<section class="point_list" ng-if="pointListData.length != 0">\n			<table id="tb_point_list" class="tbl_list_01" summary="보관금 적립.사용 내역이 나와있는 표">\n				<caption>소멸예정 내역 상세 테이블</caption>\n				<colgroup>\n					<col width="65%">\n					<col width="35%">\n				</colgroup>\n				<thead>\n					<tr>\n						<th scope="col">상세내용</th>\n						<th scope="col">적립/사용</th>\n					</tr>\n				</thead>\n				<tbody>\n					<tr ng-repeat="items in pointListData">\n						<td>\n							<span class="date">{{items.occur_dtime | htmlRemove}}</span>\n							<p>{{items.mm_title}}</p>\n							<p>{{items.mm_gbn_nm}} {{items.mm_gbn_value}} {{items.point_info}}</p>\n						\n						<td ng-if="items.point_sign == \'+\'" class="point plus"><strong>+{{items.occur_amt | number}}</strong></td>\n						<td ng-if="items.point_sign == \'-\'" class="point minus"><strong>-{{items.occur_amt | number}}</strong></td>\n						\n					</tr>\n				</tbody>\n			</table>\n		</section>\n		<!-- // 보관금 적립.사용 내역 -->\n		<!-- 더보기 버튼 -->\n		<section class="more_view" ng-if="thisPage < page_end">\n			<div><a href="#" ng-click="moreListClick()"><span><strong>더보기</strong> (<label id="currentCnt">{{pointListData.length}}</label>/<label id="totalCnt">{{pointList_tot_cnt}}</label>)</a></span></div>\n		</section>\n		<!--// 더보기 버튼 -->\n		\n		<!-- 보관금 사용 안내 -->\n		<dl class="slideGuide" ng-click="depositViewClick1()" >\n			<dt >보관금 사용 안내</dt>\n			<dd ng-if="depositView1 == true">\n				<ul>\n				   <li>주문취소 또는 반품으로 인한 환불금을 모아놓은 가상의 계좌입니다.</li>\n				   <li>상품 구매시 현금과 동일하게 사용 가능하며, 본인 명의 계좌로 현금 이체가 가능합니다.</li>\n				   <li>현금이체 신청시점에 따른 입금시간<br/>16시 이전 → 당일 19시 입금(주말과 공휴일 다음날 19시 입금)<br/>16시 이후 → 다음날 19시 입금</li>\n				</ul>\n			</dd>\n		</dl>		\n	</div>\n	</section>\n	<!-- 로딩이미지 -->\n    <div class="listLoading" ng-show="isShowLoadingImage" style="height:300px">\n    	<p class="noData"><p class="loading half"></p></p>\n    </div>\n</section>\n')}]);