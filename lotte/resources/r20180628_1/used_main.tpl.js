angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/used_main_container.html",'<section ng-show="contVisible" class="cont_minheight">  \r\n     \r\n    <section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\r\n    <div class="topbann"> <!--상단배너-->\r\n        <a ng-href="#"><img ng-src="http://image.lotte.com/lotte/mo2018/mall/usedmall_icon_banner.png"></a>\r\n    </div>    \r\n    <div class="addbtn_box" ng-if="screenData.data.mbrCertYn == \'Y\'" ng-class="{tab:screenData.isTab, app:appObj.isApp}"> <!--판매글 등록하기버튼-->\r\n        <div class="box2">\r\n            <div class="addbtn" ng-click="board_edit(null)">\r\n                <span><span class="lib icon"></span>판매 글 등록하기</span>\r\n            </div>        \r\n        </div>        \r\n    </div>\r\n    <div class="box3" ng-class="{tab:screenData.isTab}">\r\n        <div class="info" ng-click="showInfoPop()" ng-class="{tp:screenData.data.mbrCertYn != \'Y\'}">\r\n            <span>중고판매상품의 의무/책임 고지<span class="lib icon2"></span></span>\r\n        </div>                        \r\n    </div>        \r\n    \r\n    <!--카테고리-->\r\n    <div class="cate_box" ng-class="{nomy:screenData.data.mbrCertYn != \'Y\'}">\r\n        <div class="subcate">\r\n            <ul>\r\n                <li class="cate_0" ng-class="{on:screenData.ctgDispNo == \'5618795\' || screenData.ctgDispNo == \'\'}" ng-click="selectCate(\'\', \'전체\', 1)"><span>전체 </span></li>\r\n                <li class="cate_{{$index + 1}}" ng-repeat="cate in screenData.data.ctgList.items" ng-class="{on:cate.disp_no == screenData.ctgDispNo}" ng-click="selectCate({{cate.disp_no}},cate.disp_nm,$index+1)"><span>{{cate.disp_nm}}</span></li>\r\n            </ul>\r\n        </div>\r\n        \r\n        <div class="cateSearch">\r\n            <form id="used_search" ng-submit="gatag(1,\'검색하기\');selectSearch(\'search\')">\r\n            <input type="search" ng-model="screenData.keyword" name="used_keyword" placeholder="검색어 입력" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n            </form>\r\n            <div class="lib csh_icon" ng-click="gatag(1,\'검색하기\');selectSearch(\'search\')">검색</div>\r\n            <div class="csh_my" ng-if="screenData.data.mbrCertYn == \'Y\'"><input type="checkbox" class="lib csh_check0" id="my_csh" ng-click="gatag(1,\'내상품보기\');selectSearch(\'my\')"><label for="my_csh">내 상품 보기</label></div>            \r\n        </div>\r\n        \r\n    </div>\r\n    <!--판매목록 모바일 -->\r\n    <div class="csh_list" ng-if="!screenData.isTab && screenData.data.boardListInfo.maxCount > 0">\r\n        <div class="csh_unit" id="unit_{{$index}}" ng-repeat="item in screenData.data.boardListInfo.boardList.items track by $index">\r\n            <div class="paddingbox">\r\n                <div class="title">{{item.bbcTitNm}}\r\n                    <div class="lib option" ng-class="{on:item.editOpen}" ng-if="item.modYn == \'Y\'" ng-click="gatag(2, \'내상품관리\');item.editOpen = true">글메뉴</div>\r\n                </div>\r\n                <p class="price">{{item.salePrc | number}}<span>원</span></p>               \r\n                <div class="option_pop" ng-show="item.editOpen">\r\n                    <ul>\r\n                        <li ng-click="gatag(2, \'내상품관리_수정\');item.editOpen = false;board_edit(item)">수정하기</li>\r\n                        <li ng-click="gatag(2, \'내상품관리_삭제\');board_delete(item, {{$index}});item.editOpen = false">삭제하기</li>                           \r\n                        <li ng-click="gatag(2, \'내상품관리_닫기\');item.editOpen = false">닫기</li>                           \r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--사진-->\r\n            <div class="photo_con" ng-class="{one:item.imgList.items.length == 1,soldout_con:item.saleStatCd == \'20\'}" ng-if="item.imgList != null">\r\n                <!--사진이 한장일 경우-->\r\n                <div class="one_photo" ng-if="item.imgList.items.length == 1" ng-click="viewPhoto(item.imgList.items, 0)"> \r\n                   <span class="photoframe" style="background-image:url({{item.imgList.items[0].imgUrl}})"></span>\r\n                   <div class="soldout"></div>    \r\n                </div>\r\n                <!--사진이 다수인 경우-->\r\n                <div class="one_more" style="width:{{290*item.imgList.items.length + 20}}px" ng-if="item.imgList.items.length > 1"> \r\n                    <div class="one_photo" ng-repeat="photo in item.imgList.items track by $index"  ng-click="viewPhoto(item.imgList.items, {{$index}})"> \r\n                       <span class="photoframe" style="background-image:url({{photo.imgUrl}})"></span>                    \r\n                        <div class="soldout"></div>    \r\n                    </div>                                    \r\n                </div>\r\n            </div>\r\n            \r\n            <div class="paddingbox">\r\n                <div class="sch_flag">\r\n                    <span ng-if="item.dlexInclusYn != \'Y\'">배송비별도</span>\r\n                    <span ng-if="item.dlexInclusYn == \'Y\'">배송비포함</span>\r\n                    <span ng-if="item.dirTradePsbYn == \'Y\'" class="b">직거래가능</span>\r\n                    <span ng-if="item.dirTradePsbYn != \'Y\'" class="b">직거래불가</span>\r\n                    <span class="c">{{item.shaGoodsStatCd}}</span>\r\n                </div>\r\n                \r\n                <div class="writer">\r\n                    <span class="wa">{{item.userId}}</span>\r\n                    <span class="wb">{{item.regDtime}}</span>\r\n                </div>\r\n                \r\n                <div class="str_info" ng-if="item.dirTradePsbYn == \'Y\' && item.dirTradeRgnNm != \'\'">&bull;&nbsp;직거래 가능지역 : {{item.dirTradeRgnNm}}</div>\r\n                <div class="str_info" ng-bind-html="item.bbcCont"></div>\r\n                <div class="share_info">\r\n                   <div class="sh_table">\r\n                       <div class="sh_cell a" ng-class="{on:item.recommYn == \'Y\'}" ng-click="gatag(2, \'추천\');recommend(item)"><span class="lib" ng-class="{on:false}"></span>추천</div>\r\n                       <div class="sh_cell b" ng-class="{on:item.dclYn == \'Y\'}" ng-click="gatag(2, \'신고\');dcl(item)"><span class="lib"></span>신고({{item.dclCnt}})</div>\r\n                       <div class="sh_cell c" ng-click="gatag(2, \'공유하기\');showSharePop({shareImg:item.imgList.items[0].imgUrl,prdComment:item.bbcTitNm})"><span class="lib"></span>공유</div>\r\n                   </div>\r\n                   <a ng-href="tel:{{item.cellNo | base64Decode}}" ng-show="screenData.data.mbrCertYn == \'Y\' && item.saleStatCd == \'10\'" ng-click="gatag(2, \'연락하기\')"><div class="sh_call"><span class="lib"></span>연락하기</div></a>\r\n                </div>\r\n                \r\n                <!--댓글등록-->\r\n                <div class="csh_add_box">\r\n                    <input ng-model="item.insstr" type="text" placeholder="궁금한 점을 문의해보세요 (개인정보 공개작성 금지)" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                    <div class="csh_add" ng-click="gatag(2, \'댓글등록\');reply_write(item, null,\'write\')">등록</div>\r\n                    <div class="csh_secret"><input type="checkbox" ng-model="item.inscheck"  class="lib csh_check0" id="csh_secret_{{$index}}" ng-click="gatag(2, \'비밀문의\')"><label for="csh_secret_{{$index}}">비밀로 문의하기 </label>\r\n                        <span>※&nbsp;적합하지 않은 글은 삭제될 수 있습니다.</span>\r\n                    </div>            \r\n                    \r\n                    <ul ng-show="item.more">\r\n                        <li ng-repeat="reply in item.reply_list track by $index" ng-class="{rline:reply.rplDpthNo == 1}">\r\n                            <!--댓글 -->\r\n                            <div class="ask" ng-if="reply.rplDpthNo == 1">\r\n                                <div class="writer">\r\n                                    <span class="wa">{{reply.loginId}}</span>\r\n                                    <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate}}\r\n                                        <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true"></span>                                        \r\n                                        <ul class="option_pop" ng-show="reply.open">\r\n                                            <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                            <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item, {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                            <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                        </ul>\r\n                                    </span>\r\n                                </div>                                \r\n                                <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}\r\n                                    <span ng-if="item.modYn == \'Y\' && (item.reply_list.length - 1 == $index || item.reply_list[$index + 1].rplDpthNo == 1 || (item.reply_list[$index + 1].rplDpthNo == 2 && item.reply_list[$index + 1].uprRplNo != reply.rplNo))" ng-click="gatag(2, \'답글달기\');reply.ansOpen=true">답글</span>\r\n                                </div>\r\n                                <div class="content"  ng-if="reply.editCont">\r\n                                    <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                    <div class="csh_add white tp7" ng-click="gatag(2, \'답글수정등록\');reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                </div>\r\n                                <!--답글을 누를 경우 -->\r\n                                <div class="write_ans" ng-if="reply.ansOpen">\r\n                                    <span class="lib"></span>\r\n                                    <input type="text" ng-model="reply.insstr"  placeholder="답글을 입력하세요" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                                    <div class="csh_add white" ng-click="gatag(2, \'답글등록\');reply_write(item, reply,\'write\')">등록</div>\r\n                                </div>\r\n                            </div>\r\n                            <!--답글 -->\r\n                            <div class="answer"  ng-if="reply.rplDpthNo == 2">\r\n                                <span class="lib arr"></span>\r\n                                <div class="writer">\r\n                                    <span class="wa">{{reply.loginId}}</span>\r\n                                    <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate}}\r\n                                        <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true" ng-if="reply.modifyYn == \'Y\'"></span>                                        \r\n                                        <ul class="option_pop" ng-show="reply.open">\r\n                                            <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                            <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item, {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                            <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                        </ul>\r\n                                    </span>\r\n                                </div>                                \r\n                                <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}</div>\r\n                                <div class="content"  ng-if="reply.editCont">\r\n                                    <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                    <div class="csh_add white tp7" ng-click="gatag(2, \'답글수정등록\');reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                </div>                                \r\n                            </div>\r\n                        </li>                                                \r\n                    </ul>                \r\n                </div>                \r\n            </div>\r\n            <!--추가문의글-->\r\n            <div class="more" ng-show="item.rplCnt > 0 && (item.more == undefined || !item.more)" ng-click="gatag(2, \'추가댓글보기\');loadReply(item)">\r\n                상품 문의 (<b>{{item.rplCnt}}</b>) <span class="lib"></span>\r\n            </div>            \r\n            <div class="more on" ng-show="item.more" ng-click="gatag(2, \'추가댓글접기\');item.more = false;scroll_reply({{$index}})">\r\n                상품 문의 접기 <span class="lib"></span>\r\n            </div>            \r\n        </div>\r\n        \r\n    </div>\r\n    \r\n    <!--판매목록 태블릿 -->\r\n    <div class="csh_list tab" ng-if="screenData.isTab && screenData.data.boardListInfo.maxCount > 0">\r\n        <div class="csh_unit" ng-repeat="item in screenData.data.boardListInfo.boardList.items track by $index">\r\n            <div class="unit_talbe">\r\n                <div class="unit_cell a">\r\n                    <div class="paddingbox">\r\n                        <div class="title">{{item.bbcTitNm}}                            \r\n                        </div>\r\n                        <p class="price">{{item.salePrc | number}}<span>원</span></p>               \r\n                    </div>                    \r\n                    <!--사진-->\r\n                    <div class="photo_con" id="uta_{{$index}}" ng-if="item.imgList != null" ng-class="{one:item.imgList.items.length == 1,soldout_con:item.saleStatCd == \'20\'}" style="width:{{photo_con_width}}px">\r\n                        <!--사진이 한장일 경우-->\r\n                        <div class="one_photo" ng-if="item.imgList.items.length == 1" ng-click="viewPhoto(item.imgList.items, 0)"> \r\n                           <span class="photoframe" style="background-image:url({{item.imgList.items[0].imgUrl}})"></span>\r\n                           <div class="soldout"></div>    \r\n                        </div>\r\n                        <!--사진이 다수인 경우-->\r\n                        <div class="one_more" style="width:{{photo_width*item.imgList.items.length + 20}}px" ng-if="item.imgList.items.length > 1"> \r\n                            <div class="one_photo" ng-repeat="photo in item.imgList.items track by $index" ng-click="viewPhoto(item.imgList.items, {{$index}})"> \r\n                               <span class="photoframe" style="background-image:url({{photo.imgUrl}})"></span>                    \r\n                                <div class="soldout"></div>    \r\n                            </div>                                    \r\n                        </div>\r\n                    </div>\r\n                    <div class="paddingbox">\r\n                        <div class="sch_flag">\r\n                            <span ng-if="item.dlexInclusYn != \'Y\'">배송비별도</span>\r\n                            <span ng-if="item.dlexInclusYn == \'Y\'">배송비포함</span>\r\n                            <span ng-if="item.dirTradePsbYn == \'Y\'" class="b">직거래가능</span>\r\n                            <span ng-if="item.dirTradePsbYn != \'Y\'" class="b">직거래불가</span>\r\n                            <span class="c">{{item.shaGoodsStatCd}}</span>\r\n                        </div>\r\n                    </div>                    \r\n                </div>\r\n                <div class="unit_cell b">\r\n                    <div class="paddingbox">\r\n                        <div class="paddingbox2" ng-class="{slide:item.imgList.items.length > 1}" >\r\n                            <div class="writer">\r\n                                <span class="wa">{{item.userId}}</span>\r\n                                <span class="wb">{{item.regDtime}}</span>                                \r\n                                \r\n                                <div class="lib option" ng-class="{on:item.editOpen}" ng-if="item.modYn == \'Y\'" ng-click="gatag(2, \'내상품관리\');item.editOpen = true">글메뉴</div>\r\n                                <div class="option_pop" ng-show="item.editOpen">\r\n                                    <ul>\r\n                                        <li ng-click="gatag(2, \'내상품관리_수정\');item.editOpen = false;board_edit(item)">수정하기</li>\r\n                                        <li ng-click="gatag(2, \'내상품관리_삭제\');board_delete(item, {{$index}});item.editOpen = false">삭제하기</li>                           \r\n                                        <li ng-click="gatag(2, \'내상품관리_닫기\');item.editOpen = false">닫기</li>                           \r\n                                    </ul>\r\n                                </div>                            \r\n                            </div>\r\n\r\n                            <div class="str_info" ng-if="item.dirTradePsbYn == \'Y\' && item.dirTradeRgnNm != \'\'">&bull;&nbsp;직거래 가능지역 : {{item.dirTradeRgnNm}}</div>\r\n                            <div class="str_info" ng-bind-html="item.bbcCont"></div>\r\n                            <div class="share_info">\r\n                               <div class="sh_table">\r\n                                   <div class="sh_cell a" ng-class="{on:item.recommYn == \'Y\'}" ng-click="gatag(2, \'추천\');recommend(item)"><span class="lib" ng-class="{on:false}"></span>추천</div>\r\n                                   <div class="sh_cell b" ng-class="{on:item.dclYn == \'Y\'}" ng-click="gatag(2, \'신고\');dcl(item)"><span class="lib"></span>신고({{item.dclCnt}})</div>\r\n                                   <div class="sh_cell c" ng-click="gatag(2, \'공유하기\');showSharePop({shareImg:item.imgList.items[0].imgUrl,prdComment:item.bbcTitNm})"><span class="lib"></span>공유</div>\r\n                               </div>\r\n                               <a ng-href="tel:{{item.cellNo}}" ng-show="screenData.data.mbrCertYn == \'Y\' && item.saleStatCd == \'10\'"  ng-click="gatag(2, \'연락하기\')"><div class="sh_call"><span class="lib"></span>연락하기</div></a>\r\n                            </div>                            \r\n                        </div>\r\n                        \r\n                        \r\n                        <!--<div class="blank_h" ng-if="item.imgList != null" ng-class="{one:item.imgList.itemss.length == 1}" id="utb_{{$index}}" style="padding-top:{{ $index | cal_h}}px">간격맞추기용레이어</div>-->\r\n                        \r\n                        <!--댓글등록-->\r\n                        <div class="csh_add_box">\r\n                            <input ng-model="item.insstr" type="text" placeholder="궁금한 점을 문의해보세요 (개인정보 공개작성 금지)" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                            <div class="csh_add" ng-click="gatag(2, \'댓글등록\');reply_write(item, null,\'write\')">등록</div>\r\n                            <div class="csh_secret"><input type="checkbox" ng-model="item.inscheck"  class="lib csh_check0" id="csh_secret_{{$index}}" ng-click="gatag(2, \'비밀문의\')"><label for="csh_secret_{{$index}}">비밀로 문의하기 </label>\r\n                                <span>※&nbsp;적합하지 않은 글은 삭제될 수 있습니다.</span>\r\n                            </div>            \r\n                            <ul ng-show="item.more">\r\n                                <li ng-repeat="reply in item.reply_list track by $index" ng-class="{rline:reply.rplDpthNo == 1}">\r\n                                    <!--댓글 -->\r\n                                    <div class="ask" ng-if="reply.rplDpthNo == 1">\r\n                                        <div class="writer">\r\n                                            <span class="wa">{{reply.loginId}}</span>\r\n                                            <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate}}\r\n                                                <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true"></span>                                        \r\n                                                <ul class="option_pop" ng-show="reply.open">\r\n                                                    <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                                    <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item , {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                                    <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                                </ul>\r\n                                            </span>\r\n                                        </div>                                \r\n                                        <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}\r\n                                            <span ng-if="item.modYn == \'Y\' && (item.reply_list.length - 1 == $index || item.reply_list[$index + 1].rplDpthNo == 1 || (item.reply_list[$index + 1].rplDpthNo == 2 && item.reply_list[$index + 1].uprRplNo != reply.rplNo))" ng-click="gatag(2, \'답글달기\');reply.ansOpen=true">답글</span>\r\n                                        </div>\r\n                                        <div class="content"  ng-if="reply.editCont">\r\n                                            <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                            <div class="csh_add white tp7" ng-click="gatag(2, \'답글수정등록\');reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                        </div>\r\n                                        <!--답글을 누를 경우 -->\r\n                                        <div class="write_ans" ng-if="reply.ansOpen">\r\n                                            <span class="lib"></span>\r\n                                            <input type="text" ng-model="reply.insstr"  placeholder="답글을 입력하세요" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                                            <div class="csh_add white" ng-click="gatag(2, \'답글등록\');reply_write(item, reply,\'write\')">등록</div>\r\n                                        </div>\r\n                                    </div>\r\n                                    <!--답글 -->\r\n                                    <div class="answer"  ng-if="reply.rplDpthNo == 2">\r\n                                        <span class="lib arr"></span>\r\n                                        <div class="writer">\r\n                                            <span class="wa">{{reply.loginId}}</span>\r\n                                            <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate}}\r\n                                                <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true" ng-if="reply.modifyYn == \'Y\'"></span>                                        \r\n                                                <ul class="option_pop" ng-show="reply.open">\r\n                                                    <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                                    <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item , {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                                    <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                                </ul>\r\n                                            </span>\r\n                                        </div>                                \r\n                                        <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}</div>\r\n                                        <div class="content"  ng-if="reply.editCont">\r\n                                            <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                            <div class="csh_add white tp7" ng-click="reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                        </div>                                \r\n                                    </div>\r\n                                </li>                                                \r\n                            </ul>                \r\n                        </div>                \r\n                    </div>\r\n                    <!--추가문의글-->\r\n                    <div class="more" ng-show="item.rplCnt > 0 && (item.more == undefined || !item.more)" ng-click="gatag(2, \'추가댓글보기\');loadReply(item)">\r\n                        상품 문의 (<b>{{item.rplCnt}}</b>) <span class="lib"></span>\r\n                    </div>            \r\n                    <div class="more on" ng-show="item.more" ng-click="gatag(2, \'추가댓글접기\');item.more = false;scroll_reply({{$index}})">\r\n                        상품 문의 접기 <span class="lib"></span>\r\n                    </div>                       \r\n                </div>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n    \r\n    <!--결과 없을 때 -->\r\n    <div class="no_list" ng-show="screenData.data.boardListInfo == null && screenData.myList != \'Y\'">\r\n        검색결과가 없습니다.\r\n    </div>\r\n    <div class="no_list" ng-show="screenData.data.boardListInfo == null && screenData.myList == \'Y\'">\r\n        등록된 판매글이 없습니다. <br> 안쓰는 물건이 있다면 중고라운지를 이용해보세요         \r\n    </div>        \r\n    <!--중고거래 이용안내 -->\r\n    <div class="use_info_pop" ng-show="use_pop_show">\r\n        <div class="frame">\r\n            <div class="box">\r\n                <p>중고거래 이용안내 </p>\r\n                <ul>\r\n                    <li>본 게시판은 소비자간 거래 활성화를 위한 무상 서비스 플랫폼입니다.</li>\r\n                    <li>본 게시판의 게시글 및 댓글에 대한 법적 책임은 작성자에게 있습니다.</li>    \r\n                    <li>롯데닷컴은 본 게시판에 등록된 정보에 대한 정확성이나 신뢰성에 대한 어떠한 보증도 하지 아니합니다.</li>    \r\n                    <li>등록된 개인정보(연락처)는 최초 등록 후 90일 또는 상품 판매 종료시 노출되지 않습니다. </li>    \r\n                    <li>본 게시판은 모두 공개를 원칙으로 하므로 개인정보 유출로 인한 피해가 발생하지 않도록 개인정보 관리에 유의하여 주시기 바랍니다. 예) 카카오톡ID, 상세주소, 연락처 등</li>    \r\n                    <li>타인의 권리 보호를 위하여 타인이 만든 이미지나 문구, 타인의 개인정보, 허위 사실, 비방•욕설, 음란물 게시 등의 행동을 자제하여 주시기 바랍니다. 상기 사유로 5회 이상 모니터링 또는 신고 접수 시 게시글 또는 댓글이 비노출 처리되거나 임의로 삭제될 수 있습니다.</li>    \r\n                    <li>롯데닷컴은 본 게시판을 통한 거래에 어떠한 관여도 하지 않으며, 거래 결과 발생한 손해나 개인정보 유출로 인한 피해 등에 대하여 어떠한 민.형사적, 행정적 책임을 지지 아니합니다.</li>\r\n                </ul>\r\n                <div class="close" ng-click="gatag(0, \'책임 고지 닫기\');use_pop_show = false">닫기</div>\r\n            </div>               \r\n        </div>\r\n    </div>\r\n	<!-- imagePopUp -->\r\n	<div ng-if="popOption.open" class=\'gellery-zoomPopup\'>\r\n		<figure>\r\n			<img\r\n				ng-pinch-zoom\r\n				max-scale="4"\r\n				ng-src=\'{{popOption.data[popOption.cnt].imgUrl}}\'\r\n				orientable\r\n				width=\'{{imageSize.width}}\'\r\n				height=\'{{imageSize.height}}\'\r\n				alt=\'\'/>\r\n			</figure>\r\n		<span\r\n			class=\'close\'\r\n			ng-click=\'popOption.close()\'>\r\n		</span>\r\n		<div class=\'indicator\'>\r\n			<span class=\'page\'>\r\n				{{popOption.cnt +1}}/{{popOption.data.length}}\r\n			</span>\r\n		</div>\r\n		<span\r\n			ng-if=\'popOption.cnt>0\'\r\n			class=\'arrow prev\'\r\n			ng-click=\'popOption.prev()\'>\r\n		</span>\r\n		<span\r\n			ng-if=\'popOption.data.length>1&&popOption.cnt<popOption.data.length-1\'\r\n			class=\'arrow next\'\r\n			ng-click=\'popOption.next()\'>\r\n		</span>		\r\n	</div>   \r\n	<div class="log" ng-hide="true">\r\n    test ----- <br>\r\n	    {{log}}\r\n	</div> \r\n</section>')}]);