angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/event/m/kids/experience_winner_list_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n	<section class="pageLoading" ng-show="pageLoading"><p class="loading half"></p></section>\r\n	<section ng-show="!pageLoading">\r\n		<section id="container" class="winner_wrap">\r\n			<section class="event_info">\r\n				<h3>당첨을 축하드립니다!</h3>\r\n				<ul class="event_list end_event">\r\n				    <li>\r\n				    	<div class="ex_info_wrap">					    \r\n						    <div class="img_area">\r\n						    	<div class="img_wrap"><img ng-src="{{EventInfo.img_url}}" alt="{{EventInfo.evt_nm}}"></div>\r\n						    </div>\r\n						    <div class="txt_wrap">\r\n							    <div class="title" ng-bind-html="EventInfo.evt_nm"></div>\r\n						    </div>\r\n						</div>  \r\n						<div class="ex_info_list">	\r\n						    <ul>\r\n								<li>모집기간 : {{EventInfo.evt_strt_dtime}} ~ {{EventInfo.evt_end_dtime}}	</li>\r\n								<li>당첨발표 : {{EventInfo.winner_dtime}}</li>\r\n							</ul>	\r\n					    </div>  \r\n				    </li>\r\n				</ul>  \r\n			</section>\r\n			<section class="winner_notice">\r\n				 <div ng-bind-html="EventInfo.info_cont | toTrustedHtml"></div>\r\n			</section>\r\n			<section class="winner_info">\r\n				<h3>당첨자</h3>\r\n				<div class="winner_list">\r\n					<table summary="적립대기 포인트가 나와있는 표">\r\n						<caption>L.POINT 적립/사용 내역 상세 테이블</caption>\r\n						<colgroup>\r\n							<col width="35%">\r\n							<col width="65%">\r\n						</colgroup>\r\n						<thead>\r\n							<tr>\r\n								<th class="name"><span>이름</span></th>\r\n								<th><span>아이디</span></th>\r\n							</tr>\r\n						</thead>\r\n						<tbody>\r\n							<tr ng-repeat="items in WinnerList">\r\n								<td>{{items.mbr_nm}}</td>\r\n						    	<td>{{items.login_id}}</td> \r\n					    	</tr>\r\n						</tbody>\r\n					</table>\r\n				</div>	\r\n			</section>\r\n		</section>	\r\n	</section>	\r\n</section>')}]);