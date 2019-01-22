angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/used_write_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n    <section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\r\n    <form ng-model=\'dataForm\' method=\'post\' enctype="multipart/form-data" id="board_write">    \r\n    <div class="paddingbox" ng-if="!scrmode">    \r\n        <div class="title">상품 상태 변경 </div>\r\n        <div class="input_con t3">\r\n            <span class="meet_con pa50"><input type="radio"  ng-click="gatag(\'상태변경\', \'판매중\')" ng-model="used_data.item.saleStatCd" value="10" class="lib csh_check0" id="sstat"><label for="sstat">판매중 </label></span>\r\n            <span class="meet_con"><input type="radio"  ng-click="gatag(\'상태변경\', \'판매완료\')" ng-model="used_data.item.saleStatCd" value="20" class="lib csh_check0" id="sstat2"><label for="sstat2">판매완료 </label></span>\r\n        </div>\r\n    </div>  \r\n        \r\n    <div class="paddingbox" id="pd1">    \r\n        <div class="title">사진등록하기 <span>({{photoCount}}/3)</span><div class="lib" ng-click="addPhoto()"></div></div>        \r\n        <div class="photo_con">\r\n            <ul>\r\n                <li ng-repeat="photo in used_data.item.imgInfo track by $index">\r\n                    <div class=\'circle\'>\r\n                        <figure  ng-class="{horizontal:rotateCode[$index]==2,rotate180:rotateCode[$index]==3,rotate90:rotateCode[$index]==6,rotateM90:rotateCode[$index]==8,vertical:rotateCode[$index]==4,horizontalRotate90:rotateCode[$index]==5,horizontalRotateM90:rotateCode[$index]==7}" style="background:url({{photo}}) no-repeat center center; background-size:auto 100%" ng-click="popOption.show(photo, this, $index)">\r\n                        </figure>                        \r\n                        <input\r\n                            ng-class="{hide:photo != \'\'}" \r\n                            ng-if="AccessUpload"\r\n                            type=\'file\'\r\n                            name="imgFileList"\r\n                            index = "{{$index}}" \r\n                            onchange="getScope().photoPreview(this)" \r\n                            accept="image/jpeg"\r\n                            id="pli_{{$index}}"   \r\n                               />\r\n                        <div ng-click=\'userVersionCheck()\' class=\'appDownload\' ng-if="!AccessUpload"></div>                        \r\n                        <input type=\'hidden\' name=\'orgImgFileList\' ng-model=\'orgImgFileList[$index]\' value="{{orgImgFileList[$index]}}"/>                        \r\n                        <input type=\'hidden\' name=\'rotateCd\' ng-model=\'rotateCode[$index]\' value="{{rotateCode[$index]}}"/>                        \r\n                    </div>                   \r\n                    <span class="lib bg"></span>\r\n                    <span class="lib del" id="delete_{{$index}}" ng-show="photo != \'\'" ng-click="deletePhoto(this, {{$index}})"></span>\r\n                </li>\r\n            </ul>            \r\n        </div>\r\n        <div class="info_1">해당 이미지를 클릭하시면 확대보기 및 삭제가 가능합니다.</div>\r\n    </div>\r\n    \r\n    <div class="paddingbox"  id="pd2">    \r\n        <div class="title">상품명 </div>\r\n        <div class="input_con">\r\n            <input type="text" ng-model="used_data.item.bbcTitNm" placeholder="상품명을 최대 50자 이내로 등록해주세요" ng-change="check_title(50)" ng-blur="gatag(\'상품명\', \'상품명\')" maxlength="51" autocomplete="off" class="inputbox">\r\n        </div>\r\n    </div>    \r\n    \r\n    <div class="paddingbox"  id="pd3">    \r\n        <div class="title">카테고리 </div>\r\n        <div class="table_con">\r\n            <div class="cell" ng-class="{on:cate.disp_no == used_data.item.dispNo}" ng-repeat="cate in used_data.ctgList" ng-click="gatag(\'카테고리\', \'{{cate.disp_nm}}\');selectCate(cate.disp_no)">{{cate.disp_nm}}</div>\r\n        </div>\r\n    </div>   \r\n\r\n    <div class="paddingbox"  id="pd4">    \r\n        <div class="title">판매가 </div>\r\n        <div class="input_con price">\r\n            <input type="text" ng-model="used_data.item.salePrc" ng-blur="gatag(\'판매가\', \'판매가\')" maxlength="10" placeholder="판매금액을 입력해주세요" class="inputbox" id="g_price">\r\n            <span>원 </span><span class="delivery_fee"><input type="checkbox" ng-model="check_list[0]" ng-change="gatag(\'판매가\', \'배송비포함\')" class="lib csh_check0" id="delivery"><label for="delivery">배송비 포함 </label></span>\r\n        </div>\r\n    </div>    \r\n    \r\n    <div class="paddingbox tel"  id="pd5">    \r\n        <div class="title tel">연락처 <span>(휴대전화번호로 입력해주세요)</span></div>        \r\n        <div class="table_con tel">\r\n            <div class="cell"><input type="text" ng-model="phoneArr[0]" class="inputbox" maxlength="4" id="phone1"></div>\r\n            <div class="cell t2"><input type="text" ng-model="phoneArr[1]" class="inputbox" maxlength="4" id="phone2"></div>\r\n            <div class="cell t2"><input type="text" ng-model="phoneArr[2]"  ng-blur="gatag(\'연락처\', \'연락처입력\')" class="inputbox" maxlength="4" id="phone3"></div>        \r\n        </div>\r\n        <p class="agree_tit">[필수] 개인정보 수집 이용 동의  </p>\r\n        <div class="table_con telinfo tt">\r\n            <div class="cell">목적</div>\r\n            <div class="cell">항목</div>\r\n            <div class="cell">보유기간</div>        \r\n        </div>\r\n        <div class="table_con telinfo tc">\r\n            <div class="cell">중고 상품 거래를 위한 이용자 개인간의 연락</div>\r\n            <div class="cell">휴대폰 번호 </div>\r\n            <div class="cell">게시글 등록 후 90일 이후</div>        \r\n        </div>\r\n        <p class="agree_con"><input type="checkbox"  ng-model="check_list[1]" ng-change="gatag(\'연락처\', \'개인정보공개동의\')" class="lib csh_check0" id="agree_check"><label for="agree_check">중고거래 서비스 이용을 위해 개인정보 공개에 동의합니다.</label></p>\r\n    </div> \r\n          \r\n    <div class="paddingbox"  id="pd6">    \r\n        <div class="title">상품상태 </div>\r\n        <div class="table_con">\r\n            <div class="cell" ng-class="{on:used_data.item.shaGoodsStatCd == \'미사용\'}" ng-click="selectGoodStat(\'미사용\')">미사용 </div>\r\n            <div class="cell" ng-class="{on:used_data.item.shaGoodsStatCd == \'거의새것\'}" ng-click="selectGoodStat(\'거의새것\')">거의새것  </div>\r\n            <div class="cell" ng-class="{on:used_data.item.shaGoodsStatCd == \'사용감있음\'}" ng-click="selectGoodStat(\'사용감있음\')">사용감있음 </div>\r\n            <div class="cell" ng-class="{on:used_data.item.shaGoodsStatCd == \'하자있음\'}" ng-click="selectGoodStat(\'하자있음\')">하자있음 </div>\r\n        </div>\r\n    </div>   \r\n    \r\n    <div class="paddingbox">    \r\n        <div class="title">직거래 가능여부 </div>\r\n        <div class="input_con t3">\r\n            <span class="meet_con"><input type="checkbox"  ng-model="check_list[2]" class="lib csh_check0" id="meet" ng-change="gatag(\'직거래여부\',\'가능여부\');check_meetarea()"><label for="meet">가능합니다.</label></span>\r\n            <input type="text" placeholder="가능지역을 입력해주세요" class="inputbox" ng-model="used_data.item.dirTradeRgnNm" ng-blur="gatag(\'직거래여부\', \'가능여부_지역입력\')" maxlength="20" disabled id="meet_input">            \r\n        </div>\r\n    </div>  \r\n    \r\n    <div class="paddingbox goodsinfo">    \r\n        <div class="title">[부가정보] 물품설명 </div>\r\n        <textarea placeholder="최대 300바이트 입력 가능합니다.\r\n카카오 톡 id, 주소 등 개인정보는 입력을 자제해주세요" class="inputbox" ng-model="used_data.item.bbcCont" ng-change="check_byte()" ng-blur="gatag(\'부가정보\',\'부가정보\');check_word()"></textarea>  \r\n        <div class="byte"><span>{{nowbyte}}</span>/300 byte</div>          \r\n    </div> \r\n    \r\n    <div class="paddingbox"  id="pd7" ng-if="scrmode">    \r\n        <div class="input_con t4">\r\n            <span class="meet_con"><input type="checkbox"  ng-model="check_list[3]" class="lib csh_check0" ng-change="gatag(\'약관동의\', \'등록안내 동의\')" id="agree_all"><label for="agree_all">판매 상품 등록 이용약관 동의</label></span>\r\n            <span class="arrow" ng-click="show_term = !show_term" ng-class="{on:!show_term}"></span>\r\n            <div class="agree_terms" ng-show="show_term">\r\n                <ul>\r\n                    <li>본 게시판은 소비자간 거래 활성화를 위한 무상 서비스 플랫폼입니다.</li>\r\n                    <li>본 게시판의 게시글 및 댓글에 대한 법적 책임은 작성자에게 있습니다.</li>\r\n                    <li>롯데닷컴은 본 게시판에 등록된 정보에 대한 정확성이나 신뢰성에 대한 어떠한 보증도 하지 아니합니다.</li>\r\n                    <li>등록된 개인정보(연락처)는 최초 등록 후 90일 또는 상품판매 종료시 노출되지 않습니다. </li>\r\n                    <li>본 게시판은 모두 공개를 원칙으로 하므로 개인정보 유출로 인한 피해가 발생하지 않도록 개인정보 관리에 유의하여 주시기 바랍니다. 예) 카카오톡ID, 상세주소, 연락처 등</li>\r\n                    <li>타인의 권리 보호를 위하여 타인이 만든 이미지나 문구, 타인의 개인정보, 허위 사실, 비방.욕설, 음란물 게시 등의 행동을 자제하여 주시기 바랍니다. 상기 사유로 5회 이상 모니터링 또는 신고 접수 시 게시글 또는 댓글이 비노출 처리 되거나 임의로 삭제될 수 있습니다.</li>\r\n                    <li>롯데닷컴은 본 게시판을 통한 거래에 어떠한 관여도 하지 않으며, 거래 결과 발생한 손해나 개인정보 유출로 인한 피해 등에 대하여 어떠한 민.형사적, 행정적 책임을 지지 아니합니다.</li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n    <div class="paddingbox">\r\n        <div class="btn_group">\r\n            <div class="btn a" ng-click="gatag(\'취소하기\',\'취소하기\');go_back()">취소하기</div>            \r\n            <div class="btn b" ng-click="gatag(\'등록하기\',\'등록하기\');submit()" ng-if="scrmode">등록하기</div>\r\n            <div class="btn b" ng-click="gatag(\'수정하기\',\'수정하기\');submit_edit()" ng-if="!scrmode">수정하기</div>\r\n        </div>\r\n    </div> \r\n        <!--전송목록-->\r\n'+"<!--        <input type='hidden' name='mbrNo' ng-model='loginInfo.mbrNo' value=\"{{loginInfo.mbrNo}}\"/>                    \r\n        <input type='hidden' name='userId' ng-model='loginInfo.loginId' value=\"{{loginInfo.loginId}}\"/>                    \r\n        <input type='hidden' name='bbcNo' ng-model='dataForm.bbcNo' value=\"{{dataForm.bbcNo}}\"/>                    \r\n        <input type='hidden' name='dispNo' ng-model='dataForm.dispNo' value=\"{{dataForm.dispNo}}\"/>\r\n        <input type='hidden' name='bbcTitNm' ng-model='dataForm.bbcTitNm' value=\"{{dataForm.bbcTitNm}}\"/>                    \r\n        <input type='hidden' name='salePrc' ng-model='dataForm.salePrc' value=\"{{dataForm.salePrc}}\"/>                    \r\n        <input type='hidden' name='dlexInclusYn' ng-model='dataForm.dlexInclusYn' value=\"{{dataForm.dlexInclusYn}}\"/>                    \r\n        <input type='hidden' name='cellNo' ng-model='dataForm.cellNo' value=\"{{dataForm.cellNo}}\"/>                    \r\n        <input type='hidden' name='shaGoodsStatCd' ng-model='dataForm.shaGoodsStatCd' value=\"{{dataForm.shaGoodsStatCd}}\"/>                    \r\n        <input type='hidden' name='cellNoOppbAgrYn' ng-model='dataForm.cellNoOppbAgrYn' value=\"{{dataForm.cellNoOppbAgrYn}}\"/>                    \r\n        <input type='hidden' name='dirTradePsbYn' ng-model='dataForm.dirTradePsbYn' value=\"{{dataForm.dirTradePsbYn}}\"/>                                        \r\n        <input type='hidden' name='shaBbcRegAgrYn' ng-model='dataForm.shaBbcRegAgrYn' ng-if=\"scrmode\" value=\"{{dataForm.shaBbcRegAgrYn}}\"/>                                        \r\n        <input type='hidden' name='dirTradeRgnNm' ng-model='dataForm.dirTradeRgnNm' value=\"{{dataForm.dirTradeRgnNm}}\"/>                                        \r\n        <input type='hidden' name='bbcCont' ng-model='dataForm.bbcCont' value=\"{{dataForm.bbcCont}}\"/>                                        \r\n        <input type='hidden' name='saleStatCd' ng-model='dataForm.saleStatCd' value=\"{{dataForm.saleStatCd}}\"/> -->\r\n    </form>\r\n    \r\n	<!-- imagePopUp -->\r\n	<div \r\n		ng-if=\"popOption.open\" \r\n		class='gellery-zoomPopup'>\r\n<!--		<figure>\r\n			<img			    \r\n				max-scale=\"4\"\r\n				ng-src='{{popOption.data}}'\r\n                ng-pinch-zoom\r\n				orientable\r\n				width='{{imageSize.width}}'\r\n				height='{{imageSize.height}}'								\r\n				alt=''/>\r\n			</figure>\r\n-->       \r\n		    <figure>\r\n			<img			    \r\n			    ng-class=\"{horizontal:rotateCode[popOption.index]==2,rotate180:rotateCode[popOption.index]==3,rotate90:rotateCode[popOption.index]==6,rotateM90:rotateCode[popOption.index]==8,vertical:rotateCode[popOption.index]==4,horizontalRotate90:rotateCode[popOption.index]==5,horizontalRotateM90:rotateCode[popOption.index]==7}\"\r\n				ng-src='{{popOption.data}}'\r\n				orientable\r\n				width='{{imageSize.width}}'\r\n				height='{{imageSize.height}}'								\r\n				alt=''/>\r\n			</figure>       \r\n        <div class=\"pop_head\">이미지 확대보기\r\n            <span class='close' ng-click='popOption.close()'><img src=\"http://image.lotte.com/lotte/mo2018/mall/usedmall_icon_arrow.png\"></span>\r\n            <span class=\"delete\" ng-click=\"deletePhoto2()\">삭제</span>\r\n        </div>\r\n	</div>    \r\n</section>")}]);