angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mylotte/present/present_list_container.html",'<section id="container">\r\n	<!-- 선물함 수신자 인증 -->\r\n	<section class="present_check" ng-if="UIStatus.isSearchingGift==true">\r\n		<div class="notice">\r\n			<ul>\r\n				<li>마이롯데에서도 선물함을 확인하실 수 있습니다.</li>\r\n				<li>선물 받으신 내역 확인을 위해 휴대폰번호와 비밀번호를 입력하세요 (로그인시 최초 1회 인증)</li>\r\n			</ul>\r\n		</div>\r\n		<div class="forms">\r\n			<div class="phone">\r\n				<div class="formwrap select">\r\n					<select id="srh_phone_no1">\r\n						<option value="010" selected="selected">010</option>\r\n						<option value="011">011</option>\r\n						<option value="016">016</option>\r\n						<option value="017">017</option>\r\n						<option value="018">018</option>\r\n						<option value="019">019</option>\r\n						<option value="0502">0502</option>\r\n						<option value="0505">0505</option>\r\n					</select>\r\n				</div>\r\n				<div class="formwrap">\r\n					<input type="number" pattern="[0-9]*" min="0" max="9999" maxlength="4" id="srh_phone_no2" ng-keyup="searchRestrictInput(\'srh_phone_no2\')" />\r\n				</div>\r\n				<div class="formwrap">\r\n					<input type="number" pattern="[0-9]*" min="0" max="9999" id="srh_phone_no3" ng-keyup="searchRestrictInput(\'srh_phone_no3\')" />\r\n				</div>\r\n			</div>\r\n			<div class="formwrap password">\r\n				<input type="number" pattern="[0-9]*" max="9999" placeholder="선물함 비밀번호 4자리를 입력해주세요" id="srh_password" ng-keyup="searchRestrictInput(\'srh_password\')" />\r\n			</div>\r\n			<div class="button">\r\n				<button ng-click="searchReceivedGift()">확인</button>\r\n			</div>\r\n		</div>\r\n	</section>\r\n	<!-- 선물함 수신자 인증 -->\r\n\r\n	<!-- 선물함 목록 -->	\r\n	<section class="present_list" ng-if="UIStatus.isSearchingGift==false">\r\n		<div class="main_tab">\r\n			<a ng-click="selectPresentList(0)" ng-class="{on:UIData.presentListTab==0}">받은 선물함</a>\r\n			<a ng-click="selectPresentList(1)" ng-class="{on:UIData.presentListTab==1}">보낸 선물함</a>\r\n		</div>\r\n		<!-- 받은 선물함 -->\r\n		<div class="list_wrap receive_list" ng-if="UIData.presentListTab==0">\r\n			<div class="list_count" ng-if="UIData.receivedList.gift_lst.items && UIData.receivedList.gift_lst.items.length > 0">총<em>{{UIData.receivedList.gift_lst.items.length}}</em>개</div>\r\n			\r\n			<ul>\r\n				<li ng-repeat="item in UIData.receivedList.gift_lst.items track by $index">\r\n					<div class="order_no">\r\n						<a ng-click="goPresentDetail(item)">{{item.gift_info.order_no | convertOrderNumber}}</a>\r\n					</div>\r\n					<div class="list_item">\r\n						<div class="item_head" ng-if="item.gift_info.type==\'01\'" ng-class="{rbtn:item.gift_info.commentable}">\r\n							<div ng-if="item.gift_info.commentable">\r\n								<span class="deli_stat">{{checkStatus(item)}}</span>\r\n								{{item.delivery_info.deliver}}<span class="deli_no">{{item.delivery_info.invoice}}</span>\r\n								<a ng-click="checkDeliveryState(item)">배송조회</a>\r\n							</div>\r\n							<div ng-if="!item.gift_info.commentable">\r\n								<span class="deli_stat">{{checkStatus(item)}}</span>\r\n								{{LV.DELIVER_MSG[item.gift_info.status]}}\r\n							</div>\r\n							\r\n						</div>\r\n						<div class="item_body" ng-click="goPresentDetail(item)">\r\n							<div class="img"><img ng-src="{{item.gift_pdf_info.img_url}}" /></div>\r\n							<div class="txt">\r\n								<div class="sender">{{item.gift_info.from_nm}}</div>\r\n								<div class="flags">\r\n									<span class="flag depart" ng-if="item.gift_pdf_info.mall_flag.is_dept">롯데백화점</span>\r\n									<span class="flag etv" ng-if="item.gift_pdf_info.mall_flag.is_tvhome">롯데홈쇼핑</span>\r\n									<span class="flag smart" ng-if="item.gift_pdf_info.mall_flag.is_smartpick">스마트픽</span>\r\n								</div>\r\n								<div class="prd_name"><span ng-if="item.gift_pdf_info.brand_nm && item.gift_pdf_info.brand_nm!=\'\'">[{{item.gift_pdf_info.brand_nm}}]</span>{{item.gift_pdf_info.goods_nm}}</div>\r\n								<div class="prd_opt" ng-if="item.gift_pdf_info.selected_opt && item.gift_pdf_info.selected_opt.length > 0">\r\n									<span ng-repeat="opt in item.gift_pdf_info.selected_opt track by $index">{{opt.opt_name}}:{{opt.opt_value}}</span>\r\n								</div>\r\n								<div class="prd_cancel" ng-if="item.gift_info.canceled">해당 상품은 배송되지 않습니다.</div>\r\n							</div>\r\n						</div>\r\n						<!--20161206-->\r\n						<div class="item_foot" ng-if="item.gift_info.commentable || item.gift_info.rtgs_psb_yn == \'Y\' || item.gift_info.exch_psb_yn == \'Y\'"> <!--ng-if="item.gift_info.commentable"-->\r\n						    <a class="gray" ng-click="open_er_psb(item, 1, $index)" ng-class="{on:er_psb_case <= 2 && er_psb_case > 0 && er_index == $index}" ng-if="item.gift_info.rtgs_psb_yn == \'Y\'">반품신청</a>\r\n						    <a class="gray" ng-click="open_er_psb(item, 3, $index)" ng-class="{on:er_psb_case > 2  && er_index == $index}" ng-if="item.gift_info.exch_psb_yn == \'Y\'">교환신청</a>\r\n							<a class="comment" ng-click="goCommentWrite(item)" ng-if="item.gift_info.commentable">선물 후기 작성</a>\r\n							<!-- <a ng-if="false" class="coupon">교환권 전송</a> -->\r\n						</div>\r\n					</div>\r\n                    <!--반품신청 전-->\r\n                    <div class="change_order_box" ng-if="er_psb_case == 1 && er_index == $index">\r\n                        <div class="mtable mg6">\r\n                            <div class="mcell left">반품사유</div>\r\n                            <div class="mcell sarow">\r\n                                <select id="rfg_select{{$index}}">\r\n                                    <option value="0">반품 사유를 선택해 주세요.</option>\r\n                                    <option ng-repeat="opt in UIData.receivedList.rtgs_rsn_list" value="{{opt.ob_rsn_cd}}">{{opt.ob_rsn_nm}}</option>                                    \r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class="info_title"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/mylotte/icon_20161115.png"> 반품 진행 안내</div>\r\n                        <ul class="info_list">\r\n                            <li>{{co_msg[0]}}</li>\r\n                            <li>{{co_msg[1]}}</li>\r\n                        </ul>\r\n                        <div class="btn_group">\r\n                            <a ng-click="close_er_psb()">닫기</a>\r\n                            <a ng-click="send_er_psb(item, \'114\', $index)" class="ok_btn">반품신청</a>\r\n                        </div>						    \r\n                    </div>\r\n                    <!--반품신청 후-->\r\n                    <div class="change_order_box" ng-if="er_psb_case == 2 && er_index == $index">\r\n                        <div class="info_msg">{{co_msg[4]}}</div>\r\n                        <div class="info_title"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/mylotte/icon_20161115.png"> 반품 진행 안내</div>\r\n                        <ul class="info_list">\r\n                            <li>{{co_msg[0]}}</li>\r\n                            <li>{{co_msg[1]}}</li>\r\n                        </ul>\r\n                        <div class="btn_group">\r\n                            <a ng-click="close_er_psb()">닫기</a>\r\n                        </div>						    \r\n                    </div>	                   \r\n                    <!--교환신청 전-->\r\n                    <div class="change_order_box" ng-if="er_psb_case == 3 && er_index == $index">\r\n                        <div class="mtable">\r\n                            <div class="mcell left">상품옵션</div>\r\n                            <div class="mcell sarow">\r\n                                <select id="opt_select{{$index}}">\r\n                                    <option value="-1">옵션변경시 선택해 주세요.</option>\r\n                                    <option ng-repeat="opt in selectOptList" value="{{opt.item_no}}">{{opt.opt_stat}} {{opt.opt_nm}}</option>                                    \r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class="mtable mg6">\r\n                            <div class="mcell left">교환사유</div>\r\n                            <div class="mcell sarow">\r\n                                <select id="exch_select{{$index}}">\r\n                                    <option value="0">교환 사유를 선택해 주세요.</option>\r\n                                    <option ng-repeat="opt in UIData.receivedList.exch_rsn_list" value="{{opt.ob_rsn_cd}}">{{opt.ob_rsn_nm}}</option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class="info_title"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/mylotte/icon_20161115.png"> 교환 진행 안내</div>\r\n                        <ul class="info_list">\r\n                            <li>{{co_msg[2]}}</li>\r\n                            <li>{{co_msg[3]}}</li>\r\n                        </ul>\r\n                        <div class="btn_group">\r\n                            <a ng-click="close_er_psb()">닫기</a>\r\n                            <a ng-click="send_er_psb(item, \'115\', $index)" class="ok_btn">교환신청</a>\r\n                        </div>						    \r\n                    </div>\r\n                    <!--교환신청 후-->\r\n                    <div class="change_order_box" ng-if="er_psb_case == 4 && er_index == $index">\r\n                        <div class="info_msg">{{co_msg[5]}}</div>\r\n                        <div class="info_title"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/mylotte/icon_20161115.png"> 교환 진행 안내</div>\r\n                        <ul class="info_list">\r\n                            <li>{{co_msg[2]}}</li>\r\n                            <li>{{co_msg[3]}}</li>                        \r\n                        </ul>\r\n                        <div class="btn_group">\r\n                            <a ng-click="close_er_psb()">닫기</a>\r\n                        </div>						    \r\n                    </div>\r\n				\r\n				</li>\r\n			</ul>\r\n			\r\n			<a href="#" onclick="return false;" class="search_gift" ng-click="showSearchGift()">받은 선물이 안보이시나요?</a>\r\n		</div>\r\n		<!-- 받은 선물함 -->\r\n		\r\n		<!-- 보낸 선물함 -->\r\n		<div class="list_wrap send_list" ng-if="UIData.presentListTab==1">\r\n			<div ng-if="UIData.sentList.gift_lst.items.length > 0">\r\n				<!--<div class="list_count">총<em>{{sendGift_total}}</em>개</div>-->\r\n				<!--20161215 추가-->\r\n				<div class="list_count sort">\r\n				    <a ng-click="selectSort(0)" ng-class="{on:sortType == 0}">전체({{sendGift_total}})</a>\r\n				    <a ng-click="selectSort(1)" ng-class="{on:sortType == 1}">수락({{sendGift_get}})</a>\r\n				    <a ng-click="selectSort(2)" ng-class="{on:sortType == 2}">미수락({{sendGift_yet}})</a>\r\n				    <a ng-click="selectSort(3)"  ng-class="{on:sortType == 3}" ng-if="sendGift_end > 0">취소({{sendGift_end}})</a>\r\n				</div>\r\n				<ul class="list">\r\n					<li ng-repeat="item in UIData.sentList.gift_lst.items track by $index" ng-if="sortType == 0 || sortType == item.giftType"> \r\n						<div class="order_no">\r\n							<a ng-click="goPurseDetail(item)">{{item.gift_info.order_no | convertOrderNumber}}</a>\r\n						</div>\r\n						<div class="list_item">\r\n							<div class="item_head" ng-if="item.gift_info.type==\'01\' && item.gift_info.status != \'11\' && item.gift_info.status != \'12\'">\r\n								<div ng-if="item.gift_info.commentable">\r\n									<span class="deli_stat">{{checkStatus(item)}}</span>{{item.delivery_info.deliver}}<span class="deli_no">{{item.delivery_info.invoice}}</span>\r\n									<a ng-click="checkDeliveryState(item)">배송조회</a>\r\n								</div>\r\n								<div ng-if="!item.gift_info.commentable">\r\n									<span class="deli_stat">{{checkStatus(item)}}</span>{{LV.DELIVER_MSG[item.gift_info.status]}}\r\n								</div>\r\n							</div>\r\n							<!--주문완료 20161110-->\r\n							<div class="item_head" ng-if="item.gift_info.type==\'01\' && item.gift_info.status == \'11\'">\r\n							     <!--20170102 수락전이면서 대량인경우-->\r\n								<div ng-if="item.gift_info.gift_acq_agr_yn == \'\' && item.gift_info.to_telno == \'00000000000\'">\r\n									<span class="deli_stat">{{LV.DELIVER_STAT[item.gift_info.status]}}</span>{{LV.DELIVER_MSG["28"]}}									\r\n								</div>\r\n							    <!--수락전이면서 일반-->\r\n								<div ng-if="item.gift_info.gift_acq_agr_yn == \'\' && item.gift_info.to_telno != \'00000000000\'">\r\n									<span class="deli_stat">{{LV.DELIVER_STAT[item.gift_info.status]}}</span>{{LV.DELIVER_MSG["24"]}}\r\n									<a ng-click="sendAlarm(item)" ng-if="show_alarmbtn(item)">알람 보내기</a>\r\n								</div>\r\n								<div ng-if="item.gift_info.gift_acq_agr_yn == \'Y\'">\r\n									<span class="deli_stat">{{LV.DELIVER_STAT[item.gift_info.status]}}</span>{{LV.DELIVER_MSG["23"]}}\r\n								</div>\r\n								<div ng-if="item.gift_info.gift_acq_agr_yn == \'N\'">\r\n									<span class="deli_stat">{{LV.DELIVER_STAT[item.gift_info.status]}}</span>{{LV.DELIVER_MSG["27"]}}\r\n									<a ng-click="viewRefuse(item)" class="refuse">사유 보기</a>\r\n								</div>								\r\n							</div>\r\n							<!--주문취소 20161110-->\r\n							<div class="item_head" ng-if="item.gift_info.type==\'01\' && item.gift_info.status == \'12\'">\r\n								<div ng-if="item.gift_info.gift_acq_agr_yn == \'N\'">\r\n									<span class="deli_stat">{{LV.DELIVER_STAT[item.gift_info.status]}}</span>{{LV.DELIVER_MSG["26"]}}\r\n									<a ng-click="viewRefuse(item)"  class="refuse">사유 보기</a>\r\n								</div>\r\n								<div ng-if="item.gift_info.gift_acq_agr_yn != \'N\'">\r\n									<span class="deli_stat">{{LV.DELIVER_STAT[item.gift_info.status]}}</span>{{LV.DELIVER_MSG["25"]}}\r\n								</div>\r\n							</div>\r\n							\r\n							\r\n							<div class="item_body" ng-click="goPurseDetail(item)">\r\n								<div class="img"><img ng-src="{{item.gift_pdf_info.img_url}}" /></div>\r\n								<div class="txt">\r\n									<div class="sender">{{item.gift_info.to_nm}}</div>\r\n									<div class="flags">\r\n										<span class="flag depart" ng-if="item.gift_pdf_info.mall_flag.is_dept">롯데백화점</span>\r\n										<span class="flag etv" ng-if="item.gift_pdf_info.mall_flag.is_tvhome">롯데홈쇼핑</span>\r\n										<span class="flag smart" ng-if="item.gift_pdf_info.mall_flag.is_smartpick">스마트픽</span>\r\n									</div>\r\n									<div class="prd_name"><span ng-if="item.gift_pdf_info.brand_nm!=\'\'">[{{item.gift_pdf_info.brand_nm}}]</span>{{item.gift_pdf_info.goods_nm}}</div>\r\n									<div class="prd_opt" ng-if="item.gift_pdf_info.selected_opt && item.gift_pdf_info.selected_opt.length > 0">\r\n										<span ng-repeat="opt in item.gift_pdf_info.selected_opt track by $index">{{opt.opt_name}}:{{opt.opt_value}}</span>\r\n									</div>\r\n									<div class="prd_cancel" ng-if="item.gift_info.canceled">해당 상품은 배송되지 않습니다.</div>\r\n								</div>\r\n							</div>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<!--20161110 UIData.sentList.gift_lst.items == null ||-->\r\n			<div class="nosendgift" ng-if="UIData.sentList.gift_lst.items.length == 0">\r\n				<div class="txt1">아직 <em>보내신 선물</em>이 없습니다.</div>\r\n				<div class="txt2">롯데닷컴 선물 서비스로 마음을 전해보세요.</div>\r\n				<a class="shoplink" ng-href="{{URLs.MAIN_URL+\'?\'+baseParam+\'&dispNo=5556743\'}}">선물매장 구경하기</a>\r\n			</div>\r\n		</div>\r\n		<!-- 보낸 선물함 -->\r\n		\r\n	</section>\r\n	<!-- 선물함 목록 -->	\r\n\r\n	<!-- LOADING -->\r\n	<div class="ajax_loading" ng-if="UIStatus.isReceivedLoading || UIStatus.isSentLoading">\r\n		<p class="loading half"></p>\r\n	</div>\r\n	<!--// LOADING -->\r\n\r\n	<!-- 거절사유 팝업 2016.10.24 -->\r\n	<div class="commonPop rejectionPop" ng-if="reject_pop">\r\n		<div class="bg" ></div>\r\n		<div class="box">\r\n			<div class="popBox">\r\n				<h2>거절사유</h2>\r\n				<div class="cont">\r\n					<p>{{rfg_message}}</p>\r\n				 </div>\r\n				<div class="foot">\r\n					<a href="#" ng-click="close_pop()">확인</a>\r\n				</div>\r\n				<a class="btnClose" href="#" ng-click="close_pop()" >닫기</a>	\r\n			</div>\r\n		</div>\r\n	</div>		\r\n	<!-- //거절사유 팝업 2016.10.24 -->	\r\n	<!-- 알람보내기 팝업 2016.10.24 -->\r\n	<div class="commonPop send_notification" ng-if="send_alarm">\r\n		<div class="bg" ></div>\r\n		<div class="box">\r\n			<div class="popBox">\r\n				<h2>알림 문자 보내기</h2>\r\n				<div class="cont">\r\n					<p>선물수신자에게 선물을 수락할 수 있도록<br/>안내 문자를 재발송 해드립니다. </p>\r\n					<ul>\r\n						<li>발송 가능 기간 :<span> {{send_diff}}</span></li>\r\n						<li>발송 가능 횟수 : 기간 동안 최대 3번 (남은횟수: <em>{{send_cnt}}</em>)</li>\r\n					</ul>\r\n				</div>\r\n				<div class="foot">\r\n					<ul>\r\n						<li><a href="#" ng-click="close_pop()">닫기</a></li>\r\n						<li><a href="#" ng-click="sendAlarmFnc()">보내기</a></li>\r\n					</ul>\r\n				</div>\r\n				<a class="btnClose" href="#" ng-click="close_pop()">닫기</a>\r\n			</div>\r\n		</div>\r\n	</div>		\r\n	<!-- //알람보내기 팝업 2016.10.24 -->		\r\n			\r\n	<!-- 담긴 상품이 없을 경우 -->\r\n	<!-- <section class="" ng-show="true">\r\n		<p class="noData">선물함에 담긴 상품이 없습니다.</p>\r\n	</section> -->\r\n	<!-- // 담긴 상품이 없을 경우 -->\r\n</section>')}]);