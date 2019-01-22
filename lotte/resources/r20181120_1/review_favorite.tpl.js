angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/review_favorite_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n\r\n	<section class="fav_wrap">\r\n		\r\n		<div class="head_wrap">\r\n			<select ng-show="pageUI.mode == 0" ng-model="pageUI.sort" ng-change="loadData(\'소팅\')">\r\n			   <option value="D">최근 즐겨찾은순</option>\r\n			   <option value="N">가나다순</option>\r\n			</select>\r\n			<a ng-if="pageUI.mode == 0" ng-click="editFavorite()" class="btn">편집</a>\r\n			<a ng-if="pageUI.mode == 1" ng-click="delFavorite()" class="btn btn_delete">삭제</a>\r\n			<a ng-if="pageUI.mode == 1" ng-click="clearFavorite()" class="btn btn_cancel">취소</a>\r\n		</div>\r\n		\r\n		<div ng-if="pageUI.loadData.reviewerList && pageUI.loadData.reviewerList.items && pageUI.loadData.reviewerList.items.length" class="list_wrap">\r\n			<ul ng-show="pageUI.mode == 0" class="readonly">\r\n				<li ng-repeat="item in pageUI.loadData.reviewerList.items" ng-class="{checked :item.checked}">\r\n					<a class="item_wrap" ng-click="goReviewerHome(item, $index + 1)">\r\n						<span ng-if="item.reviewerImgUrl" class="image" ng-style="{\'background\' : \'url(\' + item.reviewerImgUrl + \') center center no-repeat\', \'background-size\': \'cover\'}"></span>\r\n						<span ng-if="!item.reviewerImgUrl" class="image default"></span>\r\n						<img ng-src="{{item.reviewerImgUrl}}" on-error-src2 cur-index="{{$index + 1}}" style="display:none" />\r\n						<div class="desc_wrap" ng-class="{noflag: !item.reviewerFlag && !item.catReviewerFlag}">\r\n							<span ng-if="item.reviewerFlag || item.catReviewerFlag" class="flag_wrap">\r\n								<span ng-if="item.reviewerFlag" class="flag">TOP{{item.reviewerFlag}}</span>\r\n								<span ng-if="item.catReviewerFlag" class="flag category">{{item.catReviewerFlag}}</span>\r\n							</span>\r\n							<span ng-if="item.reviewerNickname" class="name">{{item.reviewerNickname}}</span>\r\n						</div>\r\n					</a>\r\n				</li>\r\n			</ul>\r\n			\r\n			<ul ng-show="pageUI.mode == 1">\r\n				<li ng-repeat="item in pageUI.loadData.reviewerList.items" ng-class="{checked :item.checked}">\r\n					<label class="item_wrap" for="cb{{$index}}">\r\n						<input type="checkbox" id="cb{{$index}}" ng-model="item.checked" ng-change="">\r\n						<span ng-if="item.reviewerImgUrl" class="image" ng-style="{\'background\' : \'url(\' + item.reviewerImgUrl + \') center center no-repeat\', \'background-size\': \'cover\'}"></span>\r\n						<span ng-if="!item.reviewerImgUrl" class="image default"></span>\r\n						<div class="desc_wrap" ng-class="{noflag: !item.reviewerFlag && !item.catReviewerFlag}">\r\n							<span ng-if="item.reviewerFlag || item.catReviewerFlag" class="flag_wrap">\r\n								<span ng-if="item.reviewerFlag" class="flag">TOP{{item.reviewerFlag}}</span>\r\n								<span ng-if="item.catReviewerFlag" class="flag category">{{item.catReviewerFlag}}</span>\r\n							</span>\r\n							<span ng-if="item.reviewerNickname" class="name">{{item.reviewerNickname}}</span>\r\n						</div>\r\n					</label>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</section>\r\n\r\n	<!--공통 로딩커버-->\r\n	<div class="loading_cover" ng-if="jsonLoading">\r\n		<div class="loading"></div>\r\n	</div>\r\n</section>')}]);