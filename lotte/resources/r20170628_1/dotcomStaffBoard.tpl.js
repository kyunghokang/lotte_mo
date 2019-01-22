angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/custcenter/dotcomStaffBoard_container.html",'<div class="dotcomStaffBoard">\n	<div id="mbbs">\n		<img src="http://image.lotte.com/lotte/mobile/common/mbbs_topBann_renewal.png" alt="다고쳐! 모바일은 롯데닷컴 직원 전용 오류 신고 게시판입니다.">\n		<form class="ng-pristine ng-valid">\n			<div class="formBox">\n				<textarea class="bbs_text" cols="0" rows="0" name="rcvmessage" id="bbsmessage" ng-model="pageOptions.bbsmessage" placeholder=\'롯데닷컴 모바일의 오류 및 개선 사항을 입력해주세요.\'></textarea>\n				<a id="bbs_ok" ng-click="staffBoardWrite()">등록</a>\n			</div>\n		</form>\n		<div class="bbsList">\n			<div class="bbsDetail" ng-repeat="item in screenData.boardList">\n				<div class="ba">{{screenData.totalCnt - $index}}</div>\n				<div class="bb">\n					<div>{{item.bbcFcont}}</div>\n					<div>\n						<span ng-if="item.deptNm != undefined" class="dept_name">{{item.deptNm}}</span>{{item.mbrNm}}&nbsp;&nbsp;{{item.sysRegDtime}}\n\n						<div class="btn_wrap">\n							<button ng-if="item.mbrNo == loginInfo.mbrNo" ng-click="deleteContent(item)" class="btn_del">삭제하기</button>\n						</div>\n					</div>\n				</div>\n				<div class="subbbs" ng-repeat="ritem in item.eventBoardSubList">\n					<img src="http://image.lotte.com/lotte/mobile/common/fixmobile_btn_reply_0617.png" class="rep">\n					{{ritem.bbcFcont}}\n					<div class="writer">\n						<span ng-if="ritem.deptNm != undefined" class="dept_name">{{ritem.deptNm}}</span>&nbsp;&nbsp;{{ritem.sysRegDtime}}\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n	<div class="btn_more" ng-show="screenData.boardList.length != screenData.totalCnt">\n		<p ng-click="moreContentShow()">    \n			<span>더보기 +</span>\n		</p>    \n	</div>\n</div>')}]);