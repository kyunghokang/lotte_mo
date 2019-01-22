angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/used_main_container.html",'<section ng-show="contVisible" class="cont_minheight">  \r\n     \r\n    <section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\r\n    <div class="topbann"> <!--상단배너-->\r\n        <a ng-href="#"><img ng-src="http://image.lotte.com/lotte/mo2018/mall/usedmall_icon_banner.png"></a>\r\n    </div>    \r\n    <div class="addbtn_box" ng-class="{tab:screenData.isTab, app:appObj.isApp}"> <!--판매글 등록하기버튼-->\r\n        <div class="box2">\r\n            <div class="addbtn" ng-click="board_edit(null)">\r\n                <span><span class="lib icon"></span>판매 글 등록하기</span>\r\n            </div>        \r\n        </div>        \r\n    </div>\r\n    <div class="box3" ng-class="{tab:screenData.isTab}">\r\n        <div class="info" ng-click="showInfoPop()">            \r\n            <span>중고라운지 공지사항<span class="lib icon2"></span></span>\r\n        </div>                        \r\n    </div>        \r\n    \r\n    <!--카테고리-->\r\n    <div class="cate_box">\r\n        <div class="subcate">\r\n            <ul>\r\n                <li class="cate_0" ng-class="{on:screenData.ctgDispNo == \'5618795\' || screenData.ctgDispNo == \'\'}" ng-click="selectCate(\'\', \'전체\', 1)"><span>전체 </span></li>\r\n                <li class="cate_{{$index + 1}}" ng-repeat="cate in screenData.data.ctgList.items" ng-class="{on:cate.disp_no == screenData.ctgDispNo}" ng-click="selectCate({{cate.disp_no}},cate.disp_nm,$index+1)"><span>{{cate.disp_nm}}</span></li>\r\n            </ul>\r\n        </div>\r\n        \r\n        <div class="cateSearch">\r\n            <form id="used_search" ng-submit="gatag(1,\'검색하기\');selectSearch(\'search\')">\r\n            <input type="search" ng-model="screenData.keyword" name="used_keyword" placeholder="검색어 입력" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n            </form>\r\n            <div class="lib csh_icon" ng-click="gatag(1,\'검색하기\');selectSearch(\'search\')">검색</div>\r\n            <div class="csh_my" ng-if="screenData.data.mbrCertYn == \'Y\'"><input type="checkbox" class="lib csh_check0" id="my_csh" ng-click="gatag(1,\'내상품보기\');selectSearch(\'my\')"><label for="my_csh">내 상품 보기</label></div>            \r\n        </div>\r\n        \r\n    </div>\r\n    <!--판매목록 모바일 -->\r\n    <div class="csh_list" ng-if="!screenData.isTab && screenData.data.boardListInfo.maxCount > 0">\r\n        <div class="csh_unit" id="unit_{{$index}}" ng-repeat="item in screenData.data.boardListInfo.boardList.items track by $index">\r\n            <div class="paddingbox">\r\n                <div class="title"><span ng-bind-html="item.bbcTitNm"></span>\r\n                    <div class="lib option" ng-class="{on:item.editOpen}" ng-if="item.modYn == \'Y\'" ng-click="gatag(2, \'내상품관리\');item.editOpen = true">글메뉴</div>\r\n                </div>\r\n                <p class="price">{{item.salePrc | number}}<span>원</span></p>               \r\n                <div class="option_pop" ng-show="item.editOpen">\r\n                    <ul>\r\n                        <li ng-click="gatag(2, \'내상품관리_수정\');item.editOpen = false;board_edit(item)">수정하기</li>\r\n                        <li ng-click="gatag(2, \'내상품관리_삭제\');board_delete(item, {{$index}});item.editOpen = false">삭제하기</li>                           \r\n                        <li ng-click="gatag(2, \'내상품관리_닫기\');item.editOpen = false">닫기</li>                           \r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--사진-->\r\n            <div class="photo_con" ng-class="{one:item.imgList.items.length == 1,soldout_con:item.saleStatCd == \'20\'}" ng-if="item.imgList != null">\r\n                <!--사진이 한장일 경우-->\r\n                <div class="one_photo" ng-if="item.imgList.items.length == 1" ng-click="viewPhoto(item.imgList.items, 0)"> \r\n                   <span class="photoframe" style="background-image:url({{item.imgList.items[0].imgUrl}})"></span>\r\n                   <div class="soldout"></div>    \r\n                </div>\r\n                <!--사진이 다수인 경우-->\r\n                <div class="one_more" style="width:{{290*item.imgList.items.length + 20}}px" ng-if="item.imgList.items.length > 1"> \r\n                    <div class="one_photo" ng-repeat="photo in item.imgList.items track by $index"  ng-click="viewPhoto(item.imgList.items, {{$index}})"> \r\n                       <span class="photoframe" style="background-image:url({{photo.imgUrl}})"></span>                    \r\n                        <div class="soldout"></div>    \r\n                    </div>                                    \r\n                </div>\r\n            </div>\r\n            \r\n            <div class="paddingbox">\r\n                <div class="sch_flag">\r\n                    <span ng-if="item.dlexInclusYn != \'Y\'">배송비별도</span>\r\n                    <span ng-if="item.dlexInclusYn == \'Y\'">배송비포함</span>\r\n                    <span ng-if="item.dirTradePsbYn == \'Y\'" class="b">직거래가능</span>\r\n                    <span ng-if="item.dirTradePsbYn != \'Y\'" class="b">직거래불가</span>\r\n                    <span class="c">{{item.shaGoodsStatCd}}</span>\r\n                </div>\r\n                \r\n                <div class="writer">\r\n                    <span class="wa">{{item.userId}}</span>\r\n                    <span class="wb">{{item.regDtime}}</span>\r\n                </div>\r\n                \r\n                <div class="str_info" ng-if="item.dirTradePsbYn == \'Y\' && item.dirTradeRgnNm != \'\'">&bull;&nbsp;직거래 가능지역 : {{item.dirTradeRgnNm}}</div>\r\n                <div class="str_info" ng-bind-html="item.bbcCont"></div>\r\n                <div class="share_info">\r\n                   <div class="sh_table">\r\n                       <div class="sh_cell a" ng-class="{on:item.recommYn == \'Y\'}" ng-click="gatag(2, \'찜\');recommend(item)"><span class="lib" ng-class="{on:false}"></span>찜</div>\r\n                       <div class="sh_cell b" ng-class="{on:item.dclYn == \'Y\'}" ng-click="gatag(2, \'신고\');open_dcl(1, item)"><span class="lib"></span>신고({{item.dclCnt}})</div>\r\n                       <div class="sh_cell c" ng-click="gatag(2, \'공유하기\');showSharePop({shareImg:item.imgList.items[0].imgUrl,prdComment:item.bbcTitNm})"><span class="lib"></span>공유</div>\r\n                   </div>\r\n                   <a ng-show="item.saleStatCd == \'10\'" ng-click="gatag(2, \'연락하기\');call(item.cellNo)"><div class="sh_call"><span class="lib"></span>연락하기</div></a>\r\n                </div>\r\n                \r\n                <!--댓글등록-->\r\n                <div class="csh_add_box">\r\n                    <input ng-model="item.insstr" ng-keyup="reply_focus()" type="text" placeholder="궁금한 점을 문의해보세요 (개인정보 공개작성 금지)" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                    <div class="csh_add" ng-click="gatag(2, \'댓글등록\');reply_write(item, null,\'write\')">등록</div>\r\n                    <div class="csh_secret"><input type="checkbox" ng-model="item.inscheck"  class="lib csh_check0" id="csh_secret_{{$index}}" ng-click="gatag(2, \'비밀문의\')"><label for="csh_secret_{{$index}}">비밀로 문의하기 </label>\r\n                        <span>※&nbsp;적합하지 않은 글은 삭제될 수 있습니다.</span>\r\n                    </div>            \r\n                    \r\n                    <ul ng-show="item.more">\r\n                        <li ng-repeat="reply in item.reply_list track by $index" ng-class="{rline:reply.rplDpthNo == 1}">\r\n                            <!--댓글 -->\r\n                            <div class="ask" ng-if="reply.rplDpthNo == 1">\r\n                                <div class="writer">\r\n                                    <span class="wa">{{reply.loginId}}<span class="secret" ng-if="reply.secretYn == \'Y\'"></span></span>\r\n                                    <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate | cutDate}}\r\n                                        <span class="dcl_mode" ng-hide="reply.secretYn == \'Y\' && item.modYn != \'Y\'" ng-click="gatag(2, \'신고\');open_dcl(2, item, reply, 20)" ng-class="{num:reply.declareNum > 0}"> \r\n                                            <span class="lib dcl" ng-class="{on:reply.declareYn == \'Y\'}"></span> 신고 <em ng-if="reply.declareNum > 0">({{reply.declareNum}})</em>\r\n                                        </span>                                                                                                                      \r\n                                        <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true"></span>                                        \r\n                                        <ul class="option_pop" ng-show="reply.open">\r\n                                            <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                            <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item, {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                            <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                        </ul>\r\n                                    </span>\r\n                                </div>                                \r\n                                <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}\r\n                                    <span ng-if="item.modYn == \'Y\' && (item.reply_list.length - 1 == $index || item.reply_list[$index + 1].rplDpthNo == 1 || (item.reply_list[$index + 1].rplDpthNo == 2 && item.reply_list[$index + 1].uprRplNo != reply.rplNo))" ng-click="gatag(2, \'답글달기\');reply.ansOpen=true">답글</span>\r\n                                </div>\r\n                                <div class="content"  ng-if="reply.editCont">\r\n                                    <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                    <div class="csh_add white tp7" ng-click="gatag(2, \'답글수정등록\');reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                </div>\r\n                                <!--답글을 누를 경우 -->\r\n                                <div class="write_ans" ng-if="reply.ansOpen">\r\n                                    <span class="lib"></span>\r\n                                    <input type="text" ng-model="reply.insstr"  placeholder="답글을 입력하세요" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                                    <div class="csh_add white" ng-click="gatag(2, \'답글등록\');reply_write(item, reply,\'write\')">등록</div>\r\n                                </div>\r\n                            </div>\r\n                            <!--답글 -->\r\n                            <div class="answer"  ng-if="reply.rplDpthNo == 2">\r\n                                <span class="lib arr"></span>\r\n                                <div class="writer">\r\n                                    <span class="wa">{{reply.loginId}}<span class="secret" ng-if="reply.secretYn == \'Y\'"></span></span>\r\n                                    <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate | cutDate}}\r\n                                        <span class="dcl_mode" ng-hide="reply.secretYn == \'Y\' && !(item.reply_list[$index -1].rplNo == reply.uprRplNo && item.reply_list[$index -1].modifyYn == \'Y\')" ng-click="gatag(2, \'신고\');open_dcl(2, item, reply, 30)" ng-class="{num:reply.declareNum > 0}"> \r\n                                            <span class="lib dcl" ng-class="{on:reply.declareYn == \'Y\'}"></span> 신고 <em ng-if="reply.declareNum > 0">({{reply.declareNum}})</em>\r\n                                        </span>                                                                                                                      \r\n                                        <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true" ng-if="reply.modifyYn == \'Y\'"></span>                                        \r\n                                        <ul class="option_pop" ng-show="reply.open">\r\n                                            <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                            <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item, {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                            <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                        </ul>\r\n                                    </span>\r\n                                </div>                                \r\n                                <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}</div>\r\n                                <div class="content"  ng-if="reply.editCont">\r\n                                    <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                    <div class="csh_add white tp7" ng-click="gatag(2, \'답글수정등록\');reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                </div>                                \r\n                            </div>\r\n                        </li>                                                \r\n                    </ul>                \r\n                </div>                \r\n            </div>\r\n            <!--추가문의글-->\r\n            <div class="more" ng-show="item.rplCnt > 0 && (item.more == undefined || !item.more)" ng-click="gatag(2, \'추가댓글보기\');loadReply(item)">\r\n                상품 문의 (<b>{{item.rplCnt}}</b>) <span class="lib"></span>\r\n            </div>            \r\n            <div class="more on" ng-show="item.more" ng-click="gatag(2, \'추가댓글접기\');item.more = false;scroll_reply({{$index}})">\r\n                상품 문의 접기 <span class="lib"></span>\r\n            </div>            \r\n        </div>\r\n        \r\n    </div>\r\n    \r\n    <!--판매목록 태블릿 -->\r\n    <div class="csh_list tab" ng-if="screenData.isTab && screenData.data.boardListInfo.maxCount > 0">\r\n        <div class="csh_unit" ng-repeat="item in screenData.data.boardListInfo.boardList.items track by $index">\r\n            <div class="unit_talbe">\r\n                <div class="unit_cell a">\r\n                    <div class="paddingbox">\r\n                        <div class="title">{{item.bbcTitNm}}                            \r\n                        </div>\r\n                        <p class="price">{{item.salePrc | number}}<span>원</span></p>               \r\n                    </div>                    \r\n                    <!--사진-->\r\n                    <div class="photo_con" id="uta_{{$index}}" ng-if="item.imgList != null" ng-class="{one:item.imgList.items.length == 1,soldout_con:item.saleStatCd == \'20\'}" style="width:{{photo_con_width}}px">\r\n                        <!--사진이 한장일 경우-->\r\n                        <div class="one_photo" ng-if="item.imgList.items.length == 1" ng-click="viewPhoto(item.imgList.items, 0)"> \r\n                           <span class="photoframe" style="background-image:url({{item.imgList.items[0].imgUrl}})"></span>\r\n                           <div class="soldout"></div>    \r\n                        </div>\r\n                        <!--사진이 다수인 경우-->\r\n                        <div class="one_more" style="width:{{photo_width*item.imgList.items.length + 20}}px" ng-if="item.imgList.items.length > 1"> \r\n                            <div class="one_photo" ng-repeat="photo in item.imgList.items track by $index" ng-click="viewPhoto(item.imgList.items, {{$index}})"> \r\n                               <span class="photoframe" style="background-image:url({{photo.imgUrl}})"></span>                    \r\n                                <div class="soldout"></div>    \r\n                            </div>                                    \r\n                        </div>\r\n                    </div>\r\n                    <div class="paddingbox">\r\n                        <div class="sch_flag">\r\n                            <span ng-if="item.dlexInclusYn != \'Y\'">배송비별도</span>\r\n                            <span ng-if="item.dlexInclusYn == \'Y\'">배송비포함</span>\r\n                            <span ng-if="item.dirTradePsbYn == \'Y\'" class="b">직거래가능</span>\r\n                            <span ng-if="item.dirTradePsbYn != \'Y\'" class="b">직거래불가</span>\r\n                            <span class="c">{{item.shaGoodsStatCd}}</span>\r\n                        </div>\r\n                    </div>                    \r\n                </div>\r\n                <div class="unit_cell b">\r\n                    <div class="paddingbox">\r\n                        <div class="paddingbox2" ng-class="{slide:item.imgList.items.length > 1}" >\r\n                            <div class="writer">\r\n                                <span class="wa">{{item.userId}}</span>\r\n                                <span class="wb">{{item.regDtime}}</span>                                \r\n                                \r\n                                <div class="lib option" ng-class="{on:item.editOpen}" ng-if="item.modYn == \'Y\'" ng-click="gatag(2, \'내상품관리\');item.editOpen = true">글메뉴</div>\r\n                                <div class="option_pop" ng-show="item.editOpen">\r\n                                    <ul>\r\n                                        <li ng-click="gatag(2, \'내상품관리_수정\');item.editOpen = false;board_edit(item)">수정하기</li>\r\n                                        <li ng-click="gatag(2, \'내상품관리_삭제\');board_delete(item, {{$index}});item.editOpen = false">삭제하기</li>                           \r\n                                        <li ng-click="gatag(2, \'내상품관리_닫기\');item.editOpen = false">닫기</li>                           \r\n                                    </ul>\r\n                                </div>                            \r\n                            </div>\r\n\r\n                            <div class="str_info" ng-if="item.dirTradePsbYn == \'Y\' && item.dirTradeRgnNm != \'\'">&bull;&nbsp;직거래 가능지역 : {{item.dirTradeRgnNm}}</div>\r\n                            <div class="str_info" ng-bind-html="item.bbcCont"></div>\r\n                            <div class="share_info">\r\n                               <div class="sh_table">\r\n                                   <div class="sh_cell a" ng-class="{on:item.recommYn == \'Y\'}" ng-click="gatag(2, \'찜\');recommend(item)"><span class="lib" ng-class="{on:false}"></span></div>\r\n                                   <div class="sh_cell b" ng-class="{on:item.dclYn == \'Y\'}" ng-click="gatag(2, \'신고\');open_dcl(1, item)"><span class="lib"></span>신고({{item.dclCnt}})</div>\r\n                                   <div class="sh_cell c" ng-click="gatag(2, \'공유하기\');showSharePop({shareImg:item.imgList.items[0].imgUrl,prdComment:item.bbcTitNm})"><span class="lib"></span>공유</div>\r\n                               </div>\r\n                               <a ng-href="tel:{{item.cellNo}}" ng-show="item.saleStatCd == \'10\'"  ng-click="gatag(2, \'연락하기\');call(item.cellNo)"><div class="sh_call"><span class="lib"></span>연락하기</div></a>\r\n                            </div>                            \r\n                        </div>                        \r\n                        \r\n                        <!--댓글등록-->\r\n                        <div class="csh_add_box">\r\n                            <input ng-model="item.insstr"  ng-keyup="reply_focus()" type="text" placeholder="궁금한 점을 문의해보세요 (개인정보 공개작성 금지)" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                            <div class="csh_add" ng-click="gatag(2, \'댓글등록\');reply_write(item, null,\'write\')">등록</div>\r\n                            <div class="csh_secret"><input type="checkbox" ng-model="item.inscheck"  class="lib csh_check0" id="csh_secret_{{$index}}" ng-click="gatag(2, \'비밀문의\')"><label for="csh_secret_{{$index}}">비밀로 문의하기 </label>\r\n                                <span>※&nbsp;적합하지 않은 글은 삭제될 수 있습니다.</span>\r\n                            </div>            \r\n                            <ul ng-show="item.more">\r\n                                <li ng-repeat="reply in item.reply_list track by $index" ng-class="{rline:reply.rplDpthNo == 1}">\r\n                                    <!--댓글 -->\r\n                                    <div class="ask" ng-if="reply.rplDpthNo == 1">\r\n                                        <div class="writer">\r\n                                            <span class="wa">{{reply.loginId}}<span class="secret" ng-if="reply.secretYn == \'Y\'"></span></span>\r\n                                            <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate | cutDate}}\r\n                                                <span class="dcl_mode" ng-hide="reply.secretYn == \'Y\' && item.modYn != \'Y\'" ng-click="gatag(2, \'신고\');open_dcl(2, item, reply, 20)" ng-class="{num:reply.declareNum > 0}"> \r\n                                                    <span class="lib dcl" ng-class="{on:reply.declareYn == \'Y\'}"></span> 신고 <em ng-if="reply.declareNum > 0">({{reply.declareNum}})</em>\r\n                                                </span>                                                                                                                      \r\n                                                <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true"></span>                                        \r\n                                                <ul class="option_pop" ng-show="reply.open">\r\n                                                    <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                                    <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item , {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                                    <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                                </ul>\r\n                                            </span>\r\n                                        </div>                                \r\n                                        <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}\r\n                                            <span ng-if="item.modYn == \'Y\' && (item.reply_list.length - 1 == $index || item.reply_list[$index + 1].rplDpthNo == 1 || (item.reply_list[$index + 1].rplDpthNo == 2 && item.reply_list[$index + 1].uprRplNo != reply.rplNo))" ng-click="gatag(2, \'답글달기\');reply.ansOpen=true">답글</span>\r\n                                        </div>\r\n                                        <div class="content"  ng-if="reply.editCont">\r\n                                            <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                            <div class="csh_add white tp7" ng-click="gatag(2, \'답글수정등록\');reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                        </div>\r\n                                        <!--답글을 누를 경우 -->\r\n                                        <div class="write_ans" ng-if="reply.ansOpen">\r\n                                            <span class="lib"></span>\r\n                                            <input type="text" ng-model="reply.insstr"  placeholder="답글을 입력하세요" autocomplete="off" autocapitalize="off" autocorrect="off" required="" speech="" x-webkit-speech="" ng-keyup="" ng-focus="" class="used_search">\r\n                                            <div class="csh_add white" ng-click="gatag(2, \'답글등록\');reply_write(item, reply,\'write\')">등록</div>\r\n                                        </div>\r\n                                    </div>\r\n                                    <!--답글 -->\r\n                                    <div class="answer"  ng-if="reply.rplDpthNo == 2">\r\n                                        <span class="lib arr"></span>\r\n                                        <div class="writer">\r\n                                            <span class="wa">{{reply.loginId}}<span class="secret" ng-if="reply.secretYn == \'Y\'"></span></span>\r\n                                            <span class="wb" ng-class="{edit:reply.modifyYn == \'Y\'}">{{reply.registDate | cutDate}}\r\n                                                <span class="dcl_mode"  ng-hide="reply.secretYn == \'Y\' && !(item.reply_list[$index -1].rplNo == reply.uprRplNo && item.reply_list[$index -1].modifyYn == \'Y\')" ng-click="gatag(2, \'신고\');open_dcl(2, item, reply, 30)" ng-class="{num:reply.declareNum > 0}"> \r\n                                                    <span class="lib dcl" ng-class="{on:reply.declareYn == \'Y\'}"></span> 신고 <em ng-if="reply.declareNum > 0">({{reply.declareNum}})</em>\r\n                                                </span>                                                                                                                      \r\n                                                <span class="lib edit_mode" ng-click="gatag(2, \'댓글관리\');reply.open = true" ng-if="reply.modifyYn == \'Y\'"></span>                                        \r\n                                                <ul class="option_pop" ng-show="reply.open">\r\n                                                    <li ng-click="gatag(2, \'댓글관리_수정\');reply.editCont = true;reply.open = false">수정하기</li>\r\n                                                    <li ng-click="gatag(2, \'댓글관리_삭제\');reply_delete({{reply.rplNo}}, item , {{reply.rplDpthNo}});reply.open = false">삭제하기</li>                           \r\n                                                    <li ng-click="gatag(2, \'댓글관리_닫기\');reply.open = false">닫기</li>                           \r\n                                                </ul>\r\n                                            </span>\r\n                                        </div>                                \r\n                                        <div class="content" ng-if="!reply.editCont">{{reply.rplCont}}                                        \r\n                                        </div>\r\n                                        <div class="content"  ng-if="reply.editCont">\r\n                                            <input ng-model="reply.rplCont" type="text" class="used_search">\r\n                                            <div class="csh_add white tp7" ng-click="reply_write(item, reply,\'edit\')">등록</div>                                    \r\n                                        </div>                                \r\n                                    </div>\r\n                                </li>                                                \r\n                            </ul>                \r\n                        </div>                \r\n                    </div>\r\n                    <!--추가문의글-->\r\n                    <div class="more" ng-show="item.rplCnt > 0 && (item.more == undefined || !item.more)" ng-click="gatag(2, \'추가댓글보기\');loadReply(item)">\r\n                        상품 문의 (<b>{{item.rplCnt}}</b>) <span class="lib"></span>\r\n                    </div>            \r\n                    <div class="more on" ng-show="item.more" ng-click="gatag(2, \'추가댓글접기\');item.more = false;scroll_reply({{$index}})">\r\n                        상품 문의 접기 <span class="lib"></span>\r\n                    </div>                       \r\n                </div>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n    \r\n    <!--결과 없을 때 -->\r\n    <div class="no_list" ng-show="screenData.data.boardListInfo == null && screenData.myList != \'Y\'">\r\n        검색결과가 없습니다.\r\n    </div>\r\n    <div class="no_list" ng-show="screenData.data.boardListInfo == null && screenData.myList == \'Y\'">\r\n        등록된 판매글이 없습니다. <br> 안쓰는 물건이 있다면 중고라운지를 이용해보세요         \r\n    </div>        \r\n    <!--중고거래 이용안내 -->\r\n    <div class="use_info_pop n2" ng-show="usedPopOpen">\r\n        <div class="frame">\r\n            <div class="box">\r\n                <p>중고거래 이용안내 </p>\r\n                <div class="noti_cont">\r\n                    롯데닷컴은 본 게시판을 통한 거래에 어떠한 관여도 하지 않으며, 거래 결과 발생한 손해나 개인정보 유출로 인한 피해 등에 대하여 어떠한 민.형사적, 행정적 책임을 지지 아니합니다.\r\n                </div>\r\n                <div class="close" ng-click="gatag(0, \'책임 고지 닫기\');close_usedNoMore()">확인</div>\r\n            </div>               \r\n        </div>\r\n    </div>\r\n    \r\n    <!--판매글, 댓글 신고 팝업 -->\r\n    <div class="use_info_pop dcl_pop" ng-show="dclpop.open">\r\n        <div class="frame">\r\n            <div class="box">\r\n                <p>중고 게시물 신고하기</p>                \r\n                <ul>\r\n                    <li ng-repeat="str in dclpop.list"><input type="radio" ng-model="dclpop.cont" class="radio01" name="dcl_r" id="dcl_r{{$index}}" value="{{$index}}"><label for="dcl_r{{$index}}">{{str}}</label></li>\r\n                </ul>\r\n                <div class="btn_group">\r\n                    <div class="btn a" ng-click="gatag(2,\'닫기\');close_dcl()">닫기</div>            \r\n                    <div class="btn b" ng-click="gatag(2,\'신고하기\');dcl_submit()">신고하기</div>\r\n                </div>\r\n            </div>               \r\n        </div>\r\n    </div>    \r\n    \r\n	<!-- imagePopUp -->\r\n	<div ng-if="popOption.open" class=\'gellery-zoomPopup\'>\r\n		<figure>\r\n'+"			<img ng-pinch-zoom max-scale=\"4\" ng-src='{{popOption.data[popOption.cnt].imgUrl}}' orientable width='{{imageSize.width}}' height='{{imageSize.height}}' alt=''/>\r\n			</figure>\r\n		<span class='close'	ng-click='popOption.close()'>\r\n		</span>\r\n		<div class='indicator'>\r\n			<span class='page'>	{{popOption.cnt +1}}/{{popOption.data.length}}</span>\r\n		</div>\r\n		<span ng-if='popOption.cnt>0' class='arrow prev' ng-click='popOption.prev()'></span>\r\n		<span ng-if='popOption.data.length>1&&popOption.cnt<popOption.data.length-1' class='arrow next' ng-click='popOption.next()'></span>		\r\n	</div>   \r\n</section>")}]);