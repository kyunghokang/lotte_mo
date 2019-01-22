(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'angular-carousel'
    ]);

    app.controller('instagramListCtrl', ['$scope', '$window', '$http', 'LotteCommon', function ($scope, $window, $http, LotteCommon) {
        $scope.ajaxLoadFlag = false;
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "DearPetgram"; // 서브헤더 타이틀
        $scope.screenID = "인스타그램 피드 컨텐츠 페이지"; // 스크린 아이디
        $scope.pageLoading = true; // 페이지 로딩중 여부 Flag
        $scope.productListLoading = false; // 페이지 더 불러오기 로딩중 Flag
        
        /********************************************
         * Util Func.
         ********************************************/
        // URL에 Base Parameter 추가
        function setBaseParameter(href) {
            href = (href + "").indexOf("?") > -1 ? href : href + "?";

            if (href.substring(href.length - 1, href.length) != "?") {
                href += "&";
            }

            return href + $scope.baseParam;
        }
        
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0, // 인스타그램 페이징
                goodsPage: 0, // 상품정보 페이징
        		pageSize: 5,
        		pageEnd: false,
                tocken: "1168706956.360887b.6059697a811e486580628a071b04d523", /* Access Tocken 입력 */
                cliientId: "360887b5534c4842a7f6c81353ad2ad1",
                dispNoCode: [],
                instaData: {}, // 인스타그램 Data 초기화
                goodsData: {}, // 상품정보 Data 초기화
                instaText: [], // 인스타 엔터 변환 텍스트 초기화
                tclickIndex: [] // 티클릭 index
        	}
        })();

        //해시태그 명으로 가져올 경우
        var nextURL = "https://api.instagram.com/v1/tags/dearpet/media/recent?count="+ $scope.screenData.pageSize + "&access_token=" + $scope.screenData.tocken + "&callback=JSON_CALLBACK";
        //계정 명으로 가져올 경우
        //var nextURL = "https://api.instagram.com/v1/users/self/media/recent?count="+ $scope.screenData.pageSize + "&access_token=" + $scope.screenData.tocken + "&callback=JSON_CALLBACK";

        var tclickIndex = 0;

        $scope.loadData = function (page) {
            if($scope.ajaxLoadFlag){ return false; }

            $scope.ajaxLoadFlag = true;

            if (nextURL.indexOf('undefined') == -1 ) { // 추가 로드가 있는지 판단
                $http.jsonp(nextURL)
                .success(function (response) {

                    if ($scope.screenData.page == 0) { // 페이징 첫번째일 경우
                        $scope.screenData.instaData = response.data;
                    }else{
                        $scope.productListLoading = true;
                        $scope.screenData.instaData = $scope.screenData.instaData.concat(response.data);
                    }

                    var goodsSliceData = []; // 상품번호 배열 초기화


                    if ( response.data.length > 0 ) {
                        var i = 0,
                            j = 0,
                            k = 0;

                        for(i; i < response.data.length; i++) {
                            goodsSliceData[k] = []; // 각 순서에 상품번호 배열 초기화
                            var tmpArr = [];

                            $scope.screenData.instaText[i] = response.data[i].caption.text.replace(/\n/gi,'<br/>');
                            response.data[i].caption.text = $scope.screenData.instaText[i];


                            for (j = 0; j < response.data[i].tags.length; j++) {

                                if (response.data[i].tags[j].indexOf('상품번호') != -1) {
                                    tmpArr.push(response.data[i].tags[j].replace(/상품번호/g,""));
                                }
                            }

                            if (tmpArr.length == 0) { // 상품번호 없을경우 인스타 피드 갯수와 매칭시키기 위해 빈값 추가
                                tmpArr.push("0");
                            }
                            goodsSliceData[k] = tmpArr.join(",");
                            k++;
                        }  
                    }

                    if (response.meta.code == "200") {
                        $scope.screenData.page++;
                        nextURL = response.pagination.next_url + "&callback=JSON_CALLBACK";
                    }

                    $scope.screenDataReset.dispNoCode = goodsSliceData;
                })
                .finally(function () {
                   $scope.goodsData();
                });
            }else{
                $scope.productListLoading = false;
                $scope.screenData.pageEnd = true;
                console.info('::::: 추가페이지 없음 :::::');
            }
        };
        $scope.loadData();

        var tmpIdx = 1;
        var loadItemCnt = 0;

        // 상품정보 불러오기
        $scope.goodsData = function() {
            $scope.productListLoading = true;

            var goodsUrl = LotteCommon.instagramGoodsData;
            $http({
                method: 'POST',
                url: goodsUrl,

                //data: {goodsArr: ["264860155,264525455", "0", "264525455,264860155"]}
                data: {goodsArr: $scope.screenDataReset.dispNoCode}
            })
            .success(function (response){
                for (var i = 0; i < response.max.length; i++) {
                    if ($scope.screenData.instaData[loadItemCnt]) {
                        $scope.screenData.instaData[loadItemCnt].goodsData = response.max[i].items;

                        if (response.max[i].items && response.max[i].items.length > 0) {
                            $scope.screenData.instaData[loadItemCnt].tabIdx = tmpIdx;
                            tmpIdx++;
                        }
                        loadItemCnt++;
                    }
                }

                $scope.pageLoading = false;
                $scope.productListLoading = false;
            })
            .error(function () {
                console.info('상품 데이터 연동 오류');
                $scope.pageLoading = false;
                $scope.ajaxLoadFlag = false;
            })
            .finally(function () {
                $scope.screenData.goodsPage++;
                $scope.ajaxLoadFlag = false;
            });
        }

        // 배너 일반/아웃 링크 처리
        $scope.linkUrl = function (url, outlinkFlag, tclick, addParams) {
           
            if (outlinkFlag) {
                $scope.sendOutLink(url); // 외부 링크 보내기 (새창)

                if (tclick) { // tclick이 있다면
                    $scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
                }
            } else {
                var url = setBaseParameter(url) ; // 링크 url에 base parameter를 붙여준다.

                if (addParams) { // 추가 파라메타가 있다면
                    angular.forEach(addParams, function (val, key) {
                        url += "&" + key + "=" + val;
                    });
                }

                if (tclick) { // tclick 이 있다면 url 뒤에 parameter를 추가한다.
                    url += "&tclick=" + tclick;
                }

                if ( (url + "").indexOf('main_phone.do?dispNo=') != -1 ) { // 링크 메인탭 이동시 url 변경이 한번 된 후 는 이동이 안되는 현상 예외처리
                    if(tclick){
                        $scope.sendTclick(tclick);
                    }
                    
                    var disp_no_start = url.indexOf('dispNo=') + 7;
                    var header_menu_dispno = url.substr(disp_no_start, 7);
                    $scope.headerMenuClick(header_menu_dispno);
                } else {
                    window.location.href = url; // url 이동
                }
            }
        };
    }]);

    app.directive('lotteContainer', ['LotteCommon', 'commInitData', function (LotteCommon, commInitData) {
        return {
            templateUrl : '/lotte/resources_dev/instagram/instagram_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                var $cont = angular.element("body")[0];

                $scope.instaCommentMore = function(idx) { // 더보기 버튼
                   $scope.screenData.instaData[idx].more_open = $scope.screenData.instaData[idx].more_open ? false : true;
                }

                $scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
                    if($scope.screenData.pageEnd===true){ return; }
                    if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
                        $scope.productListLoading = true;
                        $scope.loadData();
                    }
                });

                //링크 이동 : 티클릭조함
                $scope.gotoLinkM = function(link, tclick_b, index, infoFlag, item){

                    var tclick = "m_DC_SpeDisp2_Clk_Prd_" + tclick_b;
                    if(index!=null){
                        if(index < 10){
                            tclick = tclick + "0" + index;
                        }else{
                            tclick = tclick + index;
                        }
                    }

                    if(item != null){ //상세 
                        link =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no;
                    }
                    // $window.location.href = link + "&tclick=" + tclick;
                    var params = {};

                    // LotteLink.goLink(link, $scope.baseParam, params);
                    $scope.linkUrl(link, false, tclick, params);
                };
            }
        };
    }]);

})(window, window.angular);