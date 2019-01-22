(function(window, angular, undefined) {
    'use strict';

    var unitModule = angular.module('lotteUnit', ['lotteUtil']);

    /* 일반 유닛 directive */
    unitModule.directive('commUnit', [function() {
        return {
            templateUrl: '/lotte/resources_dev/unit/comm_unit.html',
            replace: true,
            link:function($scope, el, attrs) {
                var curdispno = "";

                if (attrs.curdispno) {
                    curdispno = attrs.curdispno;
                }

                var curdispnosctcd = "";

                if (attrs.curdispnosctcd) {
                    curdispnosctcd = attrs.curdispnosctcd;
                }

                var tclick = "";

                if (attrs.tclick) {
                    tclick = attrs.tclick;
                }

                $scope.clickUnit = function() {
                    $scope.productView($scope.item, curdispno, curdispnosctcd, tclick);
                };
            }
        };
    }]);

    /* 기획전 전용 유닛(서프라이즈, 슈퍼찬스) */
    unitModule.directive('planUnit', function() {
        return {
            templateUrl: '/lotte/resources_dev/unit/plan_unit.html',
            replace: true,
            link:function($scope, el, attrs) {
                var curdispno = "";

                if (attrs.curdispno) {
                    curdispno = attrs.curdispno;
                }

                var curdispnosctcd = "";

                if (attrs.curdispnosctcd) {
                    curdispnosctcd = attrs.curdispnosctcd;
                }

                var tclick = "";

                if (attrs.tclick) {
                    tclick = attrs.tclick;
                }

                $scope.clickUnit = function() {
                    $scope.productView($scope.item, curdispno, curdispnosctcd, tclick);
                };
            }
        };
    });

    /* 딜형 유닛 type01 directive */
    unitModule.directive('commUnitDeal01', ['LotteLink', function(LotteLink) {
        return {
            templateUrl: '/lotte/resources_dev/unit/unit_deal_01.html',
            replace: true,
            link:function($scope, el, attrs) {
                var curdispno = "";

                if (attrs.curdispno) {
                	curdispno = attrs.curdispno;
                }

                var curdispnosctcd = "";

                if (attrs.curdispnosctcd) {
                	curdispnosctcd = attrs.curdispnosctcd;
                }

                var tclick = "";

                if (attrs.tclick) {
                    tclick = attrs.tclick;
                }
                $scope.clickUnit = function(reIdx) {
                    if ($scope.item.outlnk && $scope.item.outlnk != "") {
                        if ($scope.item.outlnkMall == "LECS") {
                            if(confirm("공식 온라인 몰로 이동 후 구입 할 수 있습니다.")) {
                                $scope.sendTclick(tclick); // lotte-comm.js  // TCLICK 수집
                                try { console.log("TCLICK : " + tclick); } catch (e) {}

                                LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                            }
                        } else {
                            $scope.sendTclick(tclick); // lotte-comm.js  // TCLICK 수집
                            try { console.log("TCLICK : " + tclick); } catch (e) {}
                            
                            LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                        }
                    } else {                    	
                    	/* unit tclick 조건 정의 수정 필요 */
                    	if($scope.cateDiv == "MIDDLE"){ //중카 
                    		tclick = "m_side_cate_catemid_" + $scope.item.curDispNo + "_unit" + $scope.$index;                    	
                    	}                    	
                    	if($scope.mainYn){ //메인 
                    		var unitIdx = reIdx;
                    		if(reIdx == undefined){
                    			unitIdx = ($scope.$index + 1);
                    		}
                    		tclick = $scope.tclickMainUnitStr + unitIdx; //reIdx : 상품은 배너와 상관없이 인덱스가 쌓인다. (배너는 전시번호로 넣는다)
                    	}
                    	$scope.productView($scope.item, curdispno, curdispnosctcd, tclick);
                    }
                };
            }
        };
    }]);

    /* Unit  Image Validate 성인상품 체크, 이미지 로드 오류 체크 */
    unitModule.directive('lotteUnit01ImgSrc', ['LotteCommon', function (LotteCommon) {
        return {
            link : function ($scope, el, attrs) {
                if ($scope.item.byrAgelmt == "19") { // 19세 상품 확인
                    attrs.$set("src", $scope.imgPath + "/lotte/mobile/sub/img_19_280x280.png");
                } else {
                    attrs.$set("src", attrs.lotteUnit01ImgSrc);
                }

                el.on("error", function (e) {
                    if (attrs.src != $scope.imgPath + "/lotte/images/common/product/no_280.gif") {
                        attrs.$set("src", $scope.imgPath + "/lotte/images/common/product/no_280.gif");
                    }
                });
            }
        }
    }]);

    /* 공통 유닛 type01 directive */
    unitModule.directive('commUnitType01', ['$http', 'LotteUtil', 'LotteCommon', 'LotteLink', 'LotteStorage', function ($http, LotteUtil, LotteCommon, LotteLink, LotteStorage) {
        return {
            templateUrl: '/lotte/resources_dev/unit/unit_type01.html',
            replace: true,
            link: function ($scope, el, attrs) {
                $scope.addWishFlag = false;

                var curdispno = "";

                if (attrs.curdispno) {
                    curdispno = attrs.curdispno;
                }

                var curdispnosctcd = "";

                if (attrs.curdispnosctcd) {
                    curdispnosctcd = attrs.curdispnosctcd;
                }

                var tclick = "";

                if (attrs.tclick) {
                    tclick = attrs.tclick;
                }

                $scope.clickUnit = function () {
                    if ($scope.item.outlnk && $scope.item.outlnk != "") {
                        if ($scope.item.outlnkMall == "LECS") {
                            if(confirm("공식 온라인 몰로 이동 후 구입 할 수 있습니다.")) {
                                $scope.sendTclick(tclick); // lotte-comm.js  // TCLICK 수집
                                try { console.log("TCLICK : " + tclick); } catch (e) {}

                                LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                            }
                        } else if ($scope.item.outlnkMall == "SP") {
                            if(confirm("롯데슈퍼로 이동후 구입할수있습니다.")) {
                                $scope.sendTclick(tclick); // lotte-comm.js  // TCLICK 수집
                                try { console.log("TCLICK : " + tclick); } catch (e) {}
                                LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                            }
                        }
                    } else {
                    	
                    	if($scope.mainYn){ //메인 
                    		tclick = $scope.tclickMainType01Str + ($scope.$index + 1);
                    	}
                        $scope.productView($scope.item, curdispno, curdispnosctcd, tclick);
                    }
                };

                $scope.clickComment = function () { // 상품 comment 이동
                    if ($scope.item.outlnkMall == "LECS") { // LECS 상품
                        if (confirm("공식온라인 몰로 이동후 확인 할 수 있습니다.")) {
                            LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                        }
                    } else if ($scope.item.outlnkMall == "SP") { // 롯데슈퍼 상품
                        if (confirm("롯데슈퍼로 이동후 확인 할 수 있습니다.")) {
                            LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                        }
                    } else {
                        LotteStorage.setSessionStorage('comment', 'ok');
                        $scope.clickUnit();
                    }
                };

                $scope.addWish = function (indexVal) { // 위시리스트 상품 담기
                    if ($scope.item.outlnkMall == "LECS") { // LECS 상품
                        if (confirm("공식온라인 몰로 이동후 담을 수 있습니다.")) {
                            LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                        }
                        return false;
                    } else if ($scope.item.outlnkMall == "SP") { // 롯데슈퍼 상품
                        if (confirm("롯데슈퍼로 이동후 담을 수 있습니다.")) {
                            LotteLink.goOutLink($scope.item.outlnk, $scope.item.outlnkMall);
                        }
                        return false;
                    }

                    if ($scope.addWishFlag) {
                        alert("이미 등록된 상품입니다.");
                        $scope.addWishFlag = true;
                        return false;
                    }

                    if (!$scope.loginInfo.isLogin) { // 로그인 안한 경우
                        alert('로그인 후 이용하실 수 있습니다.');
                        $scope.loginProc(); // go Login
                        return false;
                    } else {
                        if ($scope.item.byrAgelmt == 19) {
                            if ($scope.loginInfo.isAdult == "") { // 19금 상품이고 본인인증 안한 경우
                                alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
                                $scope.goAdultSci();
                                return false;
                            } else if (!$scope.loginInfo.isAdult) {
                                alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
                                return false;
                            }
                        }
                    };

                    $scope.sendProductWish($scope.item.goods_no, function (res) {
                        /**
                        1. 이미 등록된 상품입니다.
                        2. 선택하신 상품은 \n상품정보화면에서 담아주세요.
                        3. 죄송합니다. 품절된 상품입니다.
                        4. 죄송합니다. 판매종료된 상품입니다.
                        5. 위시리스트에 저장되었습니다.
                        6. 죄송합니다. 잠시 후 다시 이용해 주세요.
                        7. 죄송합니다. 품절된 상품입니다.
                        8. 죄송합니다. 잠시 후 다시 이용해 주세요.
                        9. 로그인 후 이용하실 수 있습니다.
                        **/
                        if (res) {
                            $scope.addWishFlag = true;
                            $('.wish')[indexVal].children[0].setAttribute('class','on')
                        } else {
                            $scope.addWishFlag = false;
                        }
                    });
                };
            }
        };
    }]);
})(window, window.angular);