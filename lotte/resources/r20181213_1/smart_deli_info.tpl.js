angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/mylotte/purchase/m/smart_deli_info_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<section class="delivery_detail" ng-show="cont.delivery_info_main != undefined">\r\n		<div class="info_tbl_wrap">\r\n			<h3>기본정보</h3>\r\n			<table class="deli_tbl">\r\n				<caption>배송조회 기본정보 테이블</caption>\r\n				<tbody>\r\n					<tr>\r\n						<th scope="row">송장번호</th>\r\n						<td>{{cont.delivery_info_main.inv_no}}</td>\r\n					</tr>\r\n					<tr>\r\n						<th scope="row">택배사</th>\r\n						<td>{{cont.delivery_info_main.hdc_nm}}\r\n						    <span class="deli_tel" ng-if="cont.delivery_info_main.hdc_tel_no"><a href="tel:{{cont.delivery_info_main.hdc_tel_no}}"><i ng-class="{hp:phoneResult[0]}"></i>{{cont.delivery_info_main.hdc_tel_no}}</a></span></td>\r\n					</tr>\r\n					<tr>\r\n						<th scope="row">사업소</th>\r\n						<td>{{cont.delivery_info_main.hd_pos_nm}}\r\n                            <span class="deli_tel" ng-if="cont.delivery_info_main.enfc_phon"><a href="tel:{{cont.delivery_info_main.enfc_phon}}"><i ng-class="{hp:phoneResult[1]}"></i>{{cont.delivery_info_main.enfc_phon}}</a></span></td>\r\n					</tr>\r\n					<tr>\r\n						<th scope="row">택배기사 연락처</th>\r\n                        <td><a href="tel:{{cont.delivery_info_main.dlv_arcl_cell_no}}" ng-if="cont.delivery_info_main.dlv_arcl_cell_no"><i ng-class="{hp:phoneResult[2]}"></i>{{cont.delivery_info_main.dlv_arcl_cell_no}}</a></td>\r\n					</tr>\r\n					<tr ng-if="cont.delivery_info_main.trns_nm == null || cont.delivery_info_main.trns_nm == \'\'">\r\n						<th scope="row">받는사람</th>\r\n						<td>{{cont.delivery_info_main.rmit_nm}}</td>\r\n					</tr>\r\n					<tr ng-if="cont.delivery_info_main.trns_nm != null && cont.delivery_info_main.trns_nm != \'\'">\r\n						<th scope="row">인수자</th>\r\n						<td>{{cont.delivery_info_main.trns_nm}}</td>\r\n					</tr>\r\n				</tbody>\r\n			</table>\r\n		</div>\r\n		<div class="progress_tbl_wrap">\r\n			<h3>진행상태</h3>\r\n			<p class="pop_tit_sub" ng-if="cont.delivery_info_list.length > 0"><b>도착예정일</b>은 택배사 또는 <b>택배기사님께 문의</b> 부탁 드립니다.</p>\r\n			<table class="deli_tbl" ng-if="cont.delivery_info_list.length > 0">\r\n				<caption>배송조회 진행상태 테이블</caption>\r\n				<thead>\r\n					<tr>\r\n						<th scope="col">도착일시</th>\r\n						<th scope="col">배송상태</th>\r\n						<th scope="col">도착지</th>\r\n					</tr>\r\n				</thead>\r\n				<tbody>\r\n					<tr ng-repeat="item in cont.delivery_info_list" class="stat_line">\r\n						<td ng-bind-html="item.dlv_lv_proc_time | insertTimeBr"></td>\r\n                        <td class="state"><div class="line2limit">{{item.dlv_lv_nm}}</div></td>	\r\n						<td><div class="line2limit">{{item.hd_pos_nm}}</div>{{test()}}</td>\r\n					</tr>\r\n				</tbody>\r\n			</table>\r\n			<!-- 조회하지 못할경우 클래스 error_tbl 추가 -->\r\n			<table class="deli_tbl error_tbl"  ng-if="cont.delivery_info_list.length == 0">\r\n				<caption>배송조회 진행상태 테이블</caption>\r\n				<thead>\r\n					<tr>\r\n						<th scope="col">도착일시</th>\r\n						<th scope="col">배송상태</th>\r\n						<th scope="col">도착지</th>\r\n					</tr>\r\n				</thead>\r\n				<tbody>\r\n					<tr>\r\n						<td colspan="3">상품이 택배사에 전달되어 배송을 준비중 이거나,<br/>해당 주문에 대한 배송조회 내역이 없습니다.<br/><br/>\r\n						잠시 후 다시 확인 부탁 드립니다.<br/><br/>배송조회가 계속 되지 않는 경우에는<br/> \r\n						<a href="/custcenter/cscenter_main.do?{{baseParam}}&tclick=m_DC_footer_Clk_Lnk_5">고객센터로 문의 하시기 바랍니다.</a>\r\n				        </td>\r\n					</tr>\r\n				</tbody>\r\n			</table>\r\n		</div>\r\n	</section>    \r\n    \r\n</section>')}]);