angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mall/pet/dearpet_pet_write_container.html",'<section ng-show="contVisible" class="cont_minheight write_bg v5">\n    <div class=\'container\'>\n        <div class="head_banner" ng-if="pageData.reg_benefit">\n            <p class="p1">{{pageData.reg_benefit.title}}</p>\n            <p class="p2">{{pageData.reg_benefit.sub_title}}</p>\n        </div>\n       \n        <!-- 등록 폼 -->\n        <div\n            class=\'mgt24\'\n            ng-if="formList.length">\n            <div\n                class=\'side_add_button\'\n                onclick="angular.element( angular.element(\'.btn_add\')).trigger(\'click\')">\n            </div>\n            <dearpet-pet-write></dearpet-pet-write>\n        </div>\n        <!--// 등록 폼 -->\n    </div>\n    <touhch-blocking-loading></touhch-blocking-loading>\n</section>\n'),a.put("/lotte/resources_dev/mall/pet/dearpet_pet_write_tmpl.html","<div class='mask' test-msg=\"html 업데이트 테스트\" ng-class=\"{tcolor:test}\">  \r\n    <div\r\n        class='pet_write_forms'\r\n        hw-swipe\r\n        swipe-index=\"swpIdx\"\r\n        swipe-reset=\"swipereset\"\r\n        swipe-controller=\"swipeCtrl\"\r\n        swiepe-move=\"setMoiveFnc\"\r\n        space-x=\"15\">\r\n        <!-- 등록 폼 -->\r\n        <div\r\n            ng-repeat='form in formList'\r\n            ng-init='formInx=form'\r\n            class='form form_layer_{{formInx}}'>\r\n            <div class='box' ng-class='{active:swpIdx==$index}'>\r\n                <!-- START :: FORM -->\r\n                <form\r\n                    id=\"{{formBaseName}}{{formInx}}\"\r\n                    dataID=\"{{formInx}}\"\r\n                    ng-model='dataForm[formInx]'\r\n                    method='post'\r\n                    enctype=\"multipart/form-data\">\r\n                    <!-- hidden -->\r\n                    <input\r\n                        type='hidden'\r\n                        name='mbr_no'\r\n                        value='{{mbr_no}}'/>\r\n                    <input\r\n                        type='hidden'\r\n                        name='bbc_no'\r\n                        ng-model='dataForm[formInx].bbc_no'\r\n                        value='{{dataForm[formInx].bbc_no}}'/>\r\n                    <input\r\n                        ng-if=\"dataForm[formInx].type==30\"\r\n                        type='hidden'\r\n                        name='cate'\r\n                        ng-model='dataForm[formInx].type'\r\n                        value='{{dataForm[formInx].type}}'/>\r\n                    <!-- // hidden -->\r\n                    <ul class='rel'>\r\n                        <!-- 사진 -->\r\n                        <li class='pet_photo'>\r\n                            <div class='circle' ng-class=\"{t2:dataForm[formInx].type == '20',t3:dataForm[formInx].type == '30'}\">\r\n                                <figure\r\n                                    ng-class='{\r\n                                            horizontal:dataForm[formInx].rotateCode==2,\r\n                                            rotate180:dataForm[formInx].rotateCode==3,\r\n                                            rotate90:dataForm[formInx].rotateCode==6,\r\n                                            rotateM90:dataForm[formInx].rotateCode==8,\r\n                                            vertical:dataForm[formInx].rotateCode==4,\r\n                                            horizontalRotate90:dataForm[formInx].rotateCode==5,\r\n                                            horizontalRotateM90:dataForm[formInx].rotateCode==7\r\n                                        }'\r\n                                    style='{{dataForm[formInx].photo?\"background:url(\"+dataForm[formInx].photo+\") no-repeat center center; background-size:auto 100%\":\"\"}}'>\r\n                                </figure>\r\n                                <i class='i_camea'></i>\r\n                                <input\r\n                                    ng-if=\"AccessUpload\"\r\n                                    type='file'\r\n                                    gi={{formInx}}\r\n                                    name=\"file\"\r\n                                    id=\"file_{{formInx}}\"\r\n                                    onchange='angular.element(this).scope().photoPreview(this)'\r\n                                    accept=\"image/jpeg\"/>\r\n                                <div ng-click='userVersionCheck()' class='appDownload' ng-if=\"!AccessUpload\"></div>\r\n                            </div>\r\n                        </li>\r\n                        <!-- 이름 -->\r\n                        <li class='inp_name essential'>\r\n                            <input\r\n                                type='text'\r\n                                class='name full'\r\n                                name='name'\r\n                                maxlength=\"10\"\r\n                                ng-keydown=\"updateTotal($event)\"\r\n                                ng-keyup=\"updateTotal($event)\"\r\n                                ng-model='dataForm[formInx].name'\r\n                                placeholder='우리 아이 이름을 입력해주세요.'/>\r\n                        </li>\r\n                        <!-- 종류 -->\r\n                        <li class='type clear input essential'>\r\n                            <table width='100%' border=0 cellpadding=0 cellspacing=0 summary=''>\r\n                                <colgroup>\r\n                                    <col width='33.3%'>\r\n                                    <col width='33.3%'>\r\n                                    <col width='33.3%'>\r\n                                </colgroup>\r\n                                <tbody>\r\n                                    <tr>\r\n                                        <td  ng-repeat='type in formOptions.type'>\r\n                                        <label\r\n                                            for=\"pet_type_{{formInx}}_{{$index}}\"\r\n                                            ng-click='typeis(formInx, type.cd)'\r\n                                            ng-class='{active:dataForm[formInx].type==type.cd}'>\r\n                                            <text>{{type.cd_nm}}</text>\r\n                                            <em class='outline'></em>\r\n                                        </label>\r\n                                        <input\r\n                                            type='radio'\r\n                                            name='type'\r\n                                            id='pet_type_{{formInx}}_{{$index}}'\r\n                                            ng-model='dataForm[formInx].type'\r\n                                            value='{{type.cd}}'/>\r\n                                        </td>\r\n                                    </tr>\r\n                                </tbody>\r\n                            </table>\r\n                        </li>\r\n                        <!-- 사이즈  소동물 cd:30 예외처리 ( 코드가 변경되면 수정 변경 해줘야함 ) -->\r\n                        <li\r\n                            class='size input clear essential'\r\n                            ng-if=\"dataForm[formInx].type&&formOptions.size[dataForm[formInx].type].length\">\r\n                            <table width='100%' border=0 cellpadding=0 cellspacing=0 summary=''>\r\n                                <colgroup>\r\n                                    <col width='33.3%'>\r\n                                    <col width='33.3%'>\r\n                                    <col width='33.3%'>\r\n                                </colgroup>\r\n                                <tbody>\r\n                                    <tr\r\n                                        ng-repeat='group in dataForm[formInx].cateList'\r\n                                        ng-init='groupIdx=$index'>\r\n                                        <td\r\n                                            ng-repeat='size in group'\r\n                                            colspan='{{$index==(group.length-1)?(3-(group.length-1)):0}}'>\r\n                                            <label\r\n                                                for='size_{{formInx}}_{{groupIdx+3*$index}}'\r\n                                                ng-click='setSize()'\r\n                                                ng-class='{active:dataForm[formInx].size==size.cd}'>\r\n                                                <text>{{size.cd_nm}}</text>\r\n                                                <em class='outline col{{(3-(group.length-1))}}'></em>\r\n                                            </label>\r\n                                            <input\r\n                                                type='radio'\r\n                                                name='size'\r\n                                                id='size_{{formInx}}_{{groupIdx+3*$index}}'\r\n                                                ng-model='dataForm[formInx].size'\r\n                                                value='{{size.cd}}'/>\r\n                                        </td>\r\n                                    </tr>\r\n                                </tbody>\r\n                            </table>\r\n                        </li>\r\n                        <!-- 생일 -->\r\n                        <li class='birthday table essential' ng-if='formOptions.checkList[ dataForm[formInx].type ].length'>\r\n                            <span ng-class='{hidenText:dataForm[formInx].birthday}'>\r\n                                <em ng-class='{none:!dateArrow}'></em>\r\n                                <input\r\n                                    type='date'\r\n                                    class='name full'\r\n                                    ng-class='{transparent:!dataForm[formInx].birthday}'\r\n                                    ng-model='dataForm[formInx].birthday'\r\n                                    id=\"date_{{formInx}}\"\r\n                                    />\r\n                                <input\r\n                                    type='hidden'\r\n                                    class='name full'\r\n                                    name='birthday'/>\r\n                            </span>\r\n                        </li>\r\n                        <!-- 생일 소동물 cd:30 예외처리 ( 코드가 변경되면 수정 변경 해줘야함 )-->\r\n                        <li\r\n                            class='birthday table essential'\r\n                            ng-if='dataForm[formInx].type&&!formOptions.checkList[ dataForm[formInx].type ].length'>\r\n                            <span ng-class='{hidenText:dataForm[formInx].birthday}'>\r\n                                <em ng-class='{none:!dateArrow}'></em>\r\n                                <input\r\n                                    type='date'\r\n                                    class='name full'\r\n                                    ng-class='{transparent:!dataForm[formInx].birthday}'\r\n                                    ng-model='dataForm[formInx].birthday'\r\n                                    id=\"date_{{formInx}}\"/>\r\n                                <input\r\n                                    type='hidden'\r\n                                    class='name full'\r\n                                    name='birthday'/>\r\n                            </span>\r\n                        </li>\r\n                        \r\n                        <!-- 성별 -->\r\n                        <li class='gender clear input essential'>\r\n                            <table width='100%' border=0 cellpadding=0 cellspacing=0 summary=''>\r\n                                <colgroup>\r\n                                    <col width='50%'>\r\n                                    <col width='50%'>\r\n                                </colgroup>\r\n                                <tbody>\r\n                                    <tr>\r\n                                        <td ng-repeat='gender in formOptions.gender'>\r\n                                            <label\r\n                                                for='gender_{{formInx}}_{{$index}}'\r\n                                                ng-class='{active:dataForm[formInx].gender==gender.cd}'>\r\n                                                <text>{{gender.cd_nm}}</text>\r\n                                                <em class='outline'></em>\r\n                                            </label>\r\n                                            <input\r\n                                                type='radio'\r\n                                                name='gender'\r\n                                                id='gender_{{formInx}}_{{$index}}'\r\n                                                ng-model='dataForm[formInx].gender'\r\n                                                value='{{gender.cd}}'/>\r\n                                        </td>\r\n                                    </tr>\r\n                                </tbody>\r\n                            </table>\r\n                        </li>\r\n                        <!-- 고민 체크 리스트 -->\r\n                        <li\r\n                            class='input checklist'\r\n                            ng-if=\"dataForm[formInx].type&&formOptions.checkList[ dataForm[formInx].type ].length\">\r\n                            <h3>우리 아이 고민들은?</h3>\r\n                            <table width='100%' cellpadding=0 cellspacing=0 summary=''>\r\n                                <caption>고민체크리스트</caption>\r\n                                <colgroup>\r\n                                    <col=\"33.3%\">\r\n                                    <col=\"33.3%\">\r\n                                    <col=\"33.3%\">\r\n                                </colgroup>\r\n                                <tbody>\r\n                                    <tr ng-repeat='group in dataForm[formInx].worryList' ng-init='groupIdx=$index'>\r\n                                        <td\r\n                                            class='w33'\r\n                                            ng-repeat='item in group'\r\n                                            ng-class='{active:dataForm[formInx].checklist[groupIdx*3+$index].cd==item.cd&&item.cd}'\r\n                                            colspan='{{$index==(group.length-1)?(3-(group.length-1)):0}}'>\r\n                                            <label\r\n                                                for='chkList{{formInx}}_{{groupIdx*3+$index}}'\r\n                                                ng-click='setWorry(item, formInx, groupIdx*3+$index)'>\r\n                                                {{item.cd_nm}}\r\n                                                <em ng-if=\"item.cd_nm\" class='outline col{{(3-(group.length-1))}}'></em>\r\n                                            </label>\r\n                                            <em ng-if=\"!item.cd_nm\" class='outline not'></em>\r\n                                            <input\r\n                                                type='checkbox'\r\n                                                name='worry[]'\r\n                                                ng-checked=\"{{dataForm[formInx].checklist[groupIdx*3+$index].cd?true:false}}\"\r\n                                                id='chkList{{formInx}}_{{groupIdx*3+$index}}'\r\n                                                value='{{item.cd}}'/>\r\n                                        </td>\r\n                                    </tr>\r\n                                </tbody>\r\n                            </table>\r\n                        </li>\r\n                    </ul>\r\n                    <div class=\"temp_h\" ng-if=\"dataForm[formInx].type == '30'\"></div>\r\n                    <!--펫 푸드 정보 등록하기 -->\r\n                    <div class=\"pet_info\" ng-if=\"dataForm[formInx].type == '10' || dataForm[formInx].type == '20'\">\r\n                        <div class=\"title\" ng-show=\"!dataForm[formInx].info_open\" ng-click=\"dataForm[formInx].info_open = true;swiper_set()\">펫 푸드 정보 등록하기\r\n                            <img ng-src=\"http://image.lotte.com/lotte/mo2018/mall/ic-over.png\">\r\n                        </div>\r\n                        <div ng-show=\"dataForm[formInx].info_open\">\r\n                            <div class=\"title nb\" ng-click=\"dataForm[formInx].info_open = false;swiper_set(true)\">펫 푸드 정보 등록하기\r\n                                <img ng-src=\"http://image.lotte.com/lotte/mo2018/mall/ic-x-folding.png\">\r\n                            </div>\r\n                            <div class=\"select_box\">\r\n                                <select class=\"info_select\" id=\"brd_{{formInx}}\" ng-model=\"dataForm[formInx].opt_brand\">  <!--ng-changed=\"brand_change(formInx)\"                                  -->\r\n                                    <option ng-if=\"!dataForm[formInx].opt_brand\" value=\"\">자주 구매 브랜드를 선택하세요</option>\r\n                                    <option ng-if=\"dataForm[formInx].type == '10'\" ng-repeat=\"opt in pageData.pet_food_info.pur_brand.dog.items\" value=\"{{opt.cd}}\" ng-selected=\"dataForm[formInx].opt_brand == opt.cd\">{{opt.cd_nm}}</option>\r\n                                    <option ng-if=\"dataForm[formInx].type == '20'\" ng-repeat=\"opt in pageData.pet_food_info.pur_brand.cat.items\" value=\"{{opt.cd}}\" ng-selected=\"dataForm[formInx].opt_brand == opt.cd\">{{opt.cd_nm}}</option>\r\n                                </select>    \r\n                                \r\n                            </div>                           \r\n                            <div>\r\n                                <p class=\"s_title\">용량</p>\r\n                                <div class=\"info_table\">\r\n                                    <div class=\"info_cell\" ng-repeat='type in pageData.pet_food_info.pur_opt_val.items' ng-bind-html=\"type.cd_nm | replacetag\" ng-click='optis(formInx, type.cd)' ng-class='{active:dataForm[formInx].opt==type.cd,                                        \r\n                                     left:$index == 1 && dataForm[formInx].opt == pageData.pet_food_info.pur_opt_val.items[0].cd,\r\n                                     right:$index == 1 && dataForm[formInx].opt == pageData.pet_food_info.pur_opt_val.items[2].cd}'></div>\r\n                                </div>\r\n                                <p class=\"s_title\">구매주기</p>\r\n                                <div class=\"info_table\">\r\n                                    <div class=\"info_cell sh\" ng-repeat='type in pageData.pet_food_info.pur_cycle.items' ng-bind-html=\"type.cd_nm | replacetag\" ng-click='cycleis(formInx, type.cd)' ng-class='{active:dataForm[formInx].cycle==type.cd,\r\n                                     left:$index == 1 && dataForm[formInx].cycle == pageData.pet_food_info.pur_cycle.items[0].cd,\r\n                                     right:$index == 1 && dataForm[formInx].cycle == pageData.pet_food_info.pur_cycle.items[2].cd}'></div>\r\n                                </div>\r\n                            </div>                            \r\n                        </div>\r\n                    </div>\r\n                    \r\n                    <div class='active_state table per100'>\r\n                        <span class='cell pet_active_checkbox' ng-class='{active:dataForm[formInx].active}'>\r\n                            <label for='active_{{formInx}}' ng-click='activeChange(formInx)'><em>이 아이로 활동하기</em></label>\r\n                            <input\r\n                                type='checkbox'\r\n                                name=''\r\n                                id='active_{{formInx}}'\r\n                                ng-model='dataForm[formInx].active'/>\r\n                            <input\r\n                                type='hidden'\r\n                                name='active'/>\r\n                        </span>\r\n                        <span ng-click='formDelete(formInx, $index )' class='cell btn_delete'>\r\n                            <img ng-src='http://image.lotte.com/lotte/mo2018/mall/ic-delete.png' alt=''/>\r\n                        </span>\r\n                    </div>\r\n                    <input\r\n                        type='hidden'\r\n                        name='rotateCode'\r\n                        ng-model='dataForm[formInx].rotateCode'\r\n                        value='{{dataForm[formInx].rotateCode}}'/>\r\n                </form>\r\n                <!-- END :: FORM -->\r\n            </div>\r\n        </div>        \r\n    </div>\r\n    <!-- 등록 폼 -->\r\n    <div class='pet_form_indicator'>\r\n        <span ng-repeat='bnt in formList' ng-class='{active:swpIdx==$index}'>{{$index}}</span>\r\n    </div>\r\n    <div class='pet_foot'>\r\n        <div class='btn_submit' ng-click='submit()'>저장하기</div>\r\n        <div class='btn_add' ng-click='formADD()'><img ng-src=\"http://image.lotte.com/lotte/mo2018/mall/ic-pet-plus.png\">우리아이 추가하기</div>\r\n        \r\n    </div>\r\n"+'    <div style="position:absolute;top:0px;left:10px;color:#fff" ng-if="test">\r\n        -- test 2018.09.04 0001 --\r\n    </div>\r\n</div>\r\n')}]);