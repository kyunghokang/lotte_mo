angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/custcenter/m/answer_container.html",'<section class="cscenter_main">\r\n	<div class="cnt_info" ng-if="answerListCount">총 문의 <span>{{totalRows}}</span> 답변완료 <span>{{endRows}}</span> 답변대기 <span>{{receiveRows}}</span> </div>\r\n    <div class="list" ng-class="{empty: !answerListCount}">\r\n        <ol class="qna" ng-if="answerListCount">\r\n			<li ng-repeat="item in answerList track by $index">\r\n                <a ng-click="goQnaDetail(item.ccn_no)" >\r\n                <p class="thumb" ng-if="item.img_url"><img ng-src="{{item.img_url}}" alt="" /></p>\r\n                <p class="title" ng-class="{no:!item.img_url}">\r\n                    <span class="name elli" ng-bind-html="item.goods_nm"></span>\r\n					<span class="txt elli" ng-bind="item.inq_ans_cont"></span>\r\n                    <span class="date elli" ng-bind="item.inq_mk_dtime"></span>\r\n                </p>\r\n                <p class="state">\r\n                    <span ng-show="item.ccn_prgs_stat_cd == \'01\'" class="a01">답변대기</span>\r\n                    <span ng-show="item.ccn_prgs_stat_cd == \'02\'" class="a02">답변보기</span>\r\n                    <span ng-show="item.ccn_prgs_stat_cd == \'11\'" class="a01">답변준비중</span>\r\n                </p>\r\n                </a>\r\n            </li>\r\n        </ol>\r\n        <p class="noti_txt01" ng-if="!answerListCount"></p>\r\n    </div>\r\n    \r\n	<div class="one_to_one list_no" ng-if="completeGetAnswerList && !answerListCount">\r\n		<div><i></i>문의하신 내역이 없습니다.</div>\r\n	</div>\r\n    \r\n    <div class="list">\r\n        <div class="list_more" ng-if="answerListCount < totalRows">\r\n        	<a href="#" ng-click="getAnswerList()"><strong>더보기</strong> (<span>{{answerListCount}}/{{totalRows}}</span>)</a>\r\n        </div>\r\n        <p class="noti_txt01">답변이 등록되면 회원정보에 등록된 <span>이메일과 휴대폰</span>으로 안내됩니다.</p>\r\n    </div>\r\n</section>')}]);