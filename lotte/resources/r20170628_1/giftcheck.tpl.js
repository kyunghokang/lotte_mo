angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mylotte/address_info.html",'<section id="addressInfoCtrlContainer">\r\n    <div class="gtable myAddrTab mb20" ng-if="loginInfo.isLogin">\r\n        <div class="gcell" ng-class="{on:myAddr_tab||editMode}" ng-click="myAddrChange(true)">내 배송지</div>\r\n        <div class="gcell" ng-class="{on:!myAddr_tab && !editMode}"  ng-click="myAddrChange(false)">새로운 배송지</div>\r\n    </div>                  \r\n   \r\n    <div class="stepBody inputData">     \r\n        <!--비로그인-->   \r\n        <div class="gtable mb20" ng-if="!loginInfo.isLogin">\r\n            <div class="gcell ta">받는분</div>                    \r\n            <div class="gcell"><input type="text" placeholder="이름" ng-model="inprmitnm" id="inprmitnm2"></div>                    \r\n        </div>\r\n        <!--로그인-->\r\n        <div class="gtable mb20" ng-if="loginInfo.isLogin">\r\n            <div class="gcell ta">받는분</div>\r\n            <div class="gcell">\r\n                <!--내배송지-->\r\n                <div class="gtable" ng-show="myAddr_tab">\r\n                    <div class="gcell tn">\r\n                        <div class="tar_name" ng-click="addrLayer_show(true)" ng-if="giftData.user_addr_info.default_addr.r_name != undefined">{{giftData.user_addr_info.default_addr.r_name}}({{giftData.user_addr_info.default_addr.addr_name}})</div>\r\n                        <div class="tar_name" ng-click="addrLayer_show(true)" ng-if="giftData.user_addr_info.default_addr.r_name == undefined">{{giftData.user_addr_info.default_addr.addr_name}}</div>\r\n                    </div>\r\n                    <!--<div class="gcell" style="width:110px"><a href="#none" ng-click="editMyAddr()" class="btnType">내 배송지 수정</a> </div>-->\r\n                </div>\r\n                <!--새로운배송지-->               \r\n                <div class="gtable" ng-show="!myAddr_tab">\r\n                    <div class="gcell tn"><input type="text" placeholder="이름" ng-model="inprmitnm" id="inprmitnm1"></div>\r\n                    <div class="gcell" style="width:86px"><!--20161206 <input type="text" placeholder="배송지명" ng-model="inpdlvpnm" id="inpdlvpnm">--> </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="gtable" ng-show="!myAddr_tab || !loginInfo.isLogin">\r\n            <div class="gcell ta">주소</div>                    \r\n            <!--주소찾기 전화면-->\r\n            <div class="gcell" ng-show="!searchAddressFlag">\r\n                <div class="searchAddr">\r\n                    <input type="text" ng-model="address_post" readonly>\r\n                    <a href="#none" ng-click="search_step1(true)">주소찾기</a>                    \r\n                </div>\r\n                <input type="text" class="mb8" ng-model="address1" id="address1" readonly>\r\n                <input type="text" ng-model="address2"  id="address2" readonly>                                             \r\n            </div>            \r\n            <!--주소찾기-->\r\n            <div class="gcell" ng-show="searchAddressFlag">\r\n                <div class="searchAddr">\r\n                    <input type="text">\r\n                    <a href="#none"  ng-click="search_step1(false)">취소하기</a>                    \r\n                </div>\r\n            </div>                                \r\n        </div>\r\n\r\n        <div class="gtable" ng-show="myAddr_tab && loginInfo.isLogin">\r\n            <div class="gcell ta">주소</div>                    \r\n            <div class="gcell">\r\n               {{giftData.user_addr_info.default_addr.addr1}}\r\n               {{giftData.user_addr_info.default_addr.addr2}}\r\n            </div>            \r\n        </div>\r\n                    \r\n          \r\n           <div ng-show="searchAddressFlag">\r\n            <!--주소검색 탭 -->\r\n                <div class="addressTab">\r\n                    <div class="gtable mb20" >\r\n                        <div class="gcell t1" ng-class="{on:!addressTab}" ng-click="search_step2(false)">지번주소</div>\r\n                        <div class="gcell t2" ng-class="{on:addressTab}" ng-click="search_step2(true)">도로명주소</div>\r\n                    </div>\r\n                </div>                 \r\n                \r\n                <!--지번주소 검색 내역-->   \r\n                <div class="tab_txt" ng-show="!addressTab">\r\n                    <!--1지번주소검색--------------------------->\r\n                    <div class="srch_input gtable" ng-show="searchJListInput">\r\n                        <div class="gcell">\r\n                            <input type="search" id="inp_seq1_J_1" placeholder="동(읍/면/리) 이름입력" ng-model="inp_seq1_J_1">\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a href="#none"  ng-click="searchAddress(1, \'S\', \'J\')" class="btnType">검색</a>    \r\n                        </div>                    \r\n                    </div>                                     \r\n                </div>                \r\n                <!--도로명주소 검색 내역-->\r\n                <div class="tab_txt key" ng-show="addressTab && searchJListInput2">\r\n                   <!--step 1-->\r\n                    <div class="gtable s50">\r\n                       <div class="gcell">\r\n                            <select class="gift" id="key1_seq1_N_1" >\r\n                                <option value="" selected="selected">＊시/도 선택</option>\r\n                                <option value="서울">서울</option>\r\n                                <option value="부산">부산</option>\r\n                                <option value="대구">대구</option>\r\n                                <option value="인천">인천</option>\r\n                                <option value="광주">광주</option>\r\n                                <option value="대전">대전</option>\r\n                                <option value="울산">울산</option>\r\n                                <option value="세종">세종</option>\r\n                                <option value="경기">경기</option>\r\n                                <option value="강원">강원</option>\r\n                                <option value="충북">충북</option>\r\n                                <option value="충남">충남</option>\r\n                                <option value="전북">전북</option>\r\n                                <option value="전남">전남</option>\r\n                                <option value="경북">경북</option>\r\n                                <option value="경남">경남</option>\r\n                                <option value="제주">제주</option>\r\n                            </select>                           \r\n                       </div>\r\n                       <div class="gcell">\r\n                           <input type="text" id="key2_seq1_N_1" placeholder="＊시/군/구 입력">\r\n                       </div>                        \r\n                    </div>\r\n                    <div class="gtable s50">\r\n                       <div class="gcell">    \r\n                            <input type="text" id="key3_seq1_N_1" placeholder="＊도로명 입력">                          \r\n                       </div>\r\n                       <div class="gcell">\r\n                           <input type="text" id="key4_seq1_N_1" placeholder="건물번호 입력">\r\n                       </div>                        \r\n                    </div>        \r\n                    <div class="srch_input gtable" ng-show="searchJListInput2">\r\n                        <div class="gcell">\r\n                            <input type="search" id="key5_seq1_N_1" placeholder="건물명 입력" ng-model="key5_seq1_N_1">\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a href="#none"  ng-click="searchAddress(1, \'S\', \'N\')" class="btnType">검색</a>    \r\n                        </div>                    \r\n                    </div>                    \r\n                </div>                       \r\n           </div>\r\n            <div class="tab_txt">\r\n                <!--2검색결과목록-->\r\n                <ul id="result_seq1_J_1" ng-show="searchJListFlag">\r\n                    <li ng-repeat="item in searchJList">                            \r\n                        <div class="gcell moreAddr">\r\n                            {{item.post_addr}}\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a href="#none"  ng-click="selectAddress(\'SJ\',item, $index)" class="btnType">선택</a>    \r\n                        </div>                              \r\n                    </li>\r\n                    <li ng-if="searchJList.length == 0">                            \r\n                        <div class="gcell moreAddr">\r\n                            검색 결과가 없습니다.\r\n                        </div>\r\n                    </li>                        \r\n                </ul>\r\n                <!--3나머지 주소입력-->\r\n                <div id="seq2_J_1" class="tab_txt" ng-show="moreAddress">\r\n                    <p id="txt_seq2_J_1" class="txt_addr1">{{txt_seq2_J_1}}</p>\r\n                    <div class="gtable srch_input">\r\n                        <div class="gcell">\r\n                            <input type="search" id="inp_seq2_J_1" placeholder="나머지 주소 입력" ng-model="inp_seq2_J_1">\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a  ng-click="searchAddress(\'1\', \'M\', \'J\')" class="btnType">입력</a>\r\n                        </div>    \r\n                    </div>\r\n                </div>\r\n                <!--4 지번,도로명 주소 -> 선택-->\r\n                <div id="seq3_J_1" class="tab_txt s3j" ng-show="seq3_J_1_flag">\r\n                    <p class="addr_title">[고객이 입력한 주소]</p>\r\n                    <div class="addr_choice" ng-if="!noneData">{{addrData.ipt_addr}}</div>\r\n                            \r\n                    <div class="gtable mb20" ng-if="noneData">\r\n                        <div class="gcell">\r\n                            ({{addrData.ipt_addr2.post_no}}) {{addrData.ipt_addr2.post_addr}} {{addrData.ipt_addr2.dtl_addr}}\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a ng-click="selectAddress(\'MJ_c\',addrData.ipt_addr2, 0)" class="btnType">선택</a>\r\n                        </div>    \r\n                    </div>                    \r\n                    \r\n                    \r\n                    <p class="change_roadNameAddr">아래 주소는 지번주소로 변환되는 주소입니다.</p>                    \r\n                    <p class="addr_title">[지번주소]</p>\r\n                    \r\n                    <div class="gtable mb20" ng-repeat="addr in addrData.s_addr" ng-if="addrData.s_addr.length > 0">\r\n                        <div class="gcell">\r\n                            ({{addr.post_no}}) {{addr.post_addr}} {{addr.dtl_addr}}\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a ng-click="selectAddress(\'MJa\',addr, $index)" class="btnType">선택</a>\r\n                        </div>    \r\n                    </div>\r\n\r\n                    <div class="gtable mb20" ng-if="addrData.s_addr.length == 0 || addrData.s_addr == undefined">\r\n                    검색 결과가 없습니다.\r\n                    </div>                    \r\n                                                            \r\n                    <p class="change_roadNameAddr">아래 주소는 도로명주소로 변환되는 주소입니다.</p>                       \r\n                    <p class="addr_title">[도로명주소]</p>\r\n                    \r\n                    <div class="gtable mb20"  ng-repeat="addr in addrData.n_addr" ng-if="addrData.n_addr.length > 0">\r\n                        <div class="gcell">\r\n                            ({{addr.post_no}}) {{addr.post_addr}} {{addr.dtl_addr}}\r\n                        </div>\r\n                        <div class="gcell c2">\r\n                            <a ng-click="selectAddress(\'MJ\',addr, $index)" class="btnType">선택</a>\r\n                        </div>    \r\n                    </div>\r\n                    <div class="gtable mb20" ng-if="addrData.n_addr.length == 0 || addrData.n_addr == undefined">\r\n                    검색 결과가 없습니다.\r\n                    </div>                      \r\n                </div>             \r\n        </div>\r\n   \r\n        <div class="gtable mb20" ng-show="!myAddr_tab || !loginInfo.isLogin">\r\n            <div class="gcell ta">연락처\r\n                <a href="javascript:$(\'#ansimPop\').show();$(\'#dimCover\').show()" class="safe_num">안심번호 서비스 안내</a>\r\n            </div>                    \r\n            <div class="gcell">\r\n                <div class="gtable">\r\n                    <div  class="gcell">\r\n                        <select class="gift" name="inpcell1" ng-show="!typeTel" ng-model="inpcell1">\r\n                            <option value="010">010</option>\r\n                            <option value="011">011</option>\r\n                            <option value="016">016</option>\r\n                            <option value="017">017</option>\r\n                            <option value="018">018</option>\r\n                            <option value="019">019</option>\r\n                            <option value="0502">0502</option>\r\n                            <option value="0505">0505</option>\r\n                            <!-- <option value="직접입력">직접입력</option> -->\r\n                        </select>\r\n                        <!--직접입력-->\r\n                        <!--<input type="text" ng-show="typeTel">-->                      \r\n                    </div>\r\n                    <div  class="gcell telW"><input type="number" ng-model="inpcell2" id="inpcell2" max="9999"></div>\r\n                    <div  class="gcell telW"><input type="number" ng-model="inpcell3" id="inpcell3" max="9999"></div>\r\n                </div>\r\n                <!-- <p class="addCheckBox">\r\n                    <input type="checkbox" class="check01" id="addCall" checked="checked">\r\n                    <label for="addCall">내 배송지 목록에 추가</label>                    \r\n                </p> -->\r\n            </div>                    \r\n        </div>\r\n        <div class="gtable mb20" ng-show="myAddr_tab && loginInfo.isLogin">\r\n            <div class="gcell ta">연락처\r\n            <a href="javascript:$(\'#ansimPop\').show();$(\'#dimCover\').show()" class="safe_num">안심번호 서비스 안내</a>\r\n            </div>                    \r\n            <div class="gcell">\r\n            {{giftData.user_addr_info.default_addr.addr_tel}}\r\n            \r\n            </div>                    \r\n        </div>\r\n        \r\n        <div class="gtable mb20">\r\n            <div class="gcell ta">배송메시지</div>                    \r\n            <div class="gcell">\r\n                <select name="deli_msg" class="gift" id="message" ng-show="!writeMessage" ng-change="messageChange()" ng-model="user_msg">\r\n                    <option value="" selected="selected">배송메시지 선택하기</option>												\r\n                    <option value="부재시 경비실에 맡겨주세요.">부재시 경비실에 맡겨주세요.</option>\r\n                    <option value="빠른 배송 부탁드립니다.">빠른 배송 부탁드립니다.</option>\r\n                    <option value="부재시 핸드폰으로 연락바랍니다.">부재시 핸드폰으로 연락바랍니다.</option>\r\n                    <option value="배송 전 연락바랍니다.">배송 전 연락바랍니다.</option>\r\n                    <option value="write">직접 입력하기 (20자 이내)</option>\r\n                </select>\r\n                <input type="text" ng-model="wmessage" id="message2" maxlength="20" ng-show="writeMessage">\r\n            </div>                    \r\n        </div>                \r\n    </div>       \r\n    <!--배송지 목록-->\r\n    <div class="addr_list_layer" ng-show="addr_layer">\r\n        <div class="bg"></div>\r\n        <div class="cont">\r\n            <p class="tit">배송지 목록</p>\r\n            <div class="contList">\r\n                <ul class="list" id="filterType">\r\n                    <li class="gtable" ng-repeat="item in giftData.user_addr_info.addr_list" ng-if="item.del == undefined">\r\n                        <div class="gcell tl1"><input type="radio" class="radio01" id="tl_d{{$index}}" name="detail_list" value="{{$index}}"></div>\r\n                        <div class="gcell tl2"><label for="tl_d{{$index}}">\r\n                                <p class="stit">{{item.r_name}} ({{item.addr_name}}) <span ng-if="item.is_default"> 기본배송지</span></p>\r\n                                <p>({{item.addr_post}}) {{item.addr1}} {{item.addr2}}\r\n                				  <br>{{item.addr_tel}}</p>\r\n                        </label></div>\r\n                        \r\n<!-- 20161206 제거                         \r\n                         <div class="gcell tl3" ng-if="item.is_default">\r\n                          <a href="#none" ng-click="list_edit({{$index}}, item)" class="btnType">수정</a>				  \r\n                        </div>\r\n                        <div class="gcell tl3" ng-if="!item.is_default">\r\n                          <a href="#none" ng-click="list_edit({{$index}}, item)" class="btnType">수정</a>				  \r\n                          <a href="#none" ng-click="list_del({{$index}}, item)" class="btnType">삭제</a>\r\n                        </div>\r\n-->                        \r\n                    </li>\r\n                </ul>                            \r\n            </div>\r\n            <ul class="optionBtn gtable">\r\n	    	    <li class="gcell"><a href="#none"  ng-click="addrLayer_show(false)"  class="btn_cancel"><span>취소</span></a></li>\r\n	    	    <li class="gcell"><a href="#none" ng-click="addrLayer_select()" class="btn_addr_list"><span>선택완료</span></a></li>\r\n	        </ul>\r\n        </div>\r\n    </div>\r\n<div id="dimCover"></div>    \r\n<div id="ansimPop">\r\n    <header id="head_sub">\r\n        <h2>연락처 제공 안내</h2>\r\n        <p class="close"><a href="javascript:$(\'#ansimPop\').hide();$(\'#dimCover\').hide()">닫기</a></p>\r\n    </header>\r\n    <ul class="ansim_cont">\r\n    	<li>고객님의 연락처는 안심번호 서비스로 보호받고 있습니다.</li>\r\n    	<li>안심번호 서비스란, <strong>고객님의 연락처를 1회성 임시번호(050-000-0000)로 자동전환 하여 택배사에 전달함으로써 개인정보 유출을 사전에 방지</strong>하는 서비스입니다.</li>\r\n    	<li><strong>택배기사님이 부재시 전화를 드리거나, 배송진행상황을 택배사에서 SMS로 안내해 드릴 수 있습니다.</strong></li>\r\n    </ul>\r\n</div>    \r\n</section>\r\n\r\n'),a.put("/lotte/resources_dev/mylotte/giftcheck_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n \r\n   <p ng-if="!loading">\r\n        <!--데이타 로딩중      http://image.lotte.com/lotte -->\r\n   </p>\r\n   <section ng-show="!checkGiftPage && loading">\r\n        <!--거절 메시지-->\r\n        <div class="refuseLayer" ng-if="refuseLayerFlag">\r\n           <div class="bg"></div>\r\n           <div class="box">\r\n               <div class="popBox">\r\n                   <div class="head_title">거절메시지 <span class="close" ng-click="refuse_rLayer(false)" ></span></div>\r\n                   <div class="cont">\r\n                       <p class="title01">선물을 한번 거절하시면 다시 받으실 수 없으며, 거절 메시지는 선물 보내신 분께 전달됩니다.</p>\r\n                        <select class="gift" id="refuse_message">\r\n                            <option value="">거절 메시지 선택</option>\r\n                            <option value="{{item.value}}" ng-repeat="item in giftData.gift_reject_msg">{{item.text}}</option>\r\n                        </select>                   \r\n                       <a ng-click="confirm_submit(false)" class="cancle">거절하기</a>\r\n                   </div>\r\n                </div>\r\n           </div>\r\n        </div>        \r\n        <!--선물카드-->\r\n        <div class="cardArea" style="background:{{giftData.gift_msg_info.bg_color}}">\r\n            <div class="cardPaper">\r\n                <img ng-src="{{giftData.gift_msg_info.img_url}}">\r\n                <div class="message">\r\n                    <p class="t1" ng-bind-html="giftData.gift_msg_info.msg"></p>\r\n                    <p class="t2">From.{{giftData.gift_msg_info.from_nm}}</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--선물정보-->\r\n        <div class="infoArea">\r\n            <ul class="topInfo">\r\n                <li>배송지를 입력해주시면 선물을 안전하게 전해드리겠습니다.\r\n                <br><b>(입력기한:{{giftData.gift_msg_info.limit_date}})</b></li>\r\n                <li ng-if="!loginInfo.isLogin"><span class="loginClick" ng-click="loginProc()">로그인</span> 하시면 배송지를 더욱 쉽게 입력하실 수 있습니다.</li>\r\n            </ul>\r\n            <!--선물확인-->\r\n            <div class="stepBox">\r\n                <div class="stepHead">\r\n                    <div class="stepIcon"></div>\r\n                    <b>선물확인</b>\r\n                    옵션이 있는 상품의 경우 마음에 들지 않으시면 옵션을 변경하실 수 있습니다. ^^\r\n                </div>\r\n                <div class="stepBody">\r\n                    <div class="gtable goodInfo">\r\n                        <div class="gcell cell1" ng-click="ProductDetailLayer()">\r\n                            <img ng-src="{{giftData.gift_prd_info.img_url}}" class="goodImg">\r\n                        </div>\r\n                        <div class="gcell">\r\n                            <p class="gflag">\r\n                                <span class="dept" ng-if="giftData.gift_prd_info.mall_flag.is_dept">롯데백화점</span>\r\n                                <span class="etv" ng-if="giftData.gift_prd_info.mall_flag.is_tvhome">롯데홈쇼핑</span>\r\n                                <span class="smart" ng-if="giftData.gift_prd_info.mall_flag.is_smartpick">스마트픽</span>\r\n                            </p>\r\n                            <p class="title"><span ng-if="giftData.gift_prd_info.brand_nm != \'\' && giftData.gift_prd_info.brand_nm != undefined">[{{giftData.gift_prd_info.brand_nm}}]</span>{{giftData.gift_prd_info.goods_nm}}</p>\r\n                              <p class="option" ng-repeat="item in giftData.gift_prd_info.selected_opt" ng-if="giftData.gift_prd_info.selected_opt.length > 0">\r\n                                  {{item.opt_name}} : {{item.opt_value}}\r\n                              </p>                              \r\n                            <a ng-if="giftData.gift_prd_info.opt_item_lst.length > 1" ng-click="changeOpt()">옵션변경</a>\r\n                        </div>                                                            \r\n                    </div> \r\n                    <!--옵션변경 선택시                -->\r\n                    <div class="changeOpt" ng-show="optFlag">\r\n                        <div class="gtable optname">\r\n                            <div class="gcell cell1">\r\n                                주문한 옵션\r\n                            </div>\r\n                            <div class="gcell">\r\n                              <p ng-repeat="item in giftData.gift_prd_info.selected_opt">\r\n                                  {{item.opt_name}} : {{item.opt_value}}\r\n                              </p>                           \r\n                            </div>                                                            \r\n                        </div> \r\n                        <div class="gtable" ng-repeat="item in giftData.gift_prd_info.opt_list" ng-init="item.selectID = 0">\r\n                            <div class="gcell cell1">\r\n                                {{item.opt_name}}\r\n                            </div>\r\n                            <div class="gcell">\r\n                                <select class="gift" id="prod_option_{{$index}}" ng-model="item.selectID" ng-change="checkOptCnt($index)">\r\n                                    <option value="0">선택하세요.</option>\r\n                                    <option ng-repeat="opt in item.opt_value_lst track by $index">{{opt}}</option>\r\n                                </select>\r\n                            </div>                                                            \r\n                        </div> \r\n                        <div class="pop-footer_">\r\n                            <a href="#none" ng-click="changeOpt()" class="close_7e">닫기</a> \r\n                            <a href="#none" ng-click="saveOpt()" class="ok_7e">옵션 저장</a>\r\n                        </div>                                        \r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!--배송정보입력-->\r\n            <div class="stepBox">\r\n                <div class="stepHead">\r\n                    <div class="stepIcon t2"></div>\r\n                    <b ng-class="{toppd:loginInfo.isLogin}">배송 정보 입력</b>\r\n                    <span ng-if="!loginInfo.isLogin"><span class="loginClick" ng-click="loginProc()">로그인</span> 하시면 등록된 배송지 선택이 가능합니다.</span>\r\n                </div>\r\n                <!--배송정보입력-->\r\n                <address-info></address-info>\r\n            </div>\r\n            <!--비밀번호 설정-->\r\n            <div class="stepBox">\r\n                <div class="stepHead">\r\n                    <div class="stepIcon t3"></div>\r\n                    <b>비밀번호 설정</b>\r\n                    선물함 비밀번호 및 입력하신 정보 보호를 위해 고객님의 동의가 필요합니다.\r\n                </div>\r\n                <div class="stepBody inputData type2">\r\n                    <div class="gtable">\r\n                        <div class="gcell ta2">선물함 비밀번호</div>                    \r\n                        <div class="gcell"><input type="password" placeholder="비밀번호 4자리" maxlength="4" inputmode="numeric" pattern="[0-9]*" id="pass1" title="숫자만 입력 가능합니다"></div>                    \r\n                    </div>\r\n                    <div class="gtable">\r\n                        <div class="gcell ta2">비밀번호 재확인</div>                    \r\n                        <div class="gcell"><input type="password" maxlength="4" inputmode="numeric" pattern="[0-9]*" id="pass2"></div>                    \r\n                    </div>\r\n                    <p>선물상품에 대한 배송조회 시 필요하므로 꼭 기억해주세요.</p>\r\n                </div>                \r\n            </div>\r\n            <!--정보제공동의-->\r\n            <div class="stepBox agreeInfo">\r\n                <div class="headTitle" ng-class="{on:agreeCheckInfo}">\r\n                    <input type="checkbox" class="check01" id="agreeInfoCheck" ng-model="agreeCheck">\r\n                    <label for="agreeInfoCheck">선물 수령을 위한 정보제공에 대한 동의</label>\r\n                    <div ng-click="agreeCheckInfo = !agreeCheckInfo" class="ac_more"></div>\r\n                </div>\r\n                <div class="gtable" ng-show="agreeCheckInfo">\r\n                    <div class="gcell">\r\n                        <p class="top line">목적</p>\r\n                        <p>선물 상품 배송 관련 정보수집</p>\r\n                    </div>\r\n                    <div class="gcell">\r\n                        <p class="top line">제공 항목</p>\r\n                        <p>수취인명, 주소, 전화번호</p>                \r\n                    </div>\r\n                    <div class="gcell">\r\n                        <p class="top">보유기간</p>\r\n                        <p>배송완료 이후 5년간</p>                \r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n            <!--선물거절, 선물받기-->\r\n            <div class="gtable gBtn">\r\n                <div class="gcell no"><a ng-click="refuse_rLayer(true)">선물 거절</a></div>\r\n                <div class="gcell yes"><a ng-click="confirm_submit(true)">선물 받기</a></div>            \r\n            </div>\r\n\r\n            <!--기타 안내-->\r\n            <div class="footInfo">\r\n                <ul class="topInfo">\r\n                    <li>"선물함"에서 선물에 대한 배송 조회가 가능합니다.</li>\r\n                    <li>선물 받으신 상품의 교환/반품은 선물 결제자만 가능합니다.</li>\r\n                    <li>발송지연/발송불가의 경우 수신하시는 분께도 알림을 드립니다.</li>\r\n                </ul>\r\n            </div>        \r\n        </div>\r\n        <!--popup product detail -->\r\n        <div class="layerPop" ng-if="productDetailPop">\r\n            <div id="head_sub">\r\n                <h2>선물 상품 정보</h2>\r\n                <p class="close"><a ng-click="closeProductDetailLayer()">닫기</a></p>\r\n            </div>        \r\n            <div class="cont detailLayout" ng-bind-html="detailHtml">\r\n\r\n            </div>\r\n        </div>   \r\n       <!--앱다운배너 : 웹인경우 http://image.lotte.com/upload/display/corner/0_55155_47683_30_13010122_1.jpg\r\n       http://image.lotte.com/lotte/mo2015/angular/detail/default_appdown_0719_1.png\r\n       -->\r\n     <div class="app_bnr_wrap" style="background-color:{{appBanner.bg_color}}" ng-if="!appObj.isApp && appDownBann && appBanner != null">\r\n            <a ng-click="gotoApp();" class="btn_appdown"><img alt="롯데닷컴 앱 다운로드" ng-src="{{appBanner.img_path}}"></a>\r\n            <button ng-click="appDownBnrClose();" class="btn_close">앱다운로드 배너 그만보기</button>\r\n    </div>       \r\n       \r\n   </section>\r\n   <section ng-if="checkGiftPage" class="secondPage">\r\n      <div class="topbox" ng-if="state == 0">\r\n           <img src="http://image.lotte.com/lotte/mo2015/angular/detail/giftOrder_icon4.png">\r\n           <p><span>선물 확인이 완료</span>되었습니다.<br>감사합니다.</p>\r\n           <div class="subbtn">\r\n               <a class="tb1" ng-href="{{presentShop + \'&tclick=m_DC_GiftConfirm_Accept_btn01\'}}">나도 선물하기</a>\r\n               <a ng-href="{{presentListUrl+ \'&tclick=m_DC_GiftConfirm_Accept_btn02\'}}">선물함 가기</a>\r\n           </div>              \r\n      </div>\r\n      <div class="topbox" ng-if="state == 2">\r\n           <img src="http://image.lotte.com/lotte/mo2015/angular/detail/giftOrder_icon4.png">\r\n           <p><span>선물 주문이 취소</span>되었습니다.</p>\r\n           <div class="subbtn">\r\n               <a ng-href="{{presentShop + \'&tclick=m_DC_GiftConfirm_Reject_btn01\'}}" style="width:152px">선물매장 구경하기</a>\r\n           </div>              \r\n      </div>           \r\n      <div class="topbox" ng-if="state == 4">\r\n           <img src="http://image.lotte.com/lotte/mo2015/angular/detail/giftOrder_icon4.png">\r\n           <p><span>선물확인 경로</span>를 다시 확인해주세요.</p>\r\n           <div class="subbtn">\r\n               <a ng-href="{{presentShop + \'&tclick=m_DC_GiftConfirm_Reject_btn01\'}}" style="width:152px">선물매장 구경하기</a>\r\n           </div>              \r\n      </div>           \r\n       \r\n       <div class="g_listbox" ng-if="recom_prd_lst.length > 0">\r\n<!--            <div class="mTop_title">\r\n                <p class="small">선물을 보내주신 {{giftData.gift_msg_info.from_nm}}님에게</p>\r\n                <p class="big">감사를 표현해보세요</p>\r\n                <a class="sideBtn" ng-href="{{presentListUrl}}">더보기</a>\r\n            </div>\r\n-->           \r\n            <div class="mTop_title">\r\n                <p class="big">이런 선물은 어떠세요?</p>\r\n            </div>               \r\n                 <ul class="itemList">\r\n                <li ng-repeat="item in recom_prd_lst" ng-show="$index < 9">\r\n                    <a ng-click="gotoLink(item, $index)">\r\n                        <div class="imageCon">\r\n                            <img ng-src="{{item.img_url}}">\r\n                        </div>\r\n                        <div class="infoCon">\r\n                            <p class="title">{{item.goods_nm}}</p>\r\n                            <p class="price"><b>{{item.sale_price|number}}</b><span>원</span></p>\r\n                        </div>                        \r\n                    </a>\r\n                </li>\r\n            </ul>\r\n       </div>       \r\n   </section>\r\n</section>\r\n\r\n\r\n')}]);