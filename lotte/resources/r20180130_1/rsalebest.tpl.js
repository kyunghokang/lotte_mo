angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/rsalebest/rsalebest_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n  \r\n       <div class="testBox" ng-show="testMode">\r\n            <input type="text" ng-model="lateAction2" class="inputType" >\r\n            <input type="button" ng-click="func_SaleBestData2()" value="로드" class="buttonType">           \r\n       </div>\r\n        <!-- 남들은 뭘 샀지 \r\n        <div class="peopleBuy" ng-if="SaleBestData.buybest.items.length > 0">\r\n            <h3>남들은 <strong>뭘 샀지?</strong></h3>\r\n            <div class="swipe3type">\r\n                <div>\r\n                    <ul  style="white-space:normal">\r\n                        <li ng-repeat="item in SaleBestData.buybest.items" >\r\n                            <a href="/product/m/product_view.do?goods_no={{item.goods_no}}&{{baseParam}}&curDispNoSctCd=82&tclick=m_DC_ProdDetail_Swp_Rel_B{{$index + 1}}">\r\n                                <span class="imgWrap">\r\n                                    <img ng-src="{{item.img_url}}" alt="" />\r\n                                </span>\r\n                                <span class="sPrdTit"> {{item.goods_nm}}</span>\r\n                                <span class="sPrice"><strong>{{Fnproductview.getNumberFormat(item.sale_prc - item.inst_cpn_aply_unit_price - item.immed_pay_dscnt_amt)}}</strong>원</span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        -->\r\n        <!-- 남들은 뭘 봤지 -->\r\n        <div class="peopleView" ng-if="SaleBestData.relation.items.length > 0">\r\n            <h3>남들은 <strong>뭘 봤지?</strong></h3>\r\n            <div>\r\n                <div>\r\n                    <ul class="prod_list_01">\r\n                        <li ng-repeat="item in SaleBestData.relation.items">\r\n                            <div class="unit_list_01">\r\n                                <a href="/product/m/product_view.do?goods_no={{item.goods_no}}&{{baseParam}}&curDispNoSctCd=82&tclick=m_DC_ProdDetail_Swp_Rel_C{{$index + 1}}&_reco=M_detail">\r\n                                    <div class="thumb">\r\n                                        <img ng-src="{{item.img_url}}">\r\n                                    </div>\r\n                                    <div class="info">\r\n                                        <p class="tit">\r\n                                            <span ng-bind-html="item.goods_nm">[까르뜨블랑슈남성] 심플 노턱 본딩 겨울용 바지 (239C1381-39,78,87)</span>\r\n                                        </p>\r\n                                        <p class="pr_box">\r\n                                            <span class="price"><em>{{item.sale_prc - item.inst_cpn_aply_unit_price - item.immed_pay_dscnt_amt | number}}</em>원</span>\r\n                                        </p>\r\n                                    </div>\r\n                                </a>\r\n                            </div>                          \r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n        </div>      \r\n</section>')}]);