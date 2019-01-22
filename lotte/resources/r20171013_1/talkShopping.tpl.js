angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/talk/talkShopping_container.html",'<section ng-show="contVisible" class="cont_minheight" ng-class="{dev_mode:DEV_MODE}">\n\n<div class="dev_sidebar" ng-if="DEV_MODE && ts_currentStep > 0">\n	<!-- <a ng-click="talkRecomDelegate(\'getProdGroup\')">상품군목록</a> -->\n	<span>Step {{ts_currentStep}}</span>\n	<a ng-if="ts_currentStep==1" ng-click="talkRecomDelegate(\'sendSpeech\', \'생수 주문해줘\')">생수 주문</a>\n	<a ng-if="ts_currentStep==1" ng-click="talkRecomDelegate(\'sendSpeech\', \'아이시스 주문해줘\')">아이시스</a>\n	<a ng-if="ts_currentStep==2" ng-click="talkRecomDelegate(\'sendSpeech\', \'1번 주문해줘\')">1번 주문</a>\n	<a ng-if="ts_currentStep==2" ng-click="talkRecomDelegate(\'sendSpeech\', \'1번 담아줘\')">1번 담기</a>\n	<a ng-if="ts_currentStep==2" ng-click="talkRecomDelegate(\'sendSpeech\', \'1번 실패\')">1번 실패</a>\n	<a ng-if="ts_currentStep==2" ng-click="talkRecomDelegate(\'sendSpeech\', \'1번 자세히\')">1번 상세</a>\n	<a ng-if="ts_currentStep==3" ng-click="talkRecomDelegate(\'sendSpeech\', \'결제해줘\')">결제해줘</a>\n	<a ng-if="ts_currentStep==4" ng-click="paymentSuccess()">결제완료</a>\n	<a ng-if="ts_currentStep==4" ng-click="paymentFail()">결제실패</a>\n	<span>Common</span>\n	<a ng-click="talkRecomDelegate(\'sendSpeech\', \'취소\')">처음으로</a>\n	<a ng-click="talkRecomDelegate(\'sendSpeech\', \'이전으로\')">이전으로</a>\n	<a ng-click="talkRecomDelegate(\'sendSpeech\', \'더보기\')">더보기</a>\n	<a ng-click="talkRecomDelegate(\'sendSpeech\', \'맨위로\')">맨위로</a>\n	<a ng-click="talkRecomDelegate(\'sendSpeech\', \'장바구니로 이동\')">장바구니</a>\n	<span>Misc</span>\n	<a ng-click="stopSpeechRecog()"><span style="display:inline-block;width:10px;height:10px;background-color:#f00;margin-right:4px;"></span>Stop</a>\n	<a ng-click="delLS()">Del LS</a>\n</div>\n\n<div class="ts_cont ts_chat" ng-if="!ts_basicInfo.showBasicInfo">\n	<div class="ts_header" ng-class="{noinfo:ts_currentStep>3}">\n		<a class="tsh_setting" ng-click="showHideBIPop(true)"></a>\n		<a class="tsh_info" ng-click="showHideGuidePop(true)"></a>\n		<a class="tsh_close" ng-click="goHistoryBack()"></a>\n	</div>\n	\n	<!-- 상품군 선택 -->\n	<div class="ts_step ts_step1" ng-if="ts_currentStep==1">\n		<div class="step_guide">step 1 - 상품군 선택</div>\n		<div>\n			<div class="talk_list" ng-repeat="talk in ts_talkList[1].talk_list track by $index" ng-bind-html="talk"></div>\n			<div class="group_list group{{$index+1}}" ng-repeat="item in ts_prodGroup track by $index">\n				<div class="tsg_row">\n					<div class="tsg_cell" ng-repeat="grp in item track by $index">\n						<div ng-click="selectProdGroup(grp)">\n							<span class="tsg_img"><img ng-src="{{grp.thumb}}" /></span>\n							<span class="tsg_ttl">{{grp.title}}</span>\n						</div>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n	\n	<!-- 상품 선택 -->\n	<div class="ts_step ts_step2" ng-if="ts_currentStep==2">\n		<div class="step_guide">step 2 - 상품 선택</div>\n		<div>\n			<div class="talk_list user_text" ng-if="ts_talkList[2].user_text">{{ts_talkList[2].user_text}}</div>\n			<div class="talk_list" ng-repeat="talk in ts_talkList[2].talk_list track by $index" ng-bind-html="talk"></div>\n			<div class="prod_list prod{{$index+1}}" ng-click="selectProduct($index+1)"\n				ng-repeat="item in ts_prodList track by $index">\n				<span class="tsp_idx">{{$index+1}}</span>\n				<span class="tsp_img"><img ng-src="{{item.img_url}}" /></span>\n				<span class="tsp_ttl">{{item.goods_nm}}</span>\n				<span class="tsp_prc">{{item.price | number}}</span>\n			</div>\n		</div>\n	</div>\n	\n	<!-- 주문 결정 -->\n	<div class="ts_step ts_step3" ng-if="ts_currentStep==3">\n		<div class="step_guide">step 3 - 주문 결정</div>\n		<div>\n			<div class="talk_list user_text" ng-if="ts_talkList[3].user_text">{{ts_talkList[3].user_text}}</div>\n			<div class="talk_list" ng-repeat="talk in ts_talkList[3].talk_list track by $index" ng-bind-html="talk"></div>\n			<div class="order_review" ng-repeat="item in ts_orderReview.goods_list.items track by $index | limitTo : 1">\n				<div class="tsor_prod">\n					<div class="tsor_img"><img ng-src="{{item.img_url}}" /></div>\n					<div class="tsor_ttl">{{item.goods_nm}}</div>\n				</div>\n				<div class="tsor_price">\n					<dl class="tsor_discount" ng-repeat="discount in ts_orderReview.discount_list.items track by $index | limitTo :1">\n						<dt>총 할인금액</dt>\n						<dd>{{discount.tot_dc_amt | number}}</dd>\n					</dl>\n					<dl class="tsor_total">\n						<dt>최종 결제금액</dt>\n						<dd>{{item.sale_prc | number}}</dd>\n					</dl>\n					<dl class="tsor_payment">\n						<dt></dt>\n						<dd>{{ts_orderReview.pay_info.pay_mean_nm}}</dd>\n					</dl>\n				</div>\n				<div class="tsor_delivery">\n					<dl>\n						<dt>배송지</dt>\n						<dd>\n							<span class="tsor_delname">{{ts_orderReview.delivery_info.dlvp_nm}}</span>\n							<span ng-if="ts_orderReview.delivery_info.stnm_post_addr">{{ts_orderReview.delivery_info.stnm_post_addr}} {{ts_orderReview.delivery_info.stnm_dtl_addr}}</span>\n							<span ng-if="!ts_orderReview.delivery_info.stnm_post_addr">{{ts_orderReview.delivery_info.post_addr}} {{ts_orderReview.delivery_info.dtl_addr}}</span>\n						</dd>\n					</dl>\n				</div>\n			</div>\n		</div>\n	</div>\n	\n	<!-- 주문중 -->\n	<div class="ts_step ts_step4" ng-if="ts_currentStep==4">\n		<div class="step_guide">step 4 - 주문중</div>\n		<div>\n			<div class="talk_list user_text" ng-if="ts_talkList[4].user_text">{{ts_talkList[4].user_text}}</div>\n			<div class="ts_orderLayer">\n				<div class="tsol_frame">\n					<div><iframe src="http://m.naver.com" id="tsol_iframe" scrolling="yes"></iframe></div>\n					<a class="tsol_close" ng-click="closeOrderLayer()"></a>\n				</div>\n			</div>\n			<!-- <div class="talk_list">결제 모듈 실행</div> -->\n		</div>\n	</div>\n	<div class="ts_step">\n	</div>\n	\n	<!-- 주문 완료 -->\n	<div class="ts_step ts_step5" ng-if="ts_currentStep==5">\n		<div class="step_guide">step 5 - 주문 완료</div>\n		<div>\n			<div class="talk_list" ng-repeat="talk in ts_talkList[5].talk_list track by $index" ng-bind-html="talk"></div>\n			<div>\n				<table>\n					<tr>\n						<td>배송지</td>\n						<td>서울 동대문구 외대역동로 101</td>\n					</tr>\n					<tr>\n						<td>결제수단</td>\n						<td>L.Pay 하나카드</td>\n					</tr>\n					<tr>\n						<td>총 주문금액</td>\n						<td>12,900원</td>\n					</tr>\n					<tr>\n						<td>총 할인금액</td>\n						<td>900원</td>\n					</tr>\n					<tr>\n						<td>최종 결제금액</td>\n						<td>12,000원</td>\n					</tr>\n				</table>\n			</div>\n		</div>\n	</div>\n	\n	<!-- mic -->\n	<div class="ts_mic" ng-class="{open:ts_micStat.open}" ng-click="micClick()">\n	\n		<div class="tsm_box" ng-if="ts_micStat.inited" ng-class="{warning:ts_micStat.warning}">\n			<div class="tsm_circle">\n				<div class="tsmc_ripple"></div>\n				<div class="tsmc_disc"></div>\n				<div class="tsmc_mic" ng-if="!(ts_micStat.listening || ts_micStat.sending || ts_micStat.warning)"></div>\n				<div class="tsmc_dot" ng-if="(ts_micStat.listening || ts_micStat.sending || ts_micStat.warning)">\n					<span class="a1"><span></span></span>\n					<span class="a2"><span></span></span>\n					<span class="a3"><span></span></span>\n				</div>\n				<!-- <div class="tsmc_dot tsmc_waver" ng-if="ts_micStat.listening"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>\n				<div class="tsmc_dot tsmc_flick" ng-if="ts_micStat.sending"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div> -->\n			</div>\n			<div class="tsm_text">\n				<span ng-if="!ts_stt.text">{{ts_toastList[ts_toastIdx]}}</span>\n				<span ng-if=" ts_stt.text">{{ts_stt.text}}</span>\n			</div>\n		</div>\n		\n		<div class="tsm_intro" ng-class="{init:ts_micStat.init}" ng-if="!ts_micStat.inited">\n			<div class="tsmi_circle"></div>\n			<div class="tsmi_mic"></div>\n		</div>\n		\n	</div>\n	\n</div>\n\n<div class="ts_cont ts_basic" ng-if="ts_basicInfo.showBasicInfo">\n	<div class="tsb_intro">\n		노혜민님 음성주문에 오신걸 환영해요!<br/>\n		<b>배송지</b>, <b>결제수단</b> 등록 후<br/>\n		음성으로 주문 및 결제가 가능해요.\n	</div>\n	<div class="tsb_infobox">\n		<div class="tsb_del">\n			<div ng-if="!ts_basicInfo.et_mbr_dlvp_chk" class="btn_init">\n				<a ng-click="changeBasicInfo(1)">배송지 입력하기</a>\n			</div>\n			<div ng-if="ts_basicInfo.et_mbr_dlvp_chk" class="btn_fill">\n				<span>{{ts_basicInfo.post_addr}} {{ts_basicInfo.dtl_addr}}</span>\n				<a ng-click="changeBasicInfo(1)">변경</a>\n			</div>\n		</div>\n		<div class="tsb_pay">\n			<div ng-if="!ts_basicInfo.base_op_pay_chk" class="btn_init">\n				<a ng-click="changeBasicInfo(2)">결제수단 등록하기</a>\n			</div>\n			<div ng-if="ts_basicInfo.base_op_pay_chk" class="btn_fill">\n				<span>{{ts_basicInfo.pay_mean_nm}}</span>\n				<a ng-click="changeBasicInfo(2)">변경</a>\n			</div>\n		</div>\n	</div>\n	<div class="tsb_btns">\n		<div ng-if="!ts_basicInfo.initiated" class="tsb_btn2">\n			<div class="later">\n				<a ng-click="closeBasicInfo(0)">나중에 할래요</a>\n			</div>\n			<div class="start">\n				<a ng-click="closeBasicInfo(1)">시작하기</a>\n			</div>\n		</div>\n		<div ng-if="ts_basicInfo.initiated" class="tsb_btn1">\n			<div>\n				<a ng-click="closeBasicInfo(2)">확인</a>\n			</div>\n		</div>\n	</div>\n	<div class="tsb_info">\n		<ul>\n			<li>등록하신 배송지와 결제수단으로 주문결제되며,<br/>\n			설정 &gt;사전정보 등록 화면에서 추후 수정 가능합니다.</li>\n			<li>주문하신 상품은 마이롯데에서 확인 가능합니다.</li>\n			<li>일부지역은 배송이 제한될 수 있어 상품페이지 참조 바랍니다.</li>\n		</ul>\n	</div>\n</div>\n\n<div class="ts_cont ts_guide" ng-if="ts_basicInfo.showGuideInfo">\n	<a class="tsg_close" ng-click="showHideGuidePop(false)"></a>\n	<div class="tsg_img tsgi1" ng-if="ts_currentStep==1"><img ng-src="http://image.lotte.com/lotte/mo2017/talk/talkshop_info1.png" /></div>\n	<div class="tsg_img tsgi2" ng-if="ts_currentStep==2"><img ng-src="http://image.lotte.com/lotte/mo2017/talk/talkshop_info2.png" /></div>\n	<div class="tsg_img tsgi3" ng-if="ts_currentStep==3"><img ng-src="http://image.lotte.com/lotte/mo2017/talk/talkshop_info3.png" /></div>\n	<div class="tsg_mic"></div>\n</div>\n\n<div talk-shop-tts class="ts_tts">\n	<audio id="tts_audio" controls="controls" autoplay="autoplay"></audio>\n</div>\n\n</section>')}]);