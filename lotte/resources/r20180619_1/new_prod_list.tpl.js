angular.module("app").run(["$templateCache",function(a){"use strict";a.put("/lotte/resources_dev/category/m/new_prod_list_container.html",'<section ng-show="contVisible" class="cont_minheight" id="container">\n	<!-- 서브 헤더 -->\n	<div class="head_sub_cateDepth" ng-class="{app:appObj.isApp}">\n		<header id="head_sub" class="cateDepth2" sub-header-prod-list>\n		    <h2 ng-class="{search:searchCntTxt}" class="{{addCls}}">\n		        <span ng-click="cateView()">\n		            <span class="title">{{uiStateObj.subTitle}}</span>\n		        </span>\n		    </h2>\n		    <p class="this">\n		        <a ng-click="showHideSideSearch()" ng-class="{disabled:!uiStateObj.detailSearchDataLoaded || !uiStateObj.selectedFilter}">필터<em ng-if="uiStateObj.selectedFilter">({{uiStateObj.selectedFilter}})</em></a>\n		    </p>\n		</header>\n	</div>	\n	<!-- //서브 헤더 -->\n	<style ng-if="appObj.isIOS">\n		video::-webkit-media-controls,\n		video::-webkit-media-controls-play-button,\n		video::-webkit-media-controls-fullscreen-button,\n		video::-webkit-media-controls-start-playback-button{display:none}\n		\n		*::-webkit-media-controls-panel {\n		  display: none!important;\n		  -webkit-appearance: none;\n		}\n		/* Old shadow dom for play button */\n		*::--webkit-media-controls-play-button {\n		  display: none!important;\n		  -webkit-appearance: none;\n		}\n		/* New shadow dom for play button */\n		*::-webkit-media-controls-start-playback-button {\n		  display: none!important;\n		  -webkit-appearance: none;\n		}\n	</style>\n	<!-- 카테고리 -->\n	<div class="result_wrap categoryWrap cate_prod unitType_{{templateType}}">\n		<!-- 검색 필터 /-->\n		<div class="srh_terms_wrap_area">\n			<div class="srh_terms_wrap" ng-class="{show:uiStateObj.initFlag==false}">\n				<div class="result_cnt">전체<em>{{srhResultData.tCnt|number}}</em>개</div>\n				<div class="right">\n					<a href="#" ng-click="showHideSideSearch(\'SORT\')"><span>{{uiStateObj.sortTypeArr[uiStateObj.sortTypeIdx].shortLabel}}</span></a>    \n					<ul>\n						<li>\n							<span class="unit_listType type1" ng-click="changeTemplate(\'cate_prod_double\');" ng-show="templateType==\'cate_prod_normal\'"></span>\n							<span class="unit_listType type2" ng-click="changeTemplate(\'cate_prod_image\');" ng-show="templateType==\'cate_prod_double\'"></span>\n							<span class="unit_listType type3" ng-click="changeTemplate(\'cate_prod_single\');" ng-show="templateType==\'cate_prod_image\'"></span>\n							<span class="unit_listType type4" ng-click="changeTemplate(\'cate_prod_normal\');" ng-show="templateType==\'cate_prod_single\'"></span>\n						</li>\n					</ul>    		\n				</div>\n			</div>\n		</div>\n		<!--/ 검색 필터 -->\n\n\n		<!-- 검색 결과 / -->\n		<div class="listWrap newProdListWrap" ng-controller="productCtrl" ng-if="!uiStateObj.emptyResult">\n			<!-- s: unit list area -->\n			<div class="unitWrap" ng-if="srhResultData.prdLst1.length > 0">\n				<div product-container template-type="cate_prod_normal" total-count="srhResultData.tCnt" templatetype="templateType" use-storage="true"\n					products="srhResultData.prdLst1" more-product-continer="loadMoreData()"></div>\n			</div>\n			\n			<!-- 기획전형 상품 20180307 박해원 -->\n			<search-plan-shop></search-plan-shop>\n			\n			<div class="unitWrap" ng-if="srhResultData.prdLst2.length > 0">\n				<div product-container template-type="cate_prod_normal" total-count="srhResultData.tCnt" templatetype="templateType" use-storage="true"\n					products="srhResultData.prdLst2" more-product-continer="loadMoreData()"></div>\n			</div>\n			<!-- e: unit list area -->\n		</div>\n\n		<section class="noData" ng-if="uiStateObj.emptyResult">해당하는 상품이 없습니다.</section>\n		<!-- /검색 결과 -->\n	</div>\n	<!-- //카테고리 -->\n	<scroll-count></scroll-count>\n    <loading-bar></loading-bar>\n	<cate-side-filter></cate-side-filter>\n</section>'),a.put("/lotte/resources_dev/category/m/cate_side_filter.html",'<section>\r\n<div class="side_search_wrap" ng-class="{on:searchUISetting.isShowSideBar, sub:searchUISetting.isShowSub}" ng-if="uiStateObj.detailSearchDataLoaded">\r\n   	<div class="ssw_header">\r\n   		<div class="ssw_header1">\r\n   			<div class="cropview">\r\n    			<a href="#" class="ssw_title main" ng-click="hideSubSearch()">필터</a>\r\n    			<span class="ssw_title sub">{{searchUISetting.title}}</span>\r\n   			</div>\r\n   			<a href="#" ng-click="closeSidebarBtnClk()" class="search2016_bg ssw_close">close</a>\r\n   		</div>\r\n   		<div class="ssw_header2">\r\n   			<span>검색결과 <em>{{srhResultData.tCnt|number}}</em>개</span>\r\n   			<a href="#" class="reset_all" ng-click="resetAllSearchTerm()"\r\n   				xxx-ng-hide="searchUISetting.slide==\'research\'"\r\n   				ng-class="{disabled:\r\n   					(\r\n						searchUISetting.isShowSub==false\r\n						&& uiStateObj.srhFilterCtgFlag==false\r\n						&& (uiStateObj.srhFilterBrdFlag==false)\r\n						&& (uiStateObj.sortTypeIdx==0)\r\n						&& (uiStateObj.srhFilterDetailFlag==false)\r\n						&& (postParams.freeDeliYN==\'N\')\r\n						&& (postParams.deptYN==\'N\')\r\n						&& (postParams.reQuery.length==0 && postParams.exQuery.length==0)\r\n   					)\r\n   					||\r\n   					(\r\n   						searchUISetting.isShowSub==true && (\r\n   							(searchUISetting.slide==\'category\' && uiStateObj.srhFilterCtgFlag==false)\r\n   							|| (searchUISetting.slide==\'brand\' && uiStateObj.srhFilterBrdFlag==false)\r\n   							|| (searchUISetting.slide==\'sort\' && uiStateObj.sortTypeIdx==0)\r\n   							|| (searchUISetting.slide==\'color\' && postParams.selectedColor.length==0)\r\n   							|| (searchUISetting.slide==\'price\' && postParams.priceMaxU==null && postParams.priceMinU==null && postParams.smpickYN+postParams.freeInstYN+postParams.pointYN==\'NNN\')\r\n   							|| (searchUISetting.slide==\'research\' && postParams.reQuery.length==0 && postParams.exQuery.length==0)\r\n   						)\r\n   					)\r\n   				}">초기화</a>\r\n   		</div>\r\n   	</div>\r\n   	\r\n   	<div class="ssw_content">\r\n   		<div class="ssw_slide main">\r\n   			<ul>\r\n   				<li class="on">\r\n    				<a href="#" ng-click="showSubSearch($event)" data-slide="sort" data-label="정렬">\r\n   						<span class="title">정렬</span>\r\n   						<span class="detail">{{uiStateObj.sortTypeArr[uiStateObj.sortTypeIdx].label}}</span>\r\n    				</a>\r\n   				</li>\r\n   				<li ng-class="{on:uiStateObj.selectedCategory.ctgName && uiStateObj.selectedCategory.ctgName.length> 0}">\r\n    				<a href="#" ng-click="showSubSearch($event)" data-slide="category" data-label="카테고리">\r\n   						<span class="title">카테고리</span>\r\n   						<span class="detail">{{uiStateObj.selectedCategory.ctgName.join(",")}}</span>\r\n    				</a>\r\n   				</li>\r\n   				<li ng-if="uiStateObj.currentPageType==\'C\'" ng-class="{on:postParams.brdNmArr && postParams.brdNmArr.length > 0}">\r\n    				<a href="#" ng-click="showSubSearch($event)" data-slide="brand" data-label="브랜드">\r\n   						<span class="title">브랜드</span>\r\n   						<span class="detail brand"><em ng-repeat="item in postParams.brdNmArr track by $index">{{item}}</em></span>\r\n    				</a>\r\n   				</li>\r\n   				<li ng-class="{on:postParams.priceMinU || postParams.priceMaxU || postParams.freeInstYN==\'Y\' || postParams.pointYN==\'Y\'}">\r\n    				<label ng-click="showSubSearch($event)" data-slide="price" data-label="가격/혜택"><!-- for="{{appObj.isTablet?\'\':\'priceMinU\'}}" -->\r\n   						<span class="title">가격/혜택</span>\r\n   						<span class="detail price"><em class="min price" ng-if="postParams.priceMinU">{{postParams.priceMinU|number}}</em><em class="max price" ng-if="postParams.priceMaxU">{{postParams.priceMaxU|number}}</em><em ng-if="postParams.freeInstYN==\'Y\'">무이자</em><em ng-if="postParams.pointYN==\'Y\'">포인트</em></span>\r\n    				</label>\r\n   				</li>\r\n   				<li ng-class="{on:postParams.smpickYN==\'Y\' || postParams.isCrsPickYn==\'Y\' || postParams.isDlvToday==\'Y\' || postParams.isDlvQuick==\'Y\'}">\r\n					<a href="#" ng-click="showSubSearch($event)" data-slide="delivery" data-label="배송">\r\n						<span class="title">배송</span>\r\n						<span class="detail benefit"><em ng-if="postParams.smpickYN==\'Y\'">스마트픽 - {{uiStateObj.smpickBranchName}}</em><em ng-if="postParams.isCrsPickYn==\'Y\'">스마트픽</em><em ng-if="postParams.isDlvToday==\'Y\'">오늘도착</em><em ng-if="postParams.isDlvQuick==\'Y\'">퀵배송</em></span>\r\n					</a>\r\n				</li>\r\n   				<li ng-class="{on:postParams.selectedColor && postParams.selectedColor.length > 0}">\r\n    				<a href="#" ng-click="showSubSearch($event)" data-slide="color" data-label="컬러">\r\n   						<span class="title">컬러</span>\r\n	    				<div class="detail color_list">\r\n		    				<ul>\r\n		    					<li ng-repeat="item in postParams.selectedColor | limitTo:2" class="c{{item}} i{{$index}}"><a></a></li><li ng-if="postParams.selectedColor.length>2" class="ellipsis">...</li>\r\n		    				</ul>\r\n	    				</div>\r\n    				</a>\r\n   				</li>\r\n   				<li class="dept_check" ng-if="uiStateObj.currentPageType!=\'S\'">\r\n   					<label for="ssws_free">\r\n					무료배송<input type="checkbox" id="ssws_free" name="ssws_free"\r\n								ng-model="postParams.freeDeliYN"\r\n								ng-change="srhDetailChange(\'freeDeliYN\')"\r\n								ng-true-value="\'Y\'"\r\n								ng-false-value="\'N\'">\r\n					</label>\r\n   				</li>\r\n   				<li class="dept_check" ng-if="uiStateObj.currentPageType!=\'S\'">\r\n   					<label for="ssws_store1" ng-class="{disabled:!srhDetailData.srhTerms.dept}">\r\n					롯데백화점<input type="checkbox" id="ssws_store1" name="ssws_store1"\r\n								ng-model="postParams.deptYN"\r\n								ng-change="srhDetailChange(\'deptYN\')"\r\n								ng-true-value="\'Y\'"\r\n								ng-false-value="\'N\'"\r\n								ng-disabled="!srhDetailData.srhTerms.dept">\r\n					</label>\r\n   				</li>\r\n   			</ul>\r\n   			<!-- 결과 내 검색 -->\r\n   			<div class="ssws_research" ng-class="{on:searchUISetting.focusIn}">\r\n   				<form class="srh_frm">\r\n				<fieldset>\r\n				<legend>검색</legend>\r\n	  			<div class="re-search">\r\n	  				<span class="title">결과 내 검색</span>\r\n					<div class="keyword">\r\n						<input type="search" autocomplete="off" autocapitalize="off" autocorrect="off" id="rekeyword" name="rekeyword"\r\n							placeholder="키워드를 입력해주세요." ng-blur="srhDetailSearchBlur()"\r\n							ng-model="postParams.rekeyword" ng-keypress="srhDetailSearchKeypress($event)" ng-focus="srhDetailSearchFocus()"\r\n							ng-disabled="uiStateObj.relatedKeywordEnabled==false" /><!--  ng-keyup="srhDetailSearchActiveChk()" -->\r\n						<button ng-show="postParams.rekeyword && !searchUISetting.keywordIncExc" class="btn_clear" ng-click="postParams.rekeyword=\'\'"></button>\r\n						\r\n					</div>\r\n	   				<div class="button">\r\n						<button class="btn_search" type="submit" ng-click="srhDetailSearchKeyword()" ng-disabled="uiStateObj.relatedKeywordEnabled==false">검색</button>\r\n					</div>\r\n	  			</div>\r\n				<div class="keywords">\r\n					<ul class="keyword_list include" ng-if="postParams.reQuery.length > 0">\r\n	                    <li ng-repeat="item in postParams.reQuery track by $index"><a href="#" ng-click="deleteRequeryKeyword(item)">{{item}}</a></li>\r\n	               	</ul>\r\n					<ul class="keyword_list exclude" ng-if="postParams.exQuery.length > 0">\r\n	                    <li ng-repeat="item in postParams.exQuery track by $index"><a href="#" ng-click="deleteExqueryKeyword(item)">{{item}}</a></li>\r\n	               	</ul>\r\n	               	<div class="guide">키워드 검색시 설정한 모든 필터 조건은 해제됩니다.</div>\r\n				</div>\r\n				</fieldset>\r\n				</form>\r\n			</div>\r\n			<div class="ssws_bottom">\r\n				<button class="plus" ng-click="changeFontSize();"></button>\r\n			</div>\r\n   		</div>\r\n   		<div class="ssw_slide sub">\r\n   			<!-- 01 SORT -->\r\n   			<div class="ssws_wrap ssws_sort" ng-show="searchUISetting.slide==\'sort\'">\r\n   				<ul>\r\n                    <ul>\r\n                        <li ng-class="{on:uiStateObj.sortTypeIdx== $index}" ng-repeat="item in uiStateObj.sortTypeArr">\r\n                        	<label for="sortTypeDetail{{item.shortIdx}}">\r\n                        		{{item.label}}\r\n                        		<input type="radio" id="sortTypeDetail{{item.shortIdx}}" name="sortTypeDetail" value="{{item.value}}" ng-model="postParams.sort" ng-change="srhSortPost($index)" />\r\n                        	</label>\r\n                        </li>\r\n                    </ul>\r\n   				</ul>\r\n   				<div class="sort_guide" id="sortGuideButton">\r\n   					<a href="#" ng-click="showHideSortGuide()" ng-class="{on:tipShow}">판매순</a>\r\n   				</div>\r\n   			</div>\r\n   			<!-- 01 SORT -->\r\n   			\r\n   			<!-- 02 CATEGORY -->\r\n   			<div class="ssws_wrap ssws_category" ng-show="searchUISetting.slide==\'category\'">\r\n   				<ul class="cate_d1 openable"\r\n   					ng-if="srhResultData.ctgLst.items && srhResultData.ctgLst.items.length > 0">\r\n   					<li class="allcate">\r\n   						<span>\r\n   							<em>전체</em> (총 <em>{{uiStateObj.filterCateCnt}}</em>개 카테고리)\r\n   						</span>\r\n   					</li>\r\n   					<li ng-repeat="ctg1 in srhResultData.ctgLst.items track by $index"\r\n   						ng-class="{checked:ctg1.checked, depthMod:ctg1.depthMod, dotcom:ctg1.mall==\'롯데닷컴\', department:ctg1.mall==\'롯데백화점\', youngplaza:ctg1.mall==\'영플라자\', chkopen:checkOpenCtgCd(ctg1)}"\r\n   						ng-if="postParams.deptYN==\'N\' || (postParams.deptYN==\'Y\' && ctg1.mall==\'롯데백화점\')"\r\n   						id="ctg_{{ctg1.ctgNo}}" data-name="{{ctg1.ctgName}}" data-no="{{ctg1.ctgNo}}" data-depth="0" data-tid="{{ctg1.tid}}">\r\n   						<a href="#" ng-click="categoryItemClick($event, ctg1)"><span class="flag"></span>{{ctg1.ctgName}}<span class="count">({{ctg1.cnt | number}})</span><!-- <em ng-if="ctg1.mall && ctg1.mall != \'\'"> ({{ctg1.mall}})</em> --></a>\r\n   						<a href="#" class="handle">열기/닫기</a>\r\n   						<!-- 2뎁스 대카 -->\r\n   						<ul class="cate_d2" ng-if="ctg1.subCtgLst && ctg1.subCtgLst.items && ctg1.subCtgLst.items.length > 0">\r\n	    					<li ng-repeat="ctg2 in ctg1.subCtgLst.items track by $index" id="ctg_{{ctg2.ctgNo}}"\r\n	    						data-name="{{ctg2.ctgName}}" data-no="{{ctg2.ctgNo}}" data-depth="1" data-tid="{{ctg2.tid}}" \r\n	    						ng-class="{checked:ctg2.checked, chkopen:checkOpenCtgCd(ctg2)}">\r\n	    						<input type="checkbox" id="ctg2{{$index}}" name="ctg2{{$index}}" ng-model="ctg2.checked" ng-click="categoryItemCheck($event, ctg2)">\r\n	    						<a href="#" ng-click="categoryItemClick($event, ctg2)">{{ctg2.ctgName}}<span class="count">({{ctg2.cnt | number}})</span><!-- <em ng-if="ctg2.mall && ctg2.mall != \'\'"> ({{ctg2.mall}})</em> --></a>\r\n	    						<!-- 3뎁스 중카 -->\r\n	    						<ul class="cate_d3" ng-if="ctg2.subCtgLst && ctg2.subCtgLst.items && ctg2.subCtgLst.items.length > 0">\r\n			    					<li ng-repeat="ctg3 in ctg2.subCtgLst.items track by $index" id="ctg_{{ctg3.ctgNo}}"\r\n			    						data-name="{{ctg3.ctgName}}" data-no="{{ctg3.ctgNo}}" data-depth="2" data-tid="{{ctg3.tid}}"  \r\n			    						ng-class="{checked:ctg3.checked, chkopen:checkOpenCtgCd(ctg3)}">\r\n			    						<input type="checkbox" id="ctg3{{$index}}" name="ctg3{{$index}}" ng-model="ctg3.checked" ng-click="categoryItemCheck($event, ctg3)">\r\n			    						<a href="#" ng-click="categoryItemClick($event, ctg3)">{{ctg3.ctgName}}<span class="count">({{ctg3.cnt | number}})</span></a>\r\n			    						<!-- 4뎁스 소카 -->\r\n			    						<ul class="cate_d4" ng-if="ctg3.subCtgLst && ctg3.subCtgLst.items && ctg3.subCtgLst.items.length > 0">\r\n					    					<li ng-repeat="ctg4 in ctg3.subCtgLst.items track by $index" id="ctg_{{ctg4.ctgNo}}"\r\n					    						data-name="{{ctg4.ctgName}}" data-no="{{ctg4.ctgNo}}" data-depth="3" data-tid="{{ctg4.tid}}"  \r\n					    						ng-class="{checked:ctg4.checked, chkopen:checkOpenCtgCd(ctg4)}">\r\n					    						<input type="checkbox" id="ctg4{{$index}}" name="ctg4{{$index}}" ng-model="ctg4.checked" ng-click="categoryItemCheck($event, ctg4)">\r\n					    						<a href="#" ng-click="categoryItemClick($event, ctg4)">{{ctg4.ctgName}}<span class="count">({{ctg4.cnt | number}})</span></a>\r\n					    						<!-- 5뎁스 세카 -->\r\n					    						<ul class="cate_d5" ng-if="ctg4.subCtgLst && ctg4.subCtgLst.items && ctg4.subCtgLst.items.length > 0">\r\n							    					<li ng-repeat="ctg5 in ctg4.subCtgLst.items track by $index" id="ctg_{{ctg5.ctgNo}}"\r\n							    						data-name="{{ctg5.ctgName}}" data-no="{{ctg5.ctgNo}}" data-depth="4"  \r\n							    						ng-class="{checked:ctg5.checked, nochild:!(ctg5.subCtgLst && ctg5.subCtgLst.items && ctg5.subCtgLst.items.length > 0)}">\r\n							    						<input type="checkbox" id="ctg5{{$index}}" name="ctg5{{$index}}" ng-model="ctg5.checked" ng-click="categoryItemCheck($event, ctg5)">\r\n							    						<a href="#" ng-click="categoryItemClick($event, ctg5)">{{ctg5.ctgName}}<span class="count">({{ctg5.cnt | number}})</span></a>\r\n							    					</li>\r\n					    						</ul>\r\n					    					</li>\r\n			    						</ul>\r\n			    					</li>\r\n	    						</ul>\r\n	    					</li>\r\n   						</ul>\r\n   					</li>\r\n   				</ul>\r\n   				<ul class="cate_d1 openable" ng-if="!srhResultData.ctgLst.items || srhResultData.ctgLst.items.length == 0">\r\n   					<li class="nochild">\r\n   						<a>해당하는 카테고리가 없습니다.</a>\r\n   					</li>\r\n		        </ul>\r\n   			</div>\r\n   			<!-- 02 CATEGORY -->\r\n   			\r\n   			<!-- 03 BRAND -->\r\n   			<div class="ssws_wrap ssws_brand" ng-show="searchUISetting.slide==\'brand\'" ng-if="uiStateObj.currentPageType==\'C\'">\r\n   				<ul ng-if="srhResultData.brdLst.items && srhResultData.brdLst.items.length > 0">\r\n                    <li class="sortopt_wrap">\r\n                    	<div>\r\n	                    	<div class="sortopt">\r\n	                    		<label for="brandsort2">가나다<input type="radio" id="brandsort2" name="brdSort" value="brdName" ng-model="uiStateObj.srhFilterBrdSort" ng-change="srhFilterBrdSortChange(\'brdName\')" /></label>\r\n	                    		<label for="brandsort1">상품수<input type="radio" id="brandsort1" name="brdSort" value="-cnt" ng-model="uiStateObj.srhFilterBrdSort" ng-change="srhFilterBrdSortChange(\'-cnt\')" /></label>\r\n	                    	</div>\r\n                    	</div>\r\n                    </li>\r\n                    <li class="selected_title">\r\n                    	<span class="title">선택한 브랜드 <span class="qty"><em>{{uiStateObj.brandArr.length}}</em>/{{srhResultData.brdLst.items.length}}개</span></span>\r\n                    </li>\r\n                    <li ng-if="uiStateObj.brandArr.length > 0" class="selected_item" ng-repeat="item in uiStateObj.brandArr | orderBy : uiStateObj.srhFilterBrdSort : brdName : -cnt">\r\n						<label for="brand_select{{$index}}">\r\n							{{item.brdName}}<span class="count">{{item.cnt | number}}</span>\r\n							<input type="checkbox" id="brand_select{{$index}}" name="brand_select{{$index}}" ng-click="triggerChkBrdPost(item)" ng-model="item.checked">\r\n						</label>\r\n                    </li>\r\n                    <li ng-repeat="item in srhResultData.brdLst.items | orderBy : uiStateObj.srhFilterBrdSort : brdName : -cnt">\r\n						<label for="brand{{$index}}" ng-class="{selected:postParams.brdNoArr.indexOf(item.brdNo) != -1}">\r\n							{{item.brdName}}<span class="count">({{item.cnt | number}})</span>\r\n							<input type="checkbox" id="brand{{$index}}" name="brand{{$index}}" ng-click="srhChkBrdPost(item)" ng-model="item.checked">\r\n						</label>\r\n                    </li>\r\n   				</ul>\r\n   				<ul ng-if="!srhResultData.brdLst.items || !srhResultData.brdLst.items.length">\r\n   					<li><a>해당하는 브랜드가 없습니다.</a></li>\r\n   				</ul>\r\n   			</div>\r\n   			<!-- 03 BRAND -->\r\n   			\r\n   			<!-- 04 PRICE -->\r\n   			<div class="ssws_wrap ssws_price" ng-show="searchUISetting.slide==\'price\'">\r\n   				<ul class="options openable" ng-class="{open:uiStateObj.priceOptionOpend}">\r\n                    <li ng-class="{open:uiStateObj.priceOptionOpend}">\r\n                    	<a class="instruct" href="#" ng-click="uiStateObj.priceOptionOpend=!uiStateObj.priceOptionOpend;uiStateObj.priceInputOpend=false;">가격대 선택</a>\r\n                    	<a class="handle" href="#" ng-click="uiStateObj.priceOptionOpend=!uiStateObj.priceOptionOpend;uiStateObj.priceInputOpend=false;">열기/닫기</a>\r\n                    </li>\r\n                    <li ng-show="uiStateObj.priceOptionOpend" class="sub" ng-class="{on:uiStateObj.priceTypeIdx== item.shortIdx}" ng-repeat="item in uiStateObj.priceTypeArr">\r\n                       	<label for="priceTypeDetail{{item.shortIdx}}">\r\n                       		{{item.label}}\r\n                       		<input type="radio" id="priceTypeDetail{{item.shortIdx}}" name="priceTypeDetail" value="{{item.value}}" ng-model="postParams.price" ng-change="srhPricePost(item)" />\r\n                       	</label>\r\n                    </li>\r\n                </ul>\r\n   				<ul class="price openable" ng-class="{open:uiStateObj.priceInputOpend}">\r\n   					<li ng-class="{open:uiStateObj.priceInputOpend}">\r\n   						<a class="subtitle" href="#" ng-click="uiStateObj.priceInputOpend=!uiStateObj.priceInputOpend;uiStateObj.priceOptionOpend=false;">가격 직접 입력</a>\r\n   						<a class="handle" href="#" ng-click="uiStateObj.priceInputOpend=!uiStateObj.priceInputOpend;uiStateObj.priceOptionOpend=false;">열기/닫기</a>\r\n   					</li>\r\n   					<li ng-show="uiStateObj.priceInputOpend" class="input_wrap">\r\n   						<div>\r\n		                    <span class="ipt ipt_min">\r\n		                        <input only-number="int" id="priceMinU" name="priceMinU" type="number" placeholder="{{srhResultData.price.min | number}}"\r\n		                              ng-model="postParams.priceMinUTemp"\r\n		                              ng-focus="postParams.priceMinUFocus = true"\r\n		                              ng-blur="postParams.priceMinUFocus = false; srhDetailPriceValidate(\'min\');"\r\n		                              min="{{srhResultData.price.min}}"\r\n		                              max="{{postParams.priceMaxUTemp}}"\r\n		                              ng-keyup="srhDetailPriceMaxlen(\'min\')"\r\n		                        /><!-- ng-keyup="srhDetailSearchActiveChk()" -->\r\n							    <span class="number_format"\r\n									ng-if="!postParams.priceMinUFocus && postParams.priceMinUTemp"\r\n									ng-click="srhFilterDetailPriceIpt(\'priceMinU\')">{{postParams.priceMinUTemp | number}}</span>\r\n		                    </span>\r\n		                    <span class="ipt ipt_max">\r\n		                        <input only-number="int" id="priceMaxU" name="priceMaxU" type="number" placeholder="{{srhResultData.price.max | number}}"\r\n		                              ng-model="postParams.priceMaxUTemp"\r\n		                              ng-focus="postParams.priceMaxUFocus = true"\r\n		                              ng-blur="postParams.priceMaxUFocus = false; srhDetailPriceValidate(\'max\')"\r\n		                              min="{{postParams.priceMinUTemp}}"\r\n		                              max="{{srhResultData.price.max}}"\r\n		                              ng-keyup="srhDetailPriceMaxlen(\'max\')"\r\n		                        /><!-- ng-keyup="srhDetailSearchActiveChk()" -->\r\n		                        <span class="number_format"\r\n									ng-if="!postParams.priceMaxUFocus && postParams.priceMaxUTemp"\r\n									ng-click="srhFilterDetailPriceIpt(\'priceMaxU\')">{{postParams.priceMaxUTemp | number}}</span>\r\n		                    </span>\r\n						</div>\r\n						<div class="button">\r\n							<button class="btn_search" ng-click="srhDetailSearchPrice(true)">검색</button>\r\n						</div>\r\n	                </li>\r\n   				</ul>\r\n   				<ul class="benefit">\r\n                    <li>\r\n						<label for="ssws_bendfit3">\r\n							무이자 할부\r\n							<input type="checkbox" id="ssws_bendfit3" name="ssws_bendfit3"\r\n									ng-model="postParams.freeInstYN"\r\n									ng-change="srhDetailChange(\'freeInstYN\')"\r\n									ng-true-value="\'Y\'" ng-false-value="\'N\'">\r\n						</label>\r\n                    </li>\r\n                    <li>\r\n						<label for="ssws_bendfit4">\r\n							포인트 적립\r\n							<input type="checkbox" id="ssws_bendfit4" name="ssws_bendfit4"\r\n									ng-model="postParams.pointYN"\r\n									ng-change="srhDetailChange(\'pointYN\')"\r\n									ng-true-value="\'Y\'" ng-false-value="\'N\'">\r\n						</label>\r\n                    </li>\r\n   				</ul>\r\n   			</div>\r\n   			<!-- 04 PRICE -->\r\n   			\r\n    		<!-- 05 DELIVERY -->\r\n			<div class="ssws_wrap ssws_delivery" ng-if="searchUISetting.slide==\'delivery\'">\r\n				<ul>\r\n					<li ng-if="searchUISetting.smartPickSub" ng-class="{opened:searchUISetting.smartPickList, disabled:!srhDetailData.srhTerms.smpickBranch || srhDetailData.srhTerms.smpickBranch.length < 1}">\r\n						<a href="#" ng-click="showHideDepartmentPick($event)">스마트픽 백화점 픽업</a>\r\n						<ul class="branches" id="smartPickBranchList" ng-if="searchUISetting.smartPickList && srhDetailData.srhTerms.smpickBranch && srhDetailData.srhTerms.smpickBranch.length > 0">\r\n							<li ng-class="{selected:postParams.smpBranchNo==\'\'}">\r\n								<a href="#" ng-click="smpickBranchChange({\'name\':\'전체\', \'branchNo\':\'\'})">전체</a>\r\n							</li>\r\n							<li ng-repeat="item in srhDetailData.srhTerms.smpickBranch" ng-class="{selected:postParams.smpBranchNo==item.branchNo}">\r\n								<a href="#" ng-click="smpickBranchChange(item)">{{item.name}}</a>\r\n							</li>\r\n						</ul>\r\n					</li>\r\n					<li ng-if="searchUISetting.smartPickSub" ng-class="{selected:postParams.smpickYN==\'Y\' || postParams.isCrsPickYn==\'Y\'}">\r\n						<label for="ssws_delivery12" ng-class="{selected:postParams.isCrsPickYn==\'Y\', disabled:!srhDetailData.srhTerms.seven}">\r\n									스마트픽 세븐일레븐 픽업\r\n									<input type="checkbox" id="ssws_delivery12" name="ssws_delivery12"\r\n											ng-model="postParams.isCrsPickYn"\r\n											ng-change="srhDetailChange(\'isCrsPickYn\')"\r\n											ng-true-value="\'Y\'" ng-false-value="\'N\'"\r\n											ng-disabled="!srhDetailData.srhTerms.seven">\r\n								</label>\r\n					</li>\r\n					<li>\r\n						<label for="ssws_delivery2" ng-class="{selected:postParams.isDlvToday==\'Y\', disabled:!srhDetailData.srhTerms.tdar}">\r\n							오늘도착\r\n							<input type="checkbox" id="ssws_delivery2" name="ssws_delivery2"\r\n									ng-model="postParams.isDlvToday"\r\n									ng-change="srhDetailChange(\'isDlvToday\')"\r\n									ng-true-value="\'Y\'" ng-false-value="\'N\'"\r\n									ng-disabled="!srhDetailData.srhTerms.tdar">\r\n						</label>\r\n					</li>\r\n					<li>\r\n						<label for="ssws_delivery3" ng-class="{selected:postParams.isDlvQuick==\'Y\', disabled:!srhDetailData.srhTerms.quick || !showQuick}">\r\n							퀵배송\r\n							<input type="checkbox" id="ssws_delivery3" name="ssws_delivery3"\r\n									ng-model="postParams.isDlvQuick"\r\n									ng-change="srhDetailChange(\'isDlvQuick\')"\r\n									ng-true-value="\'Y\'" ng-false-value="\'N\'"\r\n									ng-disabled="!srhDetailData.srhTerms.quick || !showQuick">\r\n						</label>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n			<!-- 05 DELIVERY -->\r\n				\r\n   			<!-- 06 COLOR -->\r\n   			<div class="ssws_wrap ssws_color" ng-show="searchUISetting.slide==\'color\'">\r\n   				<div ng-if="srhDetailData.srhColorList && srhDetailData.srhColorList.length > 0">\r\n    				<span class="instruct">※복수 선택이 가능합니다.</span>\r\n    				<div class="color_list">\r\n	    				<ul>\r\n	    					<li ng-repeat="item in srhDetailData.srhColorList" class="c{{item.colorCd}}" data-color-cd="{{item.colorCd}}"\r\n	    						ng-class="{on:item.selected}" ng-click="srhSelectColor(item)"><a href="#"></a></li>\r\n	    				</ul>\r\n    				</div>\r\n   				</div>\r\n   				<span class="instruct" ng-if="!srhDetailData.srhColorList || srhDetailData.srhColorList.length == 0">해당하는 컬러가 없습니다.</span>\r\n   			</div>\r\n   			<!-- 06 COLOR -->\r\n   		</div>\r\n	</div>\r\n</div>\r\n\r\n<!-- 정렬 안내 레이어 -->\r\n<div class="sortGuidePop" ng-show="tipShow">\r\n   	<div class="layerPop_dim" ng-click="showHideSortGuide()"></div>\r\n	<div class="layerPop" id="pop_sortGuide">\r\n		<div class="popWrap">\r\n			<p class="tlt">판매순이란?</p>\r\n			<p class="desc">최근 15일동안 많이 판매된 상품을 누적한 기준으로 상품을 정렬합니다.\r\n            <br>(단, 광고 상품은 별도기준에 따라 상단 정렬) \r\n            </p>\r\n		</div>							\r\n		<a class="btn_close" ng-click="showHideSortGuide()">닫기</a>\r\n	</div>\r\n</div>\r\n<!-- 정렬 안내 레이어 -->\r\n	\r\n<!-- SMART PICK STORE LIST -->\r\n<div ly-smpick class="ly_smpick" ng-if="uiStateObj.smpickLayerOpenFlag">\r\n    <div ly-cover class="cover" ng-click="lySmpickClose()"></div>\r\n    <div class="smpick_lst">\r\n        <header ly-cover><span class="tit">타이틀</span></header>\r\n        <div vertical-scroll-layer class="branch_wrap">\r\n            <ul id="branchLst">\r\n                <li><label for="smpick_lst0"><input type="radio" id="smpick_lst0" name="smpick_lst" value="" ng-model="postParams.smpBranchNo" ng-change="smpickBranchChange({\'name\':\'전체\', \'branchNo\':\'\'})" ng-click="lySmpickClose()" />전체</label></li>\r\n                <li ng-repeat="item in srhDetailData.srhTerms.smpickBranch">\r\n                	<label for="smpick_lst{{$index + 1}}">\r\n                		<input type="radio" id="smpick_lst{{$index + 1}}" name="smpick_lst"\r\n               				ng-value="item.branchNo" ng-model="postParams.smpBranchNo" ng-change="smpickBranchChange(item)" ng-click="lySmpickClose()" />\r\n                		{{item.name}}\r\n                	</label>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n        <div class="btn_wrap"><button class="btn_close" ng-click="lySmpickClose()">닫기</button></div>\r\n    </div>\r\n</div>\r\n<!-- SMART PICK STORE LIST -->\r\n</section>'),a.put("/lotte/resources_dev/search/products/planshop/planshop_list.html",'<div class="planshop_list_wrap"\r\n     ng-if="!visiblity&&planShopData.length"\r\n     ng-class="{single:planShopData.length==1}">\r\n    <div class="swiper" ng-init="defCon=planShopData.length<15?true:false">\r\n        <ul\r\n            hw-swipe\r\n            swipe-index="planshopSwpIdx"\r\n            swipe-total="planshopTotal"\r\n            infinity="{{defCon}}"\r\n            margin-right="{{marginright}}">\r\n            <!-- 최대 15개 -->\r\n            <li ng-repeat="item in planShopData | limitTo:14" idx="{{$index}}" ng-class="{single:planShopData.length==1}">\r\n                <div class="search_planshop_swipe_unit" ng-click="planProductsLink(item)">\r\n                    <div class="image">\r\n                        <figure><img ng-src="{{item.img_url}}" alt=""/></figure>\r\n                        <div class="flags flag" ng-if="item.isGiftPkg || item.dlv_fee_tp==\'Y\'||item.isdlex_free || item.is_dept || item.is_tvhome || item.is_himart || item.smartpick_yn==\'Y\'||item.issmart_pick || item.isDlvQuick || item.isDlvToday">\r\n                            <span class="flag depart" ng-show="item.flag==\'D\'||item.is_dept">롯데백화점</span>\r\n                            <span class="flag etv" ng-if="item.is_tvhome && !item.is_dept">롯데홈쇼핑</span>\r\n                            <span class="flag himart" ng-if="item.is_himart && !item.is_dept && !item.is_etv">하이마트</span>\r\n                            <span class="flag depart qk_free" ng-if="item.dlv_fee_tp==\'Y\'||item.isdlex_free">무료배송</span>\r\n                            <span class="flag depart gift_package" ng-if="item.isGiftPkg">선물포장</span>\r\n                            <span class="flag smart" ng-show="item.smartpick_yn==\'Y\'||item.issmart_pick">스마트픽</span>\r\n                            <!--span ng-if="rScope.showQuick" class="flag normal" ng-show="item.isDlvQuick">퀵</span-->\r\n                            <!--span class="flag normal" ng-show="item.isDlvToday">오늘도착</span!-->\r\n                        </div>\r\n                        <div class="floating_flags">\r\n                            <!-- L.Point flag -->\r\n                            <span class="lpoint_icon" ng-if="item.save_lpoint">\r\n                                <img src="http://image.lotte.com/lotte/images/mobile/MO_lpoint_logo2.png">\r\n                            </span>\r\n                            <!-- 명절 -->\r\n                            <!--span ng-if="item.goods_nm.indexOf(\'[설]\') > -1 || item.isHoliday" class="holiday_flag">명절상품</span-->\r\n                        </div>\r\n                    </div>\r\n                    <div class="goods_info">\r\n                        <span class="goods_name">\r\n                            {{item.brnd_nm?"["+item.brnd_nm+"] ":""}}{{item.goods_nm}}\r\n                        </span>\r\n                        <div class="info_detail">\r\n                            <span class="goods_price">\r\n                                {{(item.discounted_price||item.original_price ) | number }}\r\n                            </span>\r\n                            <span class="promotion_flag" ng-if="item.is_sale_promotion">~</span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class="btn_list_more" ng-if="$index==13&&planShopData.length>14" ng-click="more()">\r\n                    <div class="more_active_button">\r\n                        <p>모두<br/>보기</p>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n        <div class="planshop_prod_list_indicator" ng-if="planshopTotal>1">\r\n            <span><b>{{planshopSwpIdx+1}}</b>/{{planshopTotal}}</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
}]);