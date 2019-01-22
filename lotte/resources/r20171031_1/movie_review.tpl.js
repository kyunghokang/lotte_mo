angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/sns/share_box.html",'<section>\r\n	<h5 ><!-- <i></i> -->{{snsTitle}}</h5>\r\n    <ul>\r\n       <li class="kakaotalk" ng-if="talkFlag" id="kakaotalk">\r\n           <a ng-click="shareSNS(\'kakaotalk\')"><i></i>카카오톡</a>\r\n       </li>  \r\n       <li class="twitter" ng-if="twitFlag">\r\n           <a ng-click="shareSNS(\'twitter\')"><i></i>트위터</a>\r\n       </li>\r\n       <li class="kakaostory" ng-if="stotyFlag">\r\n           <a ng-click="shareSNS(\'kakaostory\')"><i></i>카카오스토리</a>\r\n       </li>            \r\n       <li class="sms" ng-if="smsFlag">\r\n           <a ng-click="shareSNS(\'sms\')"><i></i>문자</a>\r\n       </li>\r\n       <li class="facebook" ng-if="faceFlag">\r\n           <a ng-click="shareSNS(\'facebook\')"><i></i>페이스북</a>\r\n       </li>     \r\n       <li ng-if="appObj.isApp && mailFlag" class="mail">\r\n           <a ng-click="shareSNS(\'mail\')"><i></i>메일</a>\r\n       </li>\r\n       <li class="urlcopy" ng-if="urlFlag" >\r\n           <a ng-click="shareSNS(\'url_copy\')" id="copyUrl"><i></i>URL 복사</a>\r\n       </li>       \r\n     \r\n    </ul>\r\n    <div ng-if="appFlag" class="share_app">\r\n    	<a ng-click="shareSNS(\'moreapp\')"><!-- <i></i> -->다른 앱으로 공유</a>\r\n    </div>\r\n    <div class="url_copy" ng-if="!appObj.isApp && urlCopyFlag">\r\n    	<span>URL</span>\r\n    	<!-- <input type="text" id="cnShareUrl" ng-value="cnShareUrl"> -->\r\n    	<a href="{{cnShareUrl}}" onclick="return false;" class="clipUrl">{{cnShareUrl}}</a>\r\n    </div>\r\n   	<div class="btn_close" ng-show="shareBoxVisible" ng-click="hideSharePop()">\r\n       <a href="">닫기</a>\r\n	</div>\r\n	\r\n</section>\r\n'),a.put("/lotte/resources_dev/sns/share_pop.html",'<div id="sharePop" class="pop_sns" ng-show="sharePopVisible" ng-if="sharePopVisible" ng-class="{on:sharePopVisible}">\r\n	<share-box ng-show="shareBoxVisible"></share-box>\r\n	<sms-box ng-show="smsBoxVisible"></sms-box>\r\n</div>'),a.put("/lotte/resources_dev/movie_review/movie_review_container.html",'<section ng-show="contVisible" class="cont_minheight">\r\n  <!-- <section>\r\n		<div class=\'sub_header_wrap\'>\r\n      <header id="head_sub" class="fixedSubHeader " ng-class="{fixedHeader: fixedHeader && subHeaderFixed && !appObj.isNativeHeader}">\r\n				<div class=\'head_sub_inner\'>\r\n					<h2><a ng-click="mallMainClick(\'m_DC_SpeDisp_Reviewer_Clk_logo\')"><span>사전보고</span></a></h2>\r\n					<a class=\'share\' href=\'#\' ng-click="petShare({shareImg:screenData.top_banner[0].img_url})"><span>공유</span></a>\r\n				</div>\r\n			</header>\r\n		</div>\r\n	</section> -->\r\n  <div class="top_tit_img_wrap" ng-bind-html="reviewer_mall.main_banner"></div>\r\n  <div class="fix" ng-class="{on: isMainHeaderFixed, app:appObj.isApp}">\r\n    <div class="cte_spe_wrap">\r\n        <div class="cate swipe_wrap" lotte-slider>\r\n          <ul>\r\n            <li ng-repeat="item in reviewer_mall.tab_nm_list.items" ng-class="{on:$index == reviewer_mall.tab_nm_list.tabIdx}">\r\n              <a ng-click="tabClick(item, $index)">{{item.text_conts_tit_nm}}</a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n    </div>\r\n  </div>\r\n  <!-- <div class="cate swipe_wrap" lotte-slider>\r\n    <ul>\r\n      <li ng-repeat="item in reviewer_mall.tab_nm_list.items" ng-class="{on:$index == reviewer_mall.tab_nm_list.tabIdx}">\r\n        <a ng-click="tabClick(item, $index)">{{item.text_conts_tit_nm}}</a>\r\n      </li>\r\n    </ul>\r\n  </div> -->\r\n  <ul class="pre_mov_ul">\r\n    <li ng-repeat="item in product.moviePrd">\r\n      <div class="pre_mov_top">\r\n        <img ng-src={{item.user_img_url}} alt="">\r\n        <dl>\r\n          <dt>{{item.review_title}}</dt>\r\n          <dd>ID : <span>{{item.wrtr_nknm_nm}}</span></dd>\r\n        </dl>\r\n      </div>\r\n      <!-- 동영상1 -->\r\n  		<div class="mov_wrap">\r\n  			<div>\r\n  				<div class="lv_wrap" lotte-video lv-no-alert="false" lv-src="{{item.movie_url}}" lv-detail-url="{{getProductUrl(item, tclick + \'_Clk_video\', $index)}}" lv-poster="{{item.video_img_url}}">\r\n  					<!-- <video id="{{item.movid}}" preload="none" playsinline="true" webkit-playsinline="true"  video-poster="{{item.video_img_url}}" poster="{{item.video_img_url}}"> -->\r\n  					<video id="{{item.movid}}" preload="none" playsinline="true" webkit-playsinline="true">\r\n  						<!-- <source type="video/mp4"  ng-src="{{item.movie_url | trusted}}"> -->\r\n  						<source type="video/mp4">\r\n  					</video>\r\n            <div ng-show="movMode==0" class="play_cover"></div>\r\n						<div ng-show="movMode==1" class="stop_cover"></div>\r\n						<div ng-show="movMode!=0" ng-click="clickCover()" class="click_cover"></div>\r\n						<a ng-show="movMode==0" ng-click="movPlayTclick($index);playVideo()" class="btn_start">비디오 재생</a>\r\n						<a ng-show="movMode==1" ng-click="movVolume(\'btnVolume1\');muteVideo()" ng-class="{mute:mute}" class="btn_volume btn_text btns">{{mute?\'음소거해제\':\'음소거\'}}</a>\r\n						<a ng-show="movMode==1" ng-click="movPauseTclick($index);stopVideo()" class="btn_stop btn_text btns">일시정지</a>\r\n						<a ng-show="movMode==1" ng-click="goDetailPage()" class="btn_goods btn_text btns">자세히보기</a>\r\n						<!-- <a ng-show="movMode==1" ng-if="!rScope.appObj.isApp" ng-click="fullVideo()" class="btn_full btn_text btns">전체화면보기</a> -->\r\n\r\n            <!-- <div class="play_cover"></div>\r\n						<div class="stop_cover"></div>\r\n						<div class="click_cover"></div>\r\n            <a id="btnVolume1" ng-click="movVolume(\'btnVolume1\')" class="btn_move_volume btn_text">음소거</a>\r\n						<a ng-click="movPlayTclick($index)" class="btn_move_start">비디오 재생</a>\r\n						<a ng-click="movPauseTclick($index)" class="btn_move_stop btn_text">일시정지</a>\r\n            <a ng-click="goDetailPage()" class="btn_move_goods btn_text">상품보기</a> -->\r\n            <!-- <a ng-click="mainProductClick(item, tclick + \'_Clk_video\',$index)" class="btn_move_goods btn_text">상품보기</a> -->\r\n\r\n					</div>\r\n\r\n  			</div>\r\n        <a class="pre_mov_bot" ng-click="preBotTclick(item,$index)">\r\n          <img ng-src="{{item.prd_img_url}}" class="bot_img" alt="">\r\n          <div class="right_area">\r\n            <p class="tit1">{{item.goods_nm}}</p>\r\n            <div class="tit2"><span class="tit3">{{item.price2 | currency: \'\':0}}</span><span class="tit4">원</span><em class="plan_prod_limit" ng-if="item.is_plan_prod">~</em><del class="tit5" ng-show="item.price1!=item.price2 && item.price1 !=0">{{item.price1 | currency: \'\':0}}원</del></div>\r\n            <div class="user_feedback" ng-click="linkClick(pageUI.data.callUrlInfo.commentDtlUrl,\'m_RDC_ProdDetail_Clk_Rvw01\')" ng-if="item.avg_gdas_stfd_val > 0">\r\n							<span class="starScoreWrap"><span class="starScoreCnt" style="width:{{item.avg_gdas_stfd_val / 5 * 100}}%"></span></span>\r\n							<span class="review">({{item.gdas_cnt}})</span>\r\n						</div>\r\n          </div>\r\n        </a>\r\n  		</div>\r\n      <!-- <script type="text/javascript">\r\n                 setTimeout(function(){autoVideoPlay("{{item.prdInfo.movieID}}", "#autoVideo1");}, 1500);\r\n       </script> -->\r\n    </li>\r\n  </ul>\r\n  <div class="more_list" ng-show="isMovie" ng-click="moremov()">영상 더보기</div>\r\n</section>\r\n')}]);