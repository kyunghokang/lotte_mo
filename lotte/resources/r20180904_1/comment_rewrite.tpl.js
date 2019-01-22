angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/product/m/comment_rewrite_container.html",'<section id="container">\r\n    <!-- contents -->\r\n    <section class="prod_eval">\r\n        <section class="list write review">\r\n            <div class="group">\r\n                <span class="thumb">\r\n                    <img ng-src="{{commentWrite.goods_img_url}}" alt=""/>\r\n                </span>\r\n                <span class="cont01">\r\n                    <p class="tl">{{commentWrite.goods_nm}}</p>\r\n                    <p class="spec" ng-if="commentWrite.goods_tp_cd != \'20\' && !commentWrite.smp_psb_yn">\r\n                        <span>{{commentWrite.opt_desc}}</span>\r\n                    </p>\r\n					<p class="spec e-coupon" ng-if="commentWrite.goods_tp_cd == \'20\' && !commentWrite.smp_psb_yn">\r\n						<span>{{commentWrite.e_use_loc_desc_cont}}</span>\r\n					</p>\r\n                </span>\r\n            </div>\r\n			<!-- <form id="commentWriteForm" name="commentWriteForm"> -->\r\n				<ul class="eval_wrap">\r\n					<li ng-class="{on:pageUI.stepOpen1}" class="star">\r\n			            <div class="cont">\r\n			                <div class="title_area">\r\n								<a ng-click="clickStepTitle(1)">\r\n									<h5>별점을 선택해 주세요.</h5><em>*</em>\r\n									<div class="star_wrap" ng-show="!pageUI.stepOpen1">\r\n										<span class="starScoreWrap"><span class="starScoreCnt" ng-style="{\'width\': ( input.gdas_stfd_val * 20 ) + \'%\'}"></span></span>\r\n									</div>\r\n								</a>\r\n			                </div>\r\n			                <div ng-show="pageUI.stepOpen1" class="content">\r\n								<div class="star_rating" lotte-star on-star-change="onStarChange(val)">\r\n									<ul class="btns">\r\n										<li ng-class="{on:input.gdas_stfd_val >= 1}">\r\n											<a ng-click="input.gdas_stfd_val=1;openStep(2)">1점</a>\r\n										</li>\r\n										<li ng-class="{on:input.gdas_stfd_val > 1}">\r\n											<a ng-click="input.gdas_stfd_val=2;openStep(2)">2점</a>\r\n										</li>\r\n										<li ng-class="{on:input.gdas_stfd_val > 2}">\r\n											<a ng-click="input.gdas_stfd_val=3;openStep(2)">3점</a>\r\n										</li>\r\n										<li ng-class="{on:input.gdas_stfd_val > 3}">\r\n											<a ng-click="input.gdas_stfd_val=4;openStep(2)">4점</a>\r\n										</li>\r\n										<li ng-class="{on:input.gdas_stfd_val > 4}">\r\n											<a ng-click="input.gdas_stfd_val=5;openStep(2)">5점</a>\r\n										</li>\r\n									</ul>\r\n								</div>\r\n							</div>\r\n			            </div>\r\n		            </li>\r\n		            <li ng-class="{on:pageUI.stepOpen2}" class="option" ng-if="commentWrite.easnGdasList && commentWrite.easnGdasList.items && commentWrite.easnGdasList.items.length">\r\n			            <div class="cont">\r\n			                <div class="title_area">\r\n								<a ng-click="clickStepTitle(2)">\r\n			                		<h5>항목별로 간단히 평가해 주세요.</h5><em>*</em>\r\n								</a>\r\n							</div>\r\n			                <div ng-show="pageUI.stepOpen2" class="content">\r\n								<ul class="option_wrap">\r\n									<li ng-repeat="item in commentWrite.easnGdasList.items" ng-init="pIndex = $index">\r\n										<div ng-if="item.gdas_choc_shp_item_yn === \'Y\'">\r\n											<span class="title">{{item.gdas_item_nm}}</span>\r\n											<input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" id="inputText{{$index}}" ng-model="item.gdas_choc_item_value" ng-keypress="srhDetailSearchKeypress($event)"/>\r\n										</div>\r\n										<div ng-if="item.gdas_choc_shp_item_yn === \'N\'">\r\n											<span class="title">{{item.gdas_item_nm}}</span>\r\n											<ul class="option_select">\r\n												<li ng-repeat="obj in item.easnGdasSubList.items">\r\n													<input type="radio" id="rd_{{pIndex}}_{{$index}}" value="{{obj.gdas_choc_item_no}}" name="rg_{{pIndex}}" ng-model="item.gdas_choc_item_value" ng-change="commentWrite.easnGdasList.items.length - 1 === pIndex && !commentWrite.healthfood && openStep(3)">\r\n													<label for="rd_{{pIndex}}_{{$index}}">{{obj.gdas_choc_item_nm}}</label>\r\n												</li>\r\n											</ul>\r\n										</div>\r\n									</li>\r\n								</ul>\r\n							</div>\r\n			            </div>\r\n		            </li>\r\n		            <li ng-if="!commentWrite.healthfood" ng-class="{on:pageUI.stepOpen3}" class="file">\r\n			            <div class="cont">\r\n			                <div class="title_area">\r\n								<a ng-click="clickStepTitle(3)">\r\n									<h5>상품평을 작성해 주세요.</h5>\r\n								</a>\r\n							</div>\r\n							<div ng-show="pageUI.stepOpen3" class="content">\r\n								<div class="photo_area">\r\n									<ul>\r\n										<li>\r\n											<span class="image" ng-class=\'{\r\n													horizontal:rotation1==2,\r\n		                                            rotate180:rotation1==3,\r\n		                                            rotate90:rotation1==6,\r\n		                                            rotateM90:rotation1==8,\r\n		                                            vertical:rotation1==4,\r\n		                                            horizontalRotate90:rotation1==5,\r\n		                                            horizontalRotateM90:rotation1==7\r\n												}\' ng-style="{\'background\' : \'url(\' + fileImgList.list[0].imgUrl + \') center center no-repeat\', \'background-size\': \'cover\'}"></span>\r\n											<input id="file1" name="" type="file" class="" \r\n											onchange="angular.element(this).scope().detectFile(this, 1)" \r\n											ng-click="callAppUpload($event, 1)" accept="image/*">\r\n											<a class="btn_del" ng-show="fileImgList.list[0].imgUrl != fileImgList.blankImg" ng-click="deleteImg(1, fileImgList.list[0].idx)">이미지 삭제</a>\r\n										</li>\r\n										<li>\r\n											<span class="image" ng-class=\'{\r\n													horizontal:rotation2==2,\r\n		                                            rotate180:rotation2==3,\r\n		                                            rotate90:rotation2==6,\r\n		                                            rotateM90:rotation2==8,\r\n		                                            vertical:rotation2==4,\r\n		                                            horizontalRotate90:rotation2==5,\r\n		                                            horizontalRotateM90:rotation2==7\r\n												}\' ng-style="{\'background\' : \'url(\' + fileImgList.list[1].imgUrl + \') center center no-repeat\', \'background-size\': \'cover\'}"></span>\r\n											<input id="file2" name="" type="file" class="" \r\n											onchange="angular.element(this).scope().detectFile(this, 2)" \r\n											ng-click="callAppUpload($event, 2)" accept="image/*">\r\n											<a class="btn_del" ng-show="fileImgList.list[1].imgUrl != fileImgList.blankImg" ng-click="deleteImg(2, fileImgList.list[1].idx)">이미지 삭제</a>\r\n										</li>\r\n										<li>\r\n											<span class="image" ng-class=\'{\r\n													horizontal:rotation3==2,\r\n		                                            rotate180:rotation3==3,\r\n		                                            rotate90:rotation3==6,\r\n		                                            rotateM90:rotation3==8,\r\n		                                            vertical:rotation3==4,\r\n		                                            horizontalRotate90:rotation3==5,\r\n		                                            horizontalRotateM90:rotation3==7\r\n												}\' ng-style="{\'background\' : \'url(\' + fileImgList.list[2].imgUrl + \') center center no-repeat\', \'background-size\': \'cover\'}"></span>\r\n											<input id="file3" name="" type="file" class="" \r\n											onchange="angular.element(this).scope().detectFile(this, 3)" \r\n											ng-click="callAppUpload($event, 3)"  accept="image/*">\r\n											<a class="btn_del" ng-show="fileImgList.list[2].imgUrl != fileImgList.blankImg" ng-click="deleteImg(3, fileImgList.list[2].idx)">이미지 삭제</a>\r\n										</li>\r\n									</ul>\r\n								</div>\r\n								<div class="write_area">\r\n									<textarea id="reviewTxt" ng-model="input.reviewTxt" placeholder="자세히 작성할수록 상품평 랭킹 점수가 올라갑니다." \r\n					                		onchange="maxLengthCheck(\'4000\', null, this, reviewTxt)" onkeyup="maxLengthCheck(\'4000\', null, this)">\r\n					                	{{input.reviewTxt}}\r\n					                </textarea>\r\n									<span class="limit"><span id="spn_input_char">0</span>/4000 byte</span>\r\n								</div>\r\n								<a class="btn_tip" ng-click="showTipLayer()">상품평 작성 팁</a>\r\n							</div>\r\n			            </div>\r\n		            </li>\r\n				</ul>\r\n	            <div class="confirm">\r\n	                <a href="#" class="btn b" ng-click="cancel()">취소하기</a>\r\n	                <a href="#" class="btn b on" ng-click="saveReady()">등록하기</a>\r\n	            </div>\r\n			<!-- </form> -->\r\n        </section>\r\n    </section>\r\n    <!-- //contents -->\r\n    \r\n    <!-- 상품평 작성 팁 레이어 -->\r\n	<div class="tip_layer" ng-if="arrTip && arrTip.length">\r\n		<div class="img_swipe_wrap">\r\n			<div class="prd_top_imgwrap" roll-swipe-banner endfnc="tipSwipeEnd" rolling="true" width320="1" width640="1" width900="1" interval="300000" info="arrReviewOne">\r\n				<ul class="swipeBox">\r\n					<li ng-repeat="item in arrTip">\r\n						<!-- 이미지 -->\r\n						<div class="thumb">\r\n							<img ng-src="{{item.imgUrl}}" alt="상품이미지" err-src="550"/>\r\n						</div>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<!-- 페이징 -->\r\n			<div class="indicator" ng-if="arrTip.length > 1">\r\n				<ul>\r\n					<li ng-repeat="item in arrTip" ng-class="{\'on\' : tipSwipeIndex == $index}">{{$index}}</li>\r\n				</ul>\r\n			</div>\r\n			<a class="btn_close" ng-click="dimmedClose()">닫기</a>\r\n		</div>\r\n	</div>\r\n    \r\n    <!--공통 로딩커버-->\r\n	<div class="loading_cover" ng-if="jsonLoading">\r\n		<div class="loading"></div>\r\n	</div>\r\n</section>')}]);