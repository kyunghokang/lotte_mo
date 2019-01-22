(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteSlider'
	]);

	app.controller('CateBeautyCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', 'LotteStorage', 'LotteCommon', 'commInitData', function($window, $location ,$http, $scope, $timeout, LotteStorage, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.screenID = 'BeautyCateTpl';
		$scope.pageLoading = true; //페이지 첫 로딩
		$scope.subTitle = '';
		$scope.Math = Math;
		$scope.tclick = $scope.tClickBase+$scope.screenID;
		$scope.no1PopFlag = false;

		/*
		 * 스크린 데이터 초기화
		 */
		$scope.screenDataReset = function() {
			$scope.screenData = {
				rankingPage: 1, //랭킹존
				isRanking: true, //랭킹존 더볼 상품 있음
				disp_name: null,
				disp_no: '5537279',
				idx: '',
				smallCateImg: [],
				mainBn: [],
				movPlan: [],
				timePlan: [],
				ranking: [],
				rankingPrd: [],
				prdReview: [],
				newPrdList: [],
				mdTip: [],
				bnList: [], //배너(선물하기, 이벤트)
				dealPrd: [],
				smallCate: [],
				no1Pop: []
			}
		};
		$scope.screenDataReset();
		
		/* 화면에 필요한 인자값 세팅 */
		if(commInitData.query['curDispNo'] != undefined) {
			$scope.screenData.disp_no = commInitData.query['curDispNo'];
		}
		if(commInitData.query['idx'] != undefined) {
			$scope.screenData.idx = commInitData.query['idx'];
		}
		$scope.curDispNoSctCd = 65;//전시유입코드
		/*
		 * 스크린 데이터 로드
		 */
		$scope.loadScreenData = function() {
			$scope.productListLoading = true;
			$http.get(LotteCommon.cateMidBeautyData)
			.success(function(data) {
				data = data.beautyList;
				/* 세션 */
				$scope.subTitle = $scope.screenData.disp_name = data.disp_nm;
				$scope.screenData.smallCateImg = data.small_cate_img.items;
				$scope.screenData.timePrd = data.time_prd;
				$scope.screenData.mainBn = data.main_banner_list.items;
				$scope.screenData.movPlan.push(data.mov_plan1);
				$scope.screenData.movPlan.push(data.mov_plan2);
				$scope.screenData.timePlan = data.time_plan;
				$scope.screenData.ranking = data.ranking.items;
				$scope.screenData.tester = data.tester;
				$scope.screenData.beautyNo1 = data.beauty_NO1;
				$scope.screenData.prdReview = data.prd_review;
				$scope.screenData.newPrdList = data.new_prd_list;
				$scope.screenData.mdTip.push(data.md_tip1);
				$scope.screenData.mdTip.push(data.md_tip2);
				$scope.screenData.dealPrd = data.deal_prd.items;
				$scope.screenData.bnList.push(data.top_banner_promotion);
				$scope.screenData.bnList.push(data.banner_promotion);
				$scope.screenData.bnList.push(data.banner_gift);
				$scope.screenData.bnList.push(data.banner_evt);
				
				$scope.productListLoading = false;
				$scope.pageLoading = false;
				//테스터 날짜
				if($scope.screenData.tester.test_list.items!=null){
					var tst=$scope.screenData.tester.test_list.items;
					for(var i=0;i<tst.length;i++){
						if(tst[i].mast_evt_no=='L103568'){
							tst[i].evt_dtime_str=tst[i].evt_dtime_str.replace(/~\d{4}./,' ~ ');
						}
					}
				}
				$scope.rankingPrdNum();//랭킹존 상품 초기화
			}).error(function(data) {
				$scope.pageLoading = false;
				$scope.productListLoading = false;
			});
		}
		//랭킹존 상품개수
		$scope.rankingPrdNum = function(){
			var page = $scope.screenData.rankingPage, rankingIdx = page*4, len = $scope.screenData.rankingPrd.length;
			for(var i=len; i<rankingIdx; i++){
				if(i>=$scope.screenData.ranking.length){
					$scope.screenData.isRanking = false;
					break;
				}else $scope.screenData.rankingPrd.push($scope.screenData.ranking[i]);
			}
		}

		// 세션에서 가저올 부분 선언 
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if(StoredLoc == window.location.href && $scope.locationHistoryBack && StoredDataStr != null) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;

			$scope.screenData = StoredData.screenData;
			$scope.subTitle = $scope.screenData.disp_name;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);
		} else {
			$scope.loadScreenData();
		}
		
		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			sess.screenData = angular.copy($scope.screenData);
			if (!commInitData.query.localtest && $scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});
		
		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

	}]);

	app.directive('lotteContainer', ['$timeout', 'LotteCommon', 'LotteLink', 'LotteScroll', function($timeout, LotteCommon, LotteLink, LotteScroll) {
		return {
			templateUrl : '/lotte/resources_dev/category/m/cate_beauty_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				//o'clock 시간
				if($scope.screenData.timePlan!=null){
					var tmpT = new Date();
					tmpT.setDate(tmpT.getHours() >= 10 ? tmpT.getDate()+1:tmpT.getDate());
					tmpT.setHours(10,0,0,0);
					var endTime = tmpT.getTime();
					var oTimer = setInterval(function(){
						var remainT = endTime-new Date().getTime(), oStr = '';
						if(remainT < 10){
							clearInterval(oTimer);
							oStr = '00:00:00';
						}else{
							var hour = Math.floor(remainT / 60 / 60 / 1000);
							var min = Math.floor(remainT / 60 / 1000) % 60;
							var sec = Math.floor(remainT / 1000) % 60;
							hour < 10 ? oStr += '0' + hour + ':' : oStr += hour + ':';
							min < 10 ? oStr += '0' + min + ':' : oStr += min + ':';
							sec < 10 ? oStr += '0' + sec : oStr += sec;
						}
						$('#time_num').text(oStr);
					},1000);
				}
				//카테고리 클릭
				$scope.subCateClk = function(item,type) {

					if(item.link_url != '#' && item.link_url != ''){
						var url = item.link_url;
						linkUrl(url,'_catesmall_'+type+'5556743');
					}else{
						$scope.cateDepth1 = '';
						for(var i=0; i<$scope.sideCtgData.ctgAll.length; i++){
							for(var k=0; k < $scope.sideCtgData.ctgAll[i].lctgs.length; k++){
								if($scope.sideCtgData.ctgAll[i].lctgs[k].name == $scope.subTitle){
									$scope.cateDepth1 = $scope.sideCtgData.ctgAll[i].name;
									break;
								}
							}
						}
						
						var url = LotteCommon.cateProdListUrl+'?curDispNo='+item.disp_no+'&cateDiv=MIDDLE&idx='+$scope.screenData.idx+'&mGrpNo='+item.mgrp_no+'&curDispNo2='+$scope.screenData.disp_no+'&cateDepth1='+$scope.cateDepth1+'&cateDepth2='+$scope.subTitle+'&title='+encodeURIComponent(item.disp_nm)+'&curDispNoSctCd=65';
						if(item.sort != undefined){
							url += '&sort=' + item.sort;
						}
						linkUrl(url,'_catesmall_'+type+item.disp_no);
					}
				}
				// 타임특가
				$scope.timePrdClk = function(no){
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_timesale_T01');
				}
				// 동영상 재생 TCLICK 처리
				$scope.movPlay = function(){
					var tclick = $scope.tclick+'_Clk_Video_play';
					$scope.sendTclick(tclick);
				}
				// 동영상 일시정지 TCLICK 처리
				$scope.movPause = function(){
					var tclick = $scope.tclick+'_Clk_Video_pause';
					$scope.sendTclick(tclick);
				}
				// 동영상 volume TCLICK 처리
				$scope.movVolume = function(id){
					var tclick = $scope.tclick+ ($('#'+id).hasClass('mute') ? '_Clk_Video_vol' : '_Clk_Video_mute');
					$scope.sendTclick(tclick);
				}
				// 동영상 전체보기 TCLICK 처리
				$scope.movFull = function(){
					var tclick = $scope.tclick+'_Clk_Video_full';
					$scope.sendTclick(tclick);
				}
				// 동영상 상세보기 링크
				$scope.movLnk = function(link,tclick){;
					linkUrl(link,'_Clk_Video_'+tclick);
				}
				//메인배너 클릭
				$scope.mainBnClk = function(link,idx){
					linkUrl(link,'_Clk_Ban_A0'+idx);
				}
				//oclock 클릭
				$scope.oclockClk = function(no,idx){
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_Ban_B0'+idx);
				}
				//랭킹존 더보기 클릭
				$scope.moreRanking = function(){
					$scope.screenData.rankingPage++;
					$scope.rankingPrdNum();
					var tclick = $scope.tclick+'_Clk_Btn01';
					$scope.sendTclick(tclick);
				}
				
				//테스터 신청하기 클릭
				$scope.tstEvtClk = function(no,idx){
					var url = LotteCommon.beautyEvtTester+'?evtNo='+no;
					linkUrl(url,'_Clk_Tst_idx0'+idx,1);
				}
				//상품평 이벤트 보기 클릭
				$scope.rvwEvtClk = function(no,idx){
					var url = LotteCommon.beautyEvtReview+'?evtNo='+no;
					linkUrl(url,'_Clk_Rvw_idx0'+idx);
				}
				//상품평쓰기 클릭
				$scope.myReviewClk = function(){
					var url = LotteCommon.mylotteCritViewUrl;
					linkUrl(url,'_Clk_Btn02');
				}
				//응모/당첨확인 클릭
				$scope.myEventClk = function(){
					var url = LotteCommon.eventGumeUrl;
					linkUrl(url,'_Clk_Btn03');
				}
				//이벤트 스와이프
				$scope.evtSwipeEnd = function(e){
					var tclTxt='_Swp_Rvw_idx0';
					if($scope.screenData.tester.test_list.items[e.idx].mast_evt_no=='L103568') tclTxt='_Swp_Tst_idx0';
					$scope.sendTclick($scope.tclick+tclTxt+(e.idx+1));
				}
				//뷰티넘버원 페이스북 바로가기
				$scope.facebookLnk = function(){
					var url = 'https://www.facebook.com/lottebeauty';
					LotteLink.goOutLink(url);
					$scope.sendTclick($scope.tclick+'_Clk_Btn05');
				}
				//뷰티넘버원 스와이프
				$scope.btSwipeEnd = function(e){
					$scope.sendTclick($scope.tclick+'_Swp_Ban_A'+(e.idx+1));
				}
				//뷰티넘버원 배너 클릭
				$scope.facebookPop = function(item,idx){
					$scope.screenData.no1Pop = item;
					$scope.dimmedOpen({
						target: "no1Pop",
						callback: this.no1Close
					});
					$scope.sendTclick($scope.tclick+'_Clk_Ban_I'+idx);
					$scope.no1PopFlag = true;
				}
				//뷰티넘버원 팝업 닫기
				$scope.no1Close = function(){
					$scope.no1PopFlag = false;
					$scope.dimmedClose();
				}
				//뷰티넘버원 팝업 이미지 스와이프
				$scope.no1ImgSwipeEnd = function(e){
					$scope.sendTclick($scope.tclick+'_Swp_Ban_B'+(e.idx+1));
				}
				//뷰티넘버원 팝업 상품 클릭
				$scope.no1PrdClk = function(no,idx){
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_Prd_F'+idx);
					$scope.no1Close();
				}
				//후기 클릭
				$scope.rvClk = function(e,no,idx){
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_Review_'+e+'_idx0'+idx);
				}
				//신규상품 클릭
				$scope.newPrdClk = function(no,idx){
					idx<10?idx='0'+idx:idx;
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_Prd_B'+idx);
				}
				//MD's tip 클릭
				$scope.mdBnClk = function(link,list){
					list==0 ? list='D01':list='E01';
					linkUrl(link,'_Clk_Ban_'+list);
				}
				$scope.mdPrdClk = function(no,idx,list){
					list==0 ? list='D0':list='E0';
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_Prd_'+list+idx);
				}
				//빅딜 클릭
				$scope.dealPrdClk = function(no,idx){
					var url = LotteCommon.prdviewUrl+'?goods_no='+no;
					linkUrl(url,'_Clk_Bigdeal_idx0'+idx);
				}
				//빅딜 더보기(메인 빅딜 탭 명품화장품 탭으로 이동)
				$scope.moreDeal = function(){
					$scope.clearSessionStorage();
					
					var url = LotteCommon.mainUrl+'?dispNo=5571899'
					linkUrl(url,'_Clk_Btn04');
				}
				//광고 클릭
				$scope.bnLink = function(link,tclick){
					linkUrl(link,tclick);
				}
				function linkUrl(url,tclick,login){
					if(url.indexOf('?')>-1) url += '&'+$scope.baseParam+'&tclick='+$scope.tclick+tclick;
					else url += '?'+$scope.baseParam+'&tclick='+$scope.tclick+tclick;
					if(login!=null){
						if (!$scope.loginInfo.isLogin){
							url = LotteCommon.loginUrl + "?" + $scope.baseParam+'&fromPg=0'+"&targetUrl=" + encodeURIComponent(url,'UTF-8');
						}
					}
					location.href = url;
				}
			}
		};
	}]);

	// 동영상 포스트컷(스냅샷) - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoPoster', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoPoster) {
					angular.element(element).attr("poster", attrs.videoPoster);
				}
			}
		};
	}]);

	// 동영상 주소 - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoSource', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoSource) {
					angular.element(element).attr("src", attrs.videoSource);
				}
			}
		};
	}]);

})(window, window.angular);