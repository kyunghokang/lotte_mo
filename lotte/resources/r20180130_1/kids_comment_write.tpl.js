angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/kids_comment_write_container.html",'<section id="container">\r\n    <!-- contents -->\r\n    <section class="prod_eval">\r\n        <section class="list write">\r\n            <div class="group">\r\n                <span class="thumb">\r\n                    <a ng-href="/product/product_view.do?{{baseParam + \'&goods_no=\' + commentWrite.goods_no}}"><img ng-src="{{commentWrite.goods_img_url}}" alt=""></a>\r\n                </span>\r\n                <span class="cont01">\r\n                    <a ng-href="/product/product_view.do?{{baseParam + \'&goods_no=\' + commentWrite.goods_no}}">\r\n                        <p class="tl">{{commentWrite.goods_nm}}</p>\r\n                    </a>\r\n                    <p class="spec" ng-if="commentWrite.goods_tp_cd != \'20\' && !commentWrite.smp_psb_yn">\r\n                        <span>{{commentWrite.opt_desc}}</span>\r\n                    </p>\r\n					<p class="spec e-coupon" ng-if="commentWrite.goods_tp_cd == \'20\' && !commentWrite.smp_psb_yn">\r\n						<span>{{commentWrite.e_use_loc_desc_cont}}</span>\r\n					</p>\r\n                    <p class="price">\r\n                        <span><strong>{{commentWrite.sale_prc | currency : "" : 0}}원</strong></span>\r\n                    </p>\r\n                </span>\r\n            </div>\r\n            <div ng-if="isKids && isKidsApp">\r\n	            <div class="btn_list cont photo" ng-if="!(appObj.isApp && !isNewestApp && appObj.isIOS)">\r\n	                <span class="l_area">사진등록</span>\r\n	                <span class="r_area">\r\n	                    <a href="#" class="btn_style4" ng-click="attachImage()">\r\n	                    	<img src="http://image.lotte.com/lotte/mo2015/angular/mylotte/ic_btn_photo_add.png"> 사진첨부\r\n	                    </a>\r\n	                    <!--<a href="#" class="btn_style2">이용후기 작성</a>-->\r\n	                </span>\r\n	            </div>\r\n	        </div>    \r\n            <div ng-if="isKids && isKidsApp">\r\n				<div ng-if="appObj.isApp && isNewestApp" style="height:160px;"></div>\r\n				<div ng-if="appObj.isApp && !isNewestApp && appObj.isAndroid" style="height:260px;"></div>\r\n			</div>\r\n			<form id="commentWriteForm" name="commentWriteForm">\r\n		        <div ng-if="isKids = false">\r\n		            <div class="cont">\r\n		                <div class="selWrap" ng-if="!commentWrite.healthfood">\r\n		                    <select ng-model="reviewTxtOption" ng-change="input.reviewTxt = reviewTxtOption">\r\n		                        <option value="">상품평 간편 등록하기</option>\r\n		                        <option value="마음에 쏙 들어요.">마음에 쏙 들어요.</option>\r\n		                        <option value="빠른 배송 감사합니다.">빠른 배송 감사합니다.</option>\r\n		                        <option value="저렴하게 잘 샀어요.">저렴하게 잘 샀어요.</option>\r\n		                        <option value="너무 괜찮아요. 다음에 또 살 거예요.">너무 괜찮아요. 다음에 또 살 거예요.</option>\r\n		                    </select>\r\n		                </div>\r\n		                <textarea id="reviewTxt" ng-model="input.reviewTxt" ng-if="!commentWrite.healthfood" \r\n		                		onchange="maxLengthCheck(\'4000\', null, this, reviewTxt)" onkeyup="maxLengthCheck(\'4000\', null, this)">\r\n		                	{{input.reviewTxt}}\r\n		                </textarea>\r\n		                \r\n						<p class="food_cmt" ng-if="commentWrite.healthfood">식품·건강용품 등 일부 상품은 상품 기능 및 효과에 대한 오해의 소지가 있어 부득이 상품평을 게시하지 못하므로 만족도만 등록하실 수 있습니다.<br>(상품평에 대한 클로버는 동일하게 지급됩니다.)</p>\r\n		            </div>\r\n	            </div>\r\n	            <div ng-if="isKids = true">\r\n	            	<div class="cont">\r\n		                <div class="selWrap">\r\n		                    <select ng-model="reviewTxtOption" ng-change="input.reviewTxt = reviewTxtOption">\r\n		                        <option value="">상품평 간편 등록하기</option>\r\n		                        <option value="마음에 쏙 들어요.">마음에 쏙 들어요.</option>\r\n		                        <option value="빠른 배송 감사합니다.">빠른 배송 감사합니다.</option>\r\n		                        <option value="저렴하게 잘 샀어요.">저렴하게 잘 샀어요.</option>\r\n		                        <option value="너무 괜찮아요. 다음에 또 살 거예요.">너무 괜찮아요. 다음에 또 살 거예요.</option>\r\n		                    </select>\r\n		                </div>\r\n		                <textarea id="reviewTxt" ng-model="input.reviewTxt" onchange="maxLengthCheck(\'4000\', null, this, reviewTxt)" onkeyup="maxLengthCheck(\'4000\', null, this)">\r\n		                	{{input.reviewTxt}}\r\n		                </textarea>						\r\n		            </div>\r\n	            </div>\r\n	            \r\n	            <span class="seper_area"></span>\r\n	\r\n	            <div class="cont score">\r\n	                <h3>고객만족도 선택</h3>\r\n	                <ul class="scoreList">\r\n	                    <li>\r\n	                        <span class="txt">가격</span>\r\n	                        <span class="score">\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.prc_stfd_val" class="radio01" id="choice01" value="5"> <label for="choice01">5</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.prc_stfd_val" class="radio01" id="choice02" value="4"> <label for="choice02">4</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.prc_stfd_val" class="radio01" id="choice03" value="3"> <label for="choice03">3</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.prc_stfd_val" class="radio01" id="choice04" value="2"> <label for="choice04">2</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.prc_stfd_val" class="radio01" id="choice05" value="1"> <label for="choice05">1</label></span>\r\n	                        </span>\r\n	                    </li>\r\n	                    <li>\r\n	                        <span class="txt">품질</span>\r\n	                        <span class="score">\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.qual_stfd_val" class="radio01" id="choice21" value="5"> <label for="choice21">5</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.qual_stfd_val" class="radio01" id="choice22" value="4"> <label for="choice22">4</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.qual_stfd_val" class="radio01" id="choice23" value="3"> <label for="choice23">3</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.qual_stfd_val" class="radio01" id="choice24" value="2"> <label for="choice24">2</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.qual_stfd_val" class="radio01" id="choice25" value="1"> <label for="choice25">1</label></span>\r\n	                        </span>\r\n	                    </li>\r\n	                    <li>\r\n	                        <span class="txt">디자인</span>\r\n	                       <span class="score">\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dsgn_stfd_val" class="radio01" id="choice31" value="5"> <label for="choice31">5</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dsgn_stfd_val" class="radio01" id="choice32" value="4"> <label for="choice32">4</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dsgn_stfd_val" class="radio01" id="choice33" value="3"> <label for="choice33">3</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dsgn_stfd_val" class="radio01" id="choice34" value="2"> <label for="choice34">2</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dsgn_stfd_val" class="radio01" id="choice35" value="1"> <label for="choice35">1</label></span>\r\n	                        </span>\r\n	                    </li>\r\n	                    <li>\r\n	                        <span class="txt">{{(commentWrite.goods_tp_cd == \'20\' || commentWrite.smp_psb_yn) && \'매장\' || \'배송\'}}</span>\r\n	                        <span class="score">\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dlv_stfd_val" class="radio01" id="choice41" value="5"> <label for="choice41">5</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dlv_stfd_val" class="radio01" id="choice42" value="4"> <label for="choice42">4</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dlv_stfd_val" class="radio01" id="choice43" value="3"> <label for="choice43">3</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dlv_stfd_val" class="radio01" id="choice44" value="2"> <label for="choice44">2</label></span>\r\n	                            <span class="txt_radio"><input type="radio" ng-model="input.dlv_stfd_val" class="radio01" id="choice45" value="1"> <label for="choice45">1</label></span>\r\n	                        </span>\r\n	                    </li>\r\n	                    <li ng-if="commentWrite.display_color_size">\r\n	                        <span class="txt">사이즈</span>\r\n	                        <a href="#" class="btn s" ng-class="input.size == 1 && \'on\'" ng-click="input.size = 1;">딱 맞다</a>\r\n	                        <a href="#" class="btn s" ng-class="input.size == 2 && \'on\'" ng-click="input.size = 2;">작다</a>\r\n	                        <a href="#" class="btn s" ng-class="input.size == 3 && \'on\'" ng-click="input.size = 3;">크다</a>\r\n	                    </li>\r\n	                    <li ng-if="commentWrite.display_color_size">\r\n	                        <span class="txt">색상</span>\r\n	                        <a href="#" class="btn s" ng-class="input.color == 1 && \'on\'" ng-click="input.color = 1">같다</a>\r\n	                        <a href="#" class="btn s" ng-class="input.color == 2 && \'on\'" ng-click="input.color = 2">어둡다</a>\r\n	                        <a href="#" class="btn s" ng-class="input.color == 3 && \'on\'" ng-click="input.color = 3">밝다</a>\r\n	                    </li>\r\n	                </ul>\r\n	            </div>\r\n\r\n	            <span class="seper_area"></span>\r\n	\r\n	            <!--SNS-->\r\n	            <div class="confirm sns_btns1" ng-class="snsOpen && \'open\'"><!--open 클래스 사용-->\r\n	                <a href="#" class="btn b normal" ng-click="snsOpen = !snsOpen"><span class="ic_sns"></span><span>내상품평, 친구에게도 공유하기</span><span class="ic_arrow_light"></span></a>\r\n	                <!--sns아이콘-->\r\n	                <ul class="sns_icons" ng-show="snsOpen">\r\n	                    <li class="kakaotalk" ng-click="snsOpen = false; snsFlag = \'kakaotalk\'"><i></i>카카오톡</li>\r\n	                    <li class="facebook" ng-click="snsOpen = false; snsFlag = \'facebook\'"><i></i>페이스북</li>\r\n	                    <li class="sms" ng-show="appObj.isAndroid" ng-click="snsOpen = false; snsFlag = \'sms\'"><i></i>문자</li>\r\n	                    <li class="kakaostory" ng-click="snsOpen = false; snsFlag = \'kakaostory\'"><i></i>카카오스토리</li>\r\n	                </ul>\r\n	                <!--sns 선택-->\r\n	                <div class="sns_selected" ng-show="snsFlag">\r\n	                	<span ng-class="snsFlag"></span>\r\n	                	<span class="explain">\r\n	                		<b>{{(snsFlag == \'kakaotalk\' && \'카카오톡\') || (snsFlag == \'facebook\' && \'페이스북\') || (snsFlag == \'sms\' && \'문자\') || (snsFlag == \'kakaostory\' && \'카카오스토리\')}}</b>에 내가 작성한 상품평을 공유합니다.</span>\r\n	                	<div class="close" ng-click="snsFlag = \'\'"><a href="#">닫기</a></div>\r\n	                </div>\r\n	            </div>\r\n	            <!--//SNS-->\r\n	            \r\n	            <div class="confirm">\r\n	                <a href="#" class="btn b" ng-click="cancel()">취소</a>\r\n	                <a href="#" class="btn b on" ng-click="save()">등록하기</a>\r\n	            </div>\r\n			</form>\r\n\r\n            <section class="stipul">\r\n                <ul>\r\n                    <li class="bullet">매월 우수상품평 작성자 50분께 클로버 3,000개 적립됩니다.</li>\r\n                    <li class="bullet">구매하신 상품을 직접 촬영하여 올리시면 클로버 300개 적립됩니다.<br>(사진 상품평, 이용후기는 담당부서 확인 후 1~2일 내 적립, 주말/공휴일 제외)</li>\r\n                    <li class="bullet">상품평의 저작권은 롯데닷컴에 있으며, 등록 즉시 바로 사이트에 게재,<br>모두 공개를 원칙으로 합니다.</li>\r\n                    <li class="bullet">상품평에 적합하지 않은 내용, 미풍양속을 해치는 내용 등은 통보 없이 삭제될 수 있으며 클로버가 지급되지 않습니다.</li>\r\n                    <li class="bullet">상품문의, 교환/반품 요청, 제품이상 등 불편사항은 \'상품문의\' 또는 \'고객센터 > 1:1 문의하기\'를 이용하세요.</li>\r\n                    <li class="bullet on">고객님이 상품평을 작성해주신 상품과 동일한 모델번호를 가진 다른 상품이 있을 시 상품평은 공통으로 노출됩니다.</li>\r\n                </ul>\r\n            </section>\r\n\r\n        </section>\r\n\r\n    </section>\r\n	<share-box></share-box>\r\n    <!-- //contents -->\r\n</section>')}]);