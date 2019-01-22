angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/login/login_form_container.html",'<section id="lotteLoginFormCont" ng-show="contVisible" >\r\n	<ul id="smp_nav" ng-if="smp_yn">\r\n		<li><a ng-click="promotionUrl()"><span>LOTTE smart pick</span></a></li>\r\n		<li class="on"><a ng-click="pickListUrl()"><span>my 교환권</span></a></li>\r\n		<li><a ng-click="setupUrl()"><span>설정</span></a></li>\r\n	</ul>\r\n	<form id="frm" name="frm" method="post" action="" onsubmit="">\r\n		<input type="hidden" name="targetUrl" id="targetUrl" value="{{targetUrl}}" />\r\n		<input type="hidden" id="udid" name="udid" value="{{udid}}" />\r\n		<input type="hidden" name="schema" value="{{schema}}" />\r\n		<input type="hidden" name="grockle_yn" value="" ng-model="grockle_yn" ng-value="{{grockle_yn}}" />\r\n		<input type="hidden" name="app_login_form" value="N" />\r\n		<input type="hidden" name="mach_knd_cd" value="{{mach_knd_cd}}" />\r\n		<input type="hidden" name="mbl_app_ver_val" value="{{v}}" />\r\n		<input type="hidden" name="fromPg" ng-model="fromPg" value="{{fromPg}}" /> <!-- 0 = 로그인, 1 = 비회원 구매하기, 2 = 비회원 주문조회 구분 값 -->\r\n		<input type="hidden" name="simpleSignMember" id="simpleSignMember" ng-model="simpleSignYn" value="{{simpleSignYn}}" /> <!-- ng-value=" simpleSignYn = \'N\' " 간편 로그인 유무 -->\r\n		<input type="hidden" name="adultChkDrmc" id="adultChkDrmc" value="{{adultChk}}" />\r\n\r\n		<input type="hidden" name="minority_yn" id="minority_yn" ng-model="minority_yn" value="{{minority_yn}}" />\r\n		<input type="hidden" name="reg_status" id="reg_status" ng-model="reg_status" value="{{reg_status}}" />\r\n		<!-- 20160113 추가 -->\r\n		<input type="hidden" name="drmcCust_id" id="drmcCust_id" ng-model="drmcCust_id" value="{{drmcCust_id}}"  />\r\n\r\n		<!-- 20160310 추가 -->\r\n		<input type="hidden" name="mbrIP" id="mbrIP" ng-model="mbrIP" value="{{mbrIP}}"  />\r\n\r\n		<!-- 로그인 -->\r\n		<section class="easy_login_wrap type2017" >\r\n			<p class="login_des" ng-if="isSmartpick == \'Y\'"><img src="http://image.lotte.com/lotte/mobile/smartpick/common/login_des0326.gif" alt="LOTTE smart pick 방문을 진심으로 환영합니다."></p>\r\n			<ul class="menu type2" ng-if="isSmartpick != \'Y\'">\r\n				<li class="list-tab" id="tab_lpoint" ng-class="{on : isOnTab == 0 || isOnTab == 1 || isOnTab == 3}">\r\n					<a ng-click="tabFunc(0)">L.POINT 통합/간편 회원</a>\r\n				</li>\r\n				<li class="list-tab" id="tab_only"  ng-class="{on : isOnTab == 2}">\r\n					<a ng-click="tabFunc(2)">비회원 주문조회</a>\r\n				</li>\r\n			</ul>\r\n			<p class="adult_txt" ng-if="adultChk && isSmartpick != \'Y\' && (isOnTab == 0 || isOnTab == 1)">19세 미만의 청소년에게 접근이 제한된 정보입니다.<br><span>본인인증 후 이용이 가능합니다.</span></p>\r\n			<ul class="menu radio" ng-if="(isOnTab == 0 || isOnTab == 1 || isOnTab == 3)">\r\n				<li>\r\n					<span class="combo">\r\n						<input type="radio" ng-click="tabFunc(3)" name="mem_login" id="mem_login1" value="" class="radio01" checked="">\r\n						<label for="mem_login1"><span>L.POINT 통합 회원</span></label>\r\n					</span>\r\n				</li>\r\n				<li>\r\n					<span class="combo">\r\n						<input type="radio" ng-click="tabFunc(1)" name="mem_login" id="mem_login2" value="" class="radio01">\r\n						<label for="mem_login2"><span>간편가입 계정</span></label>\r\n					</span>\r\n				</li>\r\n			</ul>\r\n\r\n			<!-- 회원 -->\r\n			<div class="easy_login_box" ng-if="sysChkYn == \'N\'">\r\n				<article class="member sub-tab" style="display: block;">\r\n					<fieldset>\r\n						<legend>L.POINT 통합회원 로그인</legend>\r\n						<p class="info_txt" ng-if="isSmartpick == \'Y\'"><span>간편가입 계정은 엘롯데, 롯데닷컴 등 일부 사이트만 이용 가능합니다.</span></p>\r\n						<p class="info_txt" ng-if="isSmartpick != \'Y\'"><span>L.POINT 통합 회원은 한 아이디로 롯데 전 계열사를 이용 가능합니다. </span></p>\r\n						<ul class="easy_login_input">\r\n							<li><input type="text" class="txt01" id="userId" value="{{saveId}}" ng-model="lPointId" name="userId" value="" placeholder="아이디 또는 이메일 아이디" title="아이디 또는 이메일 아이디" maxlength="200" autocapitalize="off"></li>\r\n							<li><input type="password" class="txt01" id="lPointPw" ng-model="lPointPw"  name="lPointPw"  ng-keyup="fn_enterKeyUp(this.name, $event)" placeholder="비밀번호" title="비밀번호" maxlength="200"></li>\r\n							<li>\r\n								<span>\r\n									<input type="checkbox" class="check01" id="auto" name="auto" value="1" title="자동 로그인" checked onclick="this.checked == true? this.value=\'1\' : this.value=\'\'">\r\n									<label for="auto">자동 로그인</label>\r\n								</span>\r\n								<span>\r\n									<input type="checkbox" class="check01" id="save" name="save" value="1" title="아이디 저장" checked onclick="this.checked == true? this.value=\'1\' : this.value=\'\'">\r\n									<label for="save">아이디 저장</label>\r\n								</span>\r\n								<span class="keyboard" ng-click="keyboardToggle(0)">\r\n									<a href="#go" class="on">한글자판열기</a>\r\n								</span>\r\n							</li>\r\n						</ul>\r\n						<div class="keyboard_layer" style="display: none;"><img src="http://image.lotte.com/lotte/mobile/mobile_new/footer/login_keyboard.png" alt="키보드화면"></div>\r\n						<div class="login_btn01">\r\n							<a href="#go" class="c_btn col01"  ng-click="checkLogin(\'N\')"><span>로그인</span></a>\r\n						</div>\r\n\r\n						<!-- 아이디찾기 / 비밀번호찾기 / 회원가입 -->\r\n						<ul ng-if="joinBtnViewYn != \'N\'" class="join_link_wrap">\r\n							<li><a href="#none" ng-click="goFamilySite(\'id\')">아이디 찾기</a></li>\r\n							<li><a href="#none" ng-click="goFamilySite(\'passwd\')">비밀번호 찾기</a></li>\r\n							<li><a href="#none" ng-click="goFamilySite(\'mem_reg\')">회원가입</a></li>\r\n						</ul>\r\n\r\n						<div class="new_msg" ng-if="joinBtnViewYn != \'N\'">간편가입 회원이실 경우 간편가입 계정 선택 후 회원정보를 찾아주세요.</div>\r\n\r\n						<!-- 회원가입불가 안내 -->\r\n						<div ng-if="joinBtnViewYn == \'N\'" id="ios_text" class="unable_join">\r\n							[아이디/비밀번호 찾기, 회원가입] 서비스는 일시적으로 <br />\r\n							롯데닷컴/엘롯데 PC를 통해 이용가능합니다.<br />\r\n							이용에 불편을 드려 죄송합니다.\r\n						</div>\r\n\r\n						<ul class="join_link_wrap">\r\n							<!--  비회원 구매하기 -->\r\n							<li class="none_member" ng-show="fromPg != \'3\' && minority_yn != \'Y\' && smp_buy_yn != \'Y\' && fromPg != \'0\' && fromGift == \'0\'"><i></i><a class="btn_view_buy" id="buy" href="#none" ng-click="none_member_buy()">비회원 구매하기</a></li>\r\n\r\n							<!--  비회원 주문조회 -->\r\n							<!-- <li class="none_member" ng-show="fromPg == \'3\'"><i></i><a class="btn_view_order" id="search" href="#none" ng-click="none_member_search()">비회원 주문조회</a></li> -->\r\n						</ul>\r\n\r\n						<!-- Social Login /-->\r\n						<div ng-if="socialLoginFlag" class="social_login_wrap">\r\n							<ul>\r\n								<li class="social_facebook"><a ng-click="fbLogin()" class="btn_social_login">페이스북으로 로그인</a></li>\r\n								<li class="social_naver"><a ng-click="naverLogin()" class="btn_social_login">네이버로 로그인</a></li>\r\n							</ul>\r\n						</div>\r\n					</fieldset>\r\n				</article>\r\n				<!-- //회원 -->\r\n\r\n				<!-- 비회원 -->\r\n				<article class="nonmember sub-tab" style="display: none">\r\n					<fieldset>\r\n						<legend>간편가입 계정 로그인</legend>\r\n						<!-- <p class="adult_txt" ng-if="adultChk">19세 미만의 청소년에게 접근이 제한된 정보입니다.<br><span>본인인증 후 이용이 가능합니다.</span></p> -->\r\n						<p class="info_txt"><span>간편가입 계정은 롯데닷컴, 엘롯데 등 일부 사이트만 이용 가능합니다.</span></p>\r\n						<ul class="easy_login_input">\r\n							<li><input type="text" class="txt01" id="userIdEasy" value="{{saveIdEasy}}" name="userIdEasy" placeholder="이메일 아이디" title="이메일 아이디" maxlength="200" autocapitalize="off"></li>\r\n							<li><input type="password" class="txt01" id="userPwEasy" name="userPwEasy" placeholder="비밀번호" title="비밀번호" maxlength="200"></li>\r\n							<li>\r\n								<span>\r\n									<input type="checkbox" class="check01" id="autoEasy" name="autoEasy" value="1"  title="자동 로그인" checked onclick="this.checked == true? this.value=\'1\' : this.value=\'\'">\r\n									<label for="autoEasy">자동 로그인</label>\r\n								</span>\r\n								<span>\r\n									<input type="checkbox" class="check01" id="saveEasy" name="saveEasy" value="1"  title="계정 저장" checked onclick="this.checked == true? this.value=\'1\' : this.value=\'\'">\r\n									<label for="saveEasy">계정 저장</label>\r\n								</span>\r\n								<span class="keyboard" ng-click="keyboardToggle(1)">\r\n									<a href="#go" class="on">한글자판열기</a>\r\n								</span>\r\n							</li>\r\n						</ul>\r\n						<div class="keyboard_layer"><img src="http://image.lotte.com/lotte/mobile/mobile_new/footer/login_keyboard.png" alt="키보드화면"></div>\r\n						<div class="login_btn01">\r\n							<a href="#go" class="c_btn col01" ng-click="checkLogin(\'N\')"><span>로그인</span></a>\r\n						</div>\r\n\r\n						<ul class="join_link_wrap">\r\n							<li><a href="#" ng-click="goSimpleMemberId()">계정 찾기</a></li>\r\n							<li><a href="#" ng-click="goSimpleMemberPw()">비밀번호 찾기</a></li>\r\n						</ul>\r\n\r\n						<ul class="join_link_wrap">\r\n							<!--  비회원 구매하기 -->\r\n							<li class="none_member" ng-show="fromPg != \'3\' && minority_yn != \'Y\' && smp_buy_yn != \'Y\' && fromPg != \'0\' && fromGift == \'0\'"><i></i><a class="btn_view_buy" id="buy" href="#none" ng-click="none_member_buy()">비회원 구매하기</a></li>\r\n							<!--  비회원 주문조회 -->\r\n							<!-- <li class="none_member" ng-show="fromPg == \'3\'"><i></i><a class="btn_view_order" id="search" href="#none" ng-click="none_member_search()">비회원 주문조회</a></li> -->\r\n						</ul>\r\n					</fieldset>\r\n				</article>\r\n				<!-- //비회원 -->\r\n				<!-- 비회원 주문조회 -->\r\n				<!-- 20170502로그인화면개선 -->\r\n				<section class="view_order_wrap type2017 nonmember sub-tab" id="view_order_wrap">\r\n					<fieldset>\r\n						<legend>비회원 주문조회</legend>\r\n						<div class="view_order_box">\r\n							<h3 class="view_order_title">비회원의 주문번호와 이메일 주소를 입력해주세요.</h3>\r\n							<h3 class="view_order_title2">주문일로부터 1년 이내 주문정보만 조회 가능합니다.</h3>\r\n							<ul class="view_order_input">\r\n								<li><input type="tel" name="ord_no" class="txt01" placeholder="주문번호 (예시 : 2015-02-01-1234567)" title="주문번호" maxlength="1000"></li>\r\n								<li><input type="text" name="grockle_mail" class="txt01" placeholder="이메일 주소" title="비밀번호" ng-keyup="fn_enterKeyUp( event )" maxlength="1000"></li>\r\n							</ul>\r\n							<div class="view_order_btn">\r\n								<a href="#go" class="c_btn col01" ng-click="searchOrderNum()"><span>비회원 주문조회</span></a>\r\n							</div>\r\n							<p class="join_txt">회원가입하시면  다양한 쿠폰/포인트 등<br>혜택을 받으실 수 있습니다.</p>\r\n							<div class="join_btn">\r\n								<a href="#" ng-click="goFamilySite(\'mem_reg\')"><span>회원가입</span></a>\r\n							</div>\r\n						</div>\r\n					</fieldset>\r\n				</section>\r\n				<!-- //비회원 주문조회 -->\r\n				<section ng-show="sysChkYn == \'Y\'">\r\n					<!--서비스 점검 페이지-->\r\n					<div class="boxA">\r\n						<div class="boxB">\r\n							<p>점검시간 : <span>2013년 5월 12일 AM 02:00~05:30</span></p>\r\n							<p>작업시간동안 <span>로그인 서비스</span>를 이용하실 수 없습니다.</p>\r\n						</div>\r\n						<div class="boxB">\r\n							롯데닷컴을 사랑하시는 고객님들께 불편을 드려 대단히 죄송합니다.<br>\r\n							빠른시간 내에 작업을 마치고 정상화 할 수 있도록 노력하겠습니다.\r\n						</div>\r\n					</div>\r\n				</section>\r\n			</div>\r\n		</section>\r\n		<!-- //로그인 -->\r\n\r\n		<!-- 비회원 구매하기 -->\r\n		<section class="login">\r\n			<div class="nonmember sub-tab" id="view_order_wrap2" >\r\n				<div ng-show="minority_yn == \'Y\'">\r\n					 <div class="btn_member">\r\n						<span class="txt">\r\n							<b>비회원은 이용하실 수 없습니다.</b><br>\r\n							이 상품은 청소년유해매체물로서<br>\r\n							정보통신망 이용촉진 및 정보보호 등에 관한<br>\r\n							법률 및 청소년보호법의 규정에 의하여<br>\r\n							19세 미만의 청소년이 이용할 수 없습니다.\r\n						</span>\r\n					</div>\r\n				</div>\r\n				<div ng-show="smp_buy_yn == \'Y\'">\r\n					<div class="btn_member">\r\n						<span class="txt">\r\n							<b>스마트픽</b><br>\r\n							1.스마트픽 상품은 로그인후 구매하실 수 있습니다.<br>\r\n							2.회원 로그인 후 서비스를 이용하세요.<br>\r\n						</span>\r\n					</div>\r\n				</div>\r\n				<div class="non_buy" ng-show="minority_yn != \'Y\' && smp_buy_yn != \'Y\'">\r\n					<span class="txt">비회원으로 상품을 구매하시면<br>롯데닷컴의 쿠폰/포인트 등의 혜택을 받으실 수 없습니다.</span>\r\n					<div class="btn"><a ng-click="buy()" class="c_btn col01"><span>비회원 구매하기</span></a></div>\r\n				</div>\r\n				<div ng-show="isEllotte == true">\r\n					<div class="non_order">\r\n						<p>2014년 9월 22일 이전주문 내역 조회는 <br>고객센터 (1899-2500)로 문의해주시기 바랍니다.</p>\r\n					</div>\r\n				</div>\r\n				<!-- ELLOTTE PROJECT : HSLIM8 END -->\r\n				<div class="btn_member">\r\n					<span class="txt">\r\n						L.Point 회원가입을 하시면<br>할인쿠폰과 L-money 등의 혜택을 드립니다.<br>\r\n						<em>모바일로 상품 구매시 카드/쿠폰할인 등<br>푸짐한 혜택을 드립니다.</em>\r\n					</span>\r\n					<div class="btn"><a href="#go" ng-click="goFamilySite(\'mem_reg\')" class="c_btn col05"><span>회원가입</span></a></div>\r\n				</div>\r\n			</div>\r\n		</section>\r\n		<!-- //비회원 구매하기 -->\r\n		<!-- 비회원 주문조회 -->\r\n		<section class="view_order_wrap" id="view_order_wrap" >\r\n			<fieldset>\r\n				<legend>비회원 주문조회</legend>\r\n				<div class="view_order_box">\r\n					<h3 class="view_order_title">비회원의 주문번호와 이메일 주소를 입력해주세요.</h3>\r\n					<ul class="view_order_input">\r\n						<li><input type="tel" name="ord_no" class="txt01" placeholder="주문번호 (예시 : 2015-02-01-1234567)" title="주문번호" maxlength="1000"></li>\r\n						<li><input type="text" name="grockle_mail" class="txt01" placeholder="이메일 주소" title="비밀번호" ng-keyup="fn_enterKeyUp( event )" maxlength="1000"></li>\r\n					</ul>\r\n					<div class="view_order_btn">\r\n						<a class="c_btn col01" ng-click="searchOrderNum()"><span>비회원 주문조회</span></a>\r\n					</div>\r\n					<p class="join_txt">회원가입하시면  다양한 쿠폰/포인트 등<br>혜택을 받으실 수 있습니다.</p>\r\n					<div class="join_btn">\r\n						<a ng-click="goFamilySite(\'mem_reg\')"><span>회원가입</span></a>\r\n					</div>\r\n				</div>\r\n			</fieldset>\r\n		</section>\r\n		<!-- //비회원 주문조회 -->\r\n	</form>\r\n	<div name="divfrmSend" id="divfrmSend">\r\n		<p ng-bind-html="FrmSendData"></p>\r\n	</div>\r\n\r\n	<!-- 20140917 참좋은혜택 팝업-->\r\n	<div class="benefit_layer grade_up bg" style="display:none"></div>\r\n\r\n	<!-- 20140822 top:35% 제거-->\r\n	<div class="benefit_layer grade_up" style="display:none">\r\n		<div class="cont">\r\n			<a href="{{defaultDomain}}/mylotte/sub/soGoodBenefit.do?{{baseParam}}"><img src="http://image.lotte.com/lotte/mobile/popup/popup_benefit_0917.png" alt="혜택받으러가기"></a><br>\r\n		</div>\r\n		<div class="check">\r\n			<span class="today">\r\n				<input type="checkbox" id="choice01" onclick="javascript:setToDayNotView(\'ellotteMemPopYn\');">\r\n				<label for="choice01">오늘하루 그만보기</label>\r\n			</span>\r\n			<span class="close"><a href="javascript:closeMemPopup();">닫기</a></span>\r\n		</div>\r\n	</div>\r\n\r\n	<form name="grockle_frm" id="grockle_frm" method="post">\r\n		<input type="hidden" name="grockle_yn" value="">\r\n		<input type="hidden" name="grockle_mbr_no" value="">\r\n		<input type="hidden" name="orderNo" value="">\r\n	</form>\r\n\r\n	<!-- 소셜 로그인 -->\r\n	<form id="sociallogin_frm" name="sociallogin_frm" method="post">\r\n		<input type="hidden" name="targetUrl" id="targetUrl" />\r\n		<input type="hidden" name="copToken">\r\n		<input type="hidden" name="copCls">\r\n	</form>\r\n\r\n	<!--주문서 넘어가기 직전 로딩바-->\r\n	<div class="buyLoading" id="buyLoading">\r\n		<a class="btnOptionClose" ng-click="buyLoadingClose()">팝업닫기</a>\r\n		<div class="loading"></div>\r\n		<div class="message">탁월한 선택! 롯데닷컴입니다.</div>\r\n	</div>\r\n\r\n	<!-- 휴면회원 복원용 레이어 -->\r\n	<div ng-if="mbRestoreLoadingFlag" ng-show="mbRestoreLoadingFlag" class="mb_restore_loading">\r\n		<a class="btn_close" ng-click="mbRestoreClose()">팝업닫기</a>\r\n		<div class="loading"></div>\r\n		<div class="message">\r\n			휴면되었던 고객님의 정보를 <strong>복원하는 중</strong>입니다.<br />\r\n			잠시만 기다려 주세요.\r\n		</div>\r\n	</div>\r\n\r\n	<!-- 임직원 등록 팝업 -->\r\n	<section id="pageCover"></section>\r\n	<div id="lotteStaffGuide" class="lotteStaffGuide">\r\n	    <header id="head_sub">\r\n	        <h2><strong>롯데 임직원 고객님</strong> 환영합니다!</h2>\r\n	        <p>지금 임직원 등록하시고 혜택 누리세요~</p>\r\n	    </header>\r\n	    <div>\r\n			<ul class="list">\r\n				<li><span class="first_letter">혜택1. </span>\r\n					상품 구매 시 최대 15% 할인혜택을 드립니다.<br />\r\n					<var>(단, 임직원 할인 시 타할인 수단 적용 불가)</var>\r\n				</li>\r\n				<li><span class="first_letter">혜택2. </span>\r\n					임직원 전용 특가매장(임직원 명절 매장 등)<br />\r\n					운영 시 상품 구매 혜택을 드립니다.\r\n				</li>\r\n			</ul>\r\n			<ul class="optionBtn">\r\n			    <li><a ng-click="closeLotteStaffPopup()" class="btn_close">닫기</a></li>\r\n		    	<li><a ng-click="RegLotteStaff()" class="btn_addr">임직원 등록하기</a></li>\r\n			</ul>\r\n		</div>\r\n    </div>\r\n<!-- //임직원 등록 팝업 -->\r\n</section>\r\n')}]);