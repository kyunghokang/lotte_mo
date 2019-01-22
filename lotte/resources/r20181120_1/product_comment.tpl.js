angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/sub/product_sub_header.html",'<div class="sub_page_header">\n	<button class="btn_prev" ng-click="gotoPrepage()">이전</button>\n	<h2>{{productSubTitle}}</h2>\n</div>'),a.put("/lotte/resources_dev/product/m/sub/product_comment_container.html",'<section ng-show="contVisible" class="cont_minheight"> <!--상품상세 서브페이지: 전체 상품평 보기-->\r\n	<product-sub-header></product-sub-header>\r\n	\r\n	<!--상품 상세 서브 page 기본 wrapper(한번만 사용할 것): prod_detail_page_wrap-->\r\n	<div class="prod_detail_page_wrap p_comment_all">\r\n\r\n		<!--전체상품평-->\r\n		<div class="detail_base_wrap prod_comment summary">\r\n\r\n			<!-- 전체상품평 : 별점, 열기/접기 -->\r\n			<!-- <p class="detail_tit fold_tap">\r\n				<span class="total_review">{{pageUI.loadData.stat.topCnt | currency:\'\':0}} 개의 상품평이 있습니다.</span>\r\n				<span class="starScoreWrap big"><span class="starScoreCnt" style="width:{{pageUI.loadData.stat.topScr|starScorePolicy:100}}%"></span></span> <em>(<var>{{pageUI.loadData.stat.topCnt | currency:\'\':0}}</var>)</em>\r\n			</p> -->\r\n			\r\n			<p class="detail_tit">\r\n				{{pageUI.loadData.totalCnt | currency:\'\':0}} 개의 상품평이 있습니다.\r\n			</p>\r\n			\r\n			<div ng-class="{hasComment:pageUI.loadData.reviewList}">\r\n				\r\n				<!-- 별점 영역 -->\r\n				<div class="star_wrap">\r\n					<span class="starScoreWrap big"><span class="starScoreCnt" style="width:{{!pageUI.loadData.avgScore?0:pageUI.loadData.avgScore|starScorePolicy:100}}%"></span></span>\r\n					<span class="score"><em>{{pageUI.loadData.avgScore}}</em>/5</span>\r\n				</div>\r\n				\r\n				<!-- 선택상품평 영역 -->\r\n				<div ng-if="pageUI.loadData.reviewList" class="review_wrap">\r\n					<dl ng-repeat="item in pageUI.loadData.reviewList">\r\n						<dt>{{item.gdas_item_nm}}</dt>\r\n						<dd>{{item.gdas_choc_item_nm}}<em>{{item.gdas_choc_item_choc_rt}}%</em></dd>\r\n					</dl>\r\n				</div>\r\n			</div>\r\n			<a ng-if="pageUI.loadData.stat || pageUI.loadData.reviewDetail" class="fold_btn shape_triangle" ng-class="{up:!pageUI.starScoreOpen,down:pageUI.starScoreOpen}" ng-click="toggleDetail()">자세히</a><!--상태변화 클래스: up -> down-->\r\n		</div>\r\n		\r\n		<!-- 전체상품평 : 자세히 -->\r\n		<div class="detail_base_wrap prod_comment comment_all detail" ng-if="pageUI.loadData.stat || pageUI.loadData.reviewDetail" ng-show="pageUI.starScoreOpen">\r\n			\r\n            <div ng-if="pageUI.loadData.stat" class="star_rating">\r\n            	<ul>\r\n            		<li>\r\n            			<span class="starScoreWrap"><span class="starScoreCnt" style="width:100%"></span></span>\r\n                		<span class="person">{{pageUI.loadData.stat.scr5Cnt}} 명</span>\r\n            		</li>\r\n            		<li>\r\n            			<span class="starScoreWrap"><span class="starScoreCnt" style="width:80%"></span></span>\r\n                		<span class="person">{{pageUI.loadData.stat.scr4Cnt}} 명</span>\r\n            		</li>\r\n            		<li>\r\n            			<span class="starScoreWrap"><span class="starScoreCnt" style="width:60%"></span></span>\r\n                		<span class="person">{{pageUI.loadData.stat.scr3Cnt}} 명</span>\r\n            		</li>\r\n            		<li>\r\n            			<span class="starScoreWrap"><span class="starScoreCnt" style="width:40%"></span></span>\r\n                		<span class="person">{{pageUI.loadData.stat.scr2Cnt}} 명</span>\r\n            		</li>\r\n            		<li>\r\n            			<span class="starScoreWrap"><span class="starScoreCnt" style="width:20%"></span></span>\r\n                		<span class="person">{{pageUI.loadData.stat.scr1Cnt}} 명</span>\r\n            		</li>\r\n            	</ul>\r\n                \r\n            </div>\r\n            <div ng-if="pageUI.loadData.reviewDetail" class="review_list_wrap">\r\n            	<ul>\r\n            		<li class="review_list" ng-repeat="(key, value) in pageUI.loadData.reviewDetail">\r\n            			<span class="title">{{value.title}}</span>\r\n            			<dl class="score_list" ng-repeat="obj in value.list" ng-class="{on:$index === 0}">\r\n							<dt>\r\n								{{obj.gdas_choc_item_nm}}\r\n							</dt>\r\n							<dd>\r\n								<span class="barScoreWrap"><span class="barScoreCnt" style="width:{{obj.gdas_choc_item_choc_rt}}%"></span></span><span class="percent">{{obj.gdas_choc_item_choc_rt}}%</span>\r\n							</dd>\r\n						</dl>\r\n            		</li>\r\n            	</ul>\r\n			</div>\r\n		</div>\r\n		\r\n		<!-- 전체상품평 : 비노출 상품 -->\r\n		<div ng-if="pageUI.loadData.dispNtcTxt" class="detail_base_wrap prod_comment nodisp">\r\n			<p class="noti_disc">{{pageUI.loadData.dispNtcTxt}}</p>\r\n		</div>\r\n		\r\n		<!-- 전체상품평 : 고객 등록 사진 -->\r\n		<div class="detail_base_wrap prod_comment comment_all div_line_b10 div_line_t line_full_w" ng-if="!pageUI.loadData.dispNtcTxt && pageUI.loadData.photoList.items.length > 0">\r\n			<p class="detail_tit sub_tit no_pb">고객 등록 사진/영상</p>\r\n			<!--썸네일 이미지-->\r\n			<div class="thumb_list_wrap">\r\n				<ul class="thumb_list">\r\n					<li ng-repeat="n in [].constructor(5) track by $index"\r\n						ng-class="{play_btn:pageUI.loadData.photoList.items[$index].videoYn, \'dim_cont dim50\':pageUI.loadData.photoList.items[$index] && $index == 4 && pageUI.loadData.photoMoreCnt > 0}"\r\n						ng-click="pageUI.loadData.photoList.items[$index] && linkThumbClick(pageUI.loadData.photoList.items[$index].contsUrl, \'m_RDC_ProdDetail_Clk_Rvw02_photo\', $index === 4, $index)">\r\n						<span class="thumb cover" ng-if="pageUI.loadData.photoList.items[$index]"><img ng-src="{{pageUI.loadData.photoList.items[$index].imgUrl}}" alt="" /></span>\r\n						<span class="more_cnt verti_align" ng-if="pageUI.loadData.photoList.items[$index] && $index == 4 && pageUI.loadData.photoMoreCnt > 0">+<var>{{pageUI.loadData.photoMoreCnt}}</var></span>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n\r\n		<!-- 전체상품평 : 상품평 리스트 -->\r\n		<div class="detail_base_wrap prod_comment comment_all">\r\n			\r\n			<!-- 전체상품평 : 필터 -->\r\n			<div class="filter_wrap" ng-click="showHideFilterSlider(\'m_RDC_ProdDetail_allRvw_Clk_Flt\')">\r\n				<p class="filter_info"><span>{{pageUI.filterOption.filter1Names[pageUI.filterOption.filter1SelVal]}}</span></p>\r\n\r\n				<!-- 전체상품평 : 필터 아이콘 -->\r\n				<span class="filter" ng-class="{on:pageUI.filterOption.filter1SelVal > 0 || pageUI.filterOption.filter2SelVal < 6}">필터</span> <!--상태변화 클래스 on: 필터 적용-->\r\n			</div>\r\n\r\n			<ul class="cmt_list">\r\n				<li ng-repeat="item in pageUI.loadData.critList.items" ng-init="$pindex = $index" ng-class="{\'div_line_t\':$index == 0, div_line_b:$index < pageUI.loadData.critList.items.length-1}">\r\n					<!-- 상품평 : 작성자 -->\r\n					<a ng-click="goReviewerHome(item)" class="cmt_writer">\r\n						<span class="image" ng-style="{\'background\': \'url(\' + ( item.reviewerImgUrl ? item.reviewerImgUrl : dummyUrl ) + \') center center / cover no-repeat\'}"></span>\r\n						<img ng-src="{{item.reviewerImgUrl}}" on-error-src2 cur-index="{{$index + 1}}" style="display:none" />\r\n						<em ng-if="item.gdasTpNm && item.gdasTpNm.indexOf(\'선물\') >= 0">{{item.reviewerNickname}}님의 {{item.gdasTpNm}}상품평</em>\r\n						<em ng-if="!item.gdasTpNm || item.gdasTpNm.indexOf(\'선물\') < 0">{{item.reviewerNickname}}</em>\r\n						<span class="div_line_v_s" ng-if="item.wrtrTpNm">{{item.wrtrTpNm}}</span>\r\n						<span ng-if="item.catReviewerFlag" class="flag category">{{item.catReviewerFlag}}</span>\r\n						<span ng-if="item.reviewerFlag" class="flag top100">TOP{{item.reviewerFlag}}</span>\r\n					</a>\r\n					\r\n					<div class="item_top">\r\n						<!-- 상품평리스트 : 별점 -->\r\n						<span class="starScoreWrap"><span class="starScoreCnt" style="width:{{item.critPnt|starScorePolicy:100}}%"></span></span>\r\n						\r\n						<!-- 상품평리스트 : 등록일 -->\r\n						<span class="date">{{item.regDate}}</span>\r\n					</div>\r\n					\r\n					<!-- 상품평 : 사진, 동영상 썸네일 -->\r\n					<div class="review_photo_wrap" ng-style="{\'min-height\':item.photoList.items.length > 0 ? \'70px\': \'\'}">\r\n						<a ng-class="{play_btn:item.photoList.items[0].videoYn}" ng-if="!pageUI.loadData.dispNtcTxt && (item.critTpCd == \'P\' || item.critTpCd == \'V\') && item.photoList.items[0]"\r\n							ng-click="item.photoList.items[0] && showReviewOne(item.photoList.items)">\r\n							<span class="img_wrap">\r\n								<span class="image" ng-style="{\'background\': \'url(\' + item.photoList.items[0].imgUrl + \') center center / cover no-repeat\'}"/>\r\n								<span class="count">{{item.photoList.total_count}}</span>\r\n								<img ng-src="{{item.photoList.items[0].imgUrl}}" style="position:fixed;visibility:hidden" on-img-loaded cur-idx="{{$pindex}}"/>\r\n							</span>\r\n						</a>\r\n						<div class="each_review" ng-style="{\'padding-left\': (item.critTpCd == \'P\' || item.critTpCd == \'V\') && item.photoList.items[0] ? \'75px\' : \'0\'}">\r\n							<table summary="상품평">\r\n								<caption>상품평</caption>\r\n								<tbody>\r\n									<tr ng-repeat="obj in item.easnGdasList.items">\r\n										<th>{{obj.gdas_item_nm}}</th>\r\n										<td>{{obj.gdas_choc_item_nm}}</td>\r\n									</tr>\r\n								</tbody>\r\n							</table>\r\n						</div>\r\n					</div>\r\n										\r\n					<!-- 옵션 -->\r\n					<p ng-if="item.optDesc" class="options">{{item.optDesc}}</p>\r\n					\r\n					<!-- 상품평 : 내용 -->\r\n					<div class="cmtShortTxt">\r\n						<p class="cmt_cont ellipsis_custom" ng-if="!pageUI.loadData.dispNtcTxt && item.critContHtml" ng-bind-html="item.critContHtml"></p>\r\n					</div>\r\n					\r\n					<!-- 추천하기 -->\r\n					<div class="recomm_wrap" ng-hide="item.gdasTpNm && item.gdasTpNm.indexOf(\'선물\') >= 0">\r\n						<p class="info"><em>{{ (item.recommCnt || \'0\') | number}}</em>명이 이 상품평을 추천했습니다.</p>\r\n						<a ng-if="!item.recommYn" ng-click="recommClick(item)" class="btn_recomm on">추천할래요</a>\r\n						<a ng-if="item.recommYn" ng-click="" class="btn_recomm">추천했어요</a>\r\n					</div>\r\n					\r\n					<!-- 신고하기 -->\r\n					<a ng-hide="item.gdasTpNm && item.gdasTpNm.indexOf(\'선물\') >= 0" ng-click="showReportPop(item)" class="btn_report">신고</a>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n		<!--필터 레이어(좌측 슬라이드 메뉴)-->\r\n		<div class="side_filter_wrap" ng-class="{on:pageUI.filterOption.sliderOpen}"><!--상태변화 클래스: 보이기 on-->\r\n			<div class="side_filter_header">\r\n				필터 <a ng-click="hideFilterSlider(\'m_RDC_ProdDetail_RvwFlt_Clk_Close\')" class="filter_close">닫기</a>\r\n			</div>\r\n			<div class="slide_cont">\r\n				<ul class="menu_depth1">\r\n					<li class="sort" ng-class="{open:pageUI.filterOption.filter1Open}">\r\n						<a ng-click="sortByOpen(\'m_RDC_ProdDetail_RvwFlt_Clk_Sort\')">\r\n							<span class="filter_tit">정렬</span><span class="filter_val shape_triangle" ng-class="pageUI.filterOption.filter1Open? \'blue up\': \'down\'">{{pageUI.filterOption.filter1Names[pageUI.filterOption.filter1SelVal]}}</span><!--상태변화 클래스: 열림닫힘 blue up -> down-->\r\n						</a>\r\n						<!--정렬 sub depth-->\r\n						<ul class="menu_depth2">\r\n							<li ng-repeat="(key,value) in pageUI.filterOption.filter1Names | limitTo:(pageUI.loadData.dispNtcTxt && pageUI.filterOption.filter1Names[pageUI.filterOption.filter1SelVal] != \'고객추천순\')? 4:5" ng-class="{on:$index == pageUI.filterOption.filter1SelVal}">\r\n								<!--상태변화 클래스: 선택 on-->\r\n								<label for="{{\'cmtSort\'+$index}}">{{value}}</label><input type="radio" id="{{\'cmtSort\'+$index}}" name="cmtSort" value="{{$index}}" ng-model="pageUI.filterOption.filter1SelVal" ng-change="sortBy(\'m_RDC_ProdDetail_RvwFlt_Clk_Sort_0\'+($index+1))" integer>\r\n							</li>\r\n						</ul>\r\n					</li>\r\n					<li ng-if="!pageUI.loadData.healthfoodYn" class="only_media">\r\n						<label for="only_media" class="filter_tit">\r\n							사진/영상 상품평만 보기<input type="checkbox" id="only_media" name="only_media" ng-model="pageUI.filterOption.media_yn" ng-change="mediaOnly()" ng-true-value="\'Y\'" ng-false-value="\'N\'">\r\n						</label>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 개별 상품평 크게 보기 레이어 -->\r\n	<div class="review_layer" ng-if="arrReviewOne && arrReviewOne.length">\r\n		<div class="img_swipe_wrap">\r\n			<div class="prd_top_imgwrap" roll-swipe-banner getcontrol="getReviewSwipeControl" one-no-swipe="true" rolling="true" width320="1" width640="1" width900="1" interval="300000" endfnc="swipeReviewEnd" info="arrReviewOne">\r\n				<ul class="swipeBox">\r\n					<li ng-repeat="item in arrReviewOne">\r\n						<!-- 이미지 -->\r\n						<div class="thumb cover2 cover3" ng-if="!item.videoYn">\r\n							<img ng-src="{{item.imgUrl}}" alt="상품이미지" err-src="550" ng-class="{\'wid\': item.typeClass == \'wid\', \'hei\': item.typeClass == \'hei\'}"/>\r\n						</div>\r\n						<!-- 동영상 -->\r\n						<div ng-if="item.videoYn && item.type != \'youtube\'" lotte-video class="lv_wrap" lv-src="{{arrReviewOne[$index].videoUrl | trusted}}" lv-poster="{{arrReviewOne[$index].imgUrl}}">\r\n							<video id="videoReview" playsinline="true" webkit-playsinline="true">\r\n								<source type="video/mp4">\r\n							</video>\r\n							<div ng-show="movMode==0" class="play_cover"></div>\r\n							<div ng-show="movMode==1" class="stop_cover"></div>\r\n							<div ng-show="movMode!=0" ng-click="clickCover()" class="click_cover"></div>\r\n							<a ng-show="movMode==0" ng-click="playVideo()" class="btn_start">비디오 재생</a>\r\n							<a ng-show="movMode==1" ng-click="muteVideo()" ng-class="{mute:mute}" class="btn_volume btn_text btns">{{mute?\'음소거해제\':\'음소거\'}}</a>\r\n							<a ng-show="movMode==1" ng-click="stopVideo()" class="btn_stop btn_text btns">일시정지</a>\r\n							<a ng-show="movMode==1" ng-if="!rScope.appObj.isApp" ng-click="fullVideo()" class="btn_full btn_text btns">전체화면보기</a>\r\n						</div>\r\n						<!-- 유튜브 동영상 -->\r\n						<div ng-if="item.videoYn && item.type == \'youtube\'" class="vod_box">\r\n							<div class="player_wrap"><iframe title="YouTube video player" ng-src="{{trustSrc(\'https://www.youtube.com/embed/\' + item.mpic_info.mpic_url)}}" frameborder="0" allowfullscreen class="player"></iframe></div>\r\n							<div class="skt_app_desc" ng-if="rScope.appObj.isSktApp && !item.sktDescLayerCloseFlag">동영상은 외부 호스팅 사용으로 SKT 데이터 프리가<br>적용되지 않으니 유의하시기 바랍니다.<button ng-click="etvMovSktDescClose($event, item)" class="btn_close">안내 레이어 닫기</button></div>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n				<!-- 이미지 스와이프 좌우버튼, 플레이버튼 -->\r\n				<div class="btn_wrap" ng-if="arrReviewOne.length != 1 && arrReviewOne.length > 0">\r\n					<span class="prev_btn" ng-click="swipeBeforeReview()"></span>\r\n					<span class="next_btn" ng-click="swipeNextReview()"></span>\r\n				</div>\r\n				<!-- 페이징 -->\r\n				<div class="page_wrap" ng-if="arrReviewOne.length > 1">\r\n					<p class="page"><span class="cur_page">{{sb_review_index}}</span>/<span class="all">{{arrReviewOne.length}}</span></p>\r\n				</div>\r\n			</div>\r\n			<a class="btn_close" ng-click="dimmedClose()">닫기</a>\r\n		</div>\r\n	</div>\r\n	\r\n	<!-- 신고하기 팝업 -->\r\n	<div id="reportPop" report-pop ng-show="pageUI.loadData.reportList"  class="pop_report">\r\n		<section>\r\n			<h5 >불량상품평 신고하기</h5>\r\n			<ul>\r\n				<li ng-repeat="item in pageUI.loadData.reportList track by $index">\r\n					<input type="radio" id="reportRd{{$index}}" name="rg1" ng-value="item.dcl_accp_tp_cd"><label for="reportRd{{$index}}">{{item.dcl_accp_tp_nm}}</label>\r\n				</li>\r\n			</ul>\r\n			<div class="btns">\r\n				<a ng-click="hideReportPop()" class="btn_close">닫기</a>\r\n				<a ng-click="sendReport()" class="btn_report">신고하기</a>\r\n			</div>\r\n		</section>\r\n	</div>\r\n\r\n	<!--공통 로딩커버-->\r\n	<div class="loading_cover" ng-if="jsonLoading">\r\n		<div class="loading"></div>\r\n	</div>\r\n</section>')}]);