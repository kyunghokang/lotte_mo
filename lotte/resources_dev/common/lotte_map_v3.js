(function(window, angular, undefined) {
    'use strict';
    var map = angular.module('lotteMap', []);
    /**
     * 네이버맵 V3 지도로 스마트픽 위치 보기 컨트롤러
     */
    map.controller('MapInfoCtrl', ['$scope', '$http', 'LotteCommon', function($scope, $http, LotteCommon) {
        // 팝업 오픈 여부
        $scope.isOpenedMap = false;
        
        // 팝업 닫기
        $scope.$on('closeStoreMap', function(event, params) {
            $scope.isOpenedMap = false;
        });
        
        $scope.$on('showStoreMap', function(event, params) {            
            var scriptflag = false; 
            if($("#googlemap").length > 0){ //스크립트 중복로딩 방
                scriptflag = true;
            }
            $scope.store_map(
                    params.goods_no, 
                    scriptflag, 
                    params.entr_no, 
                    params.entr_contr_no, 
                    params.smp_ecoupon_yn
            );
        });
             
        $scope.store_map = function(goodsNo, isLoadScript, smpEtNo, smpEtContrNo, smpEcouponYn) {
            if (typeof isLoadScript != 'boolean' || isLoadScript === false) {
                LoadScript("https://openapi.map.naver.com/openapi/v3/maps.js?clientId=WY94ifCqxm6TqcDoTWKt&submodules=geocoder", function(){$scope.store_map(goodsNo, true, smpEtNo, smpEtContrNo, smpEcouponYn);});                
                return; 
            }            
            console.log('naver_map called!!');            
            $http.get(
                    LotteCommon.productMobileNaverMap, 
                    {
                        params: {
                            goods_no: goodsNo,
                            smp_entr_no: smpEtNo,
                            smp_entr_contr_no: smpEtContrNo,
                            smp_ecoupon_yn: smpEcouponYn
                        }
                    }
            )
            .success(function(data) {
                console.log('data Success!!');                
                $scope.naverStoreMapData = data.mobileNaverMap; /*상품기본정보 로드*/                
                var smpShopList = $scope.naverStoreMapData.smartpick_store_addr;
                if (smpShopList.total_count > 0) {                    
                    setTimeout(function(){
                      var map = new naver.maps.Map('map-canvas');
                      var myaddress = smpShopList.items[0].post_addr+ " " +smpShopList.items[0].dtl_addr;// 도로명 주소나 지번 주소                      
                       naver.maps.Service.geocode({address: myaddress}, function(status, response) {
                          var result = response.result;
                          var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
                          map.setCenter(myaddr); // 검색된 좌표로 지도 이동
                          // 마커 표시
                          var marker = new naver.maps.Marker({
                            position: myaddr,
                            map: map
                          });
                      });
                    }, 100); 
                    $scope.naverStoreName=smpShopList.items[0].shop_nm;
                    $scope.naverStoreAddr=smpShopList.items[0].post_addr+smpShopList.items[0].dtl_addr;                        
                }                
                $scope.isOpenedMap = true;
            })
            .error(function() {
                alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
                return;
            });
        };
        var LoadScript = function(src, callback, charset, defer, id) {
            if (typeof src != 'string' || src == undefined) return;
            
            var isLoaded= false;
            var head    = document.getElementsByTagName('head')[0]; 
            var script  = document.createElement('script');
            var charset = (charset && typeof charset == 'string') ? charset : 'UTF-8';
            
            if (id && typeof id == 'string' && id != ''){
                script.id = id;
            }
            script.id= "googlemap";
            script.src = src;
            script.charset = charset;
            script.type  = 'text/javascript';
            script.async = true;
            script.defer = (typeof defer == 'boolean') ? defer : true;
            
            if (typeof callback == 'function') {
                script.onreadystatechange = function() {
                    if (this.readyState == 'loaded' || this.readyState == 'complate') {
                        if (isLoaded) return;
                        window.setTimeout(callback(), 1);
                        isLoaded = true;                
                    }
                };
                script.onload = function() {
                    if (isLoaded) return;
                    window.setTimeout(callback(), 1);
                    isLoaded = true;
                };
            }   
            head.appendChild(script);
        };
    }]);
    
    /**
     * 네이버지도로 스마트픽 위치 보기 디렉티브
     */
    map.directive('mapInfo', function() {
        return {
            templateUrl : '/lotte/resources_dev/common/templates/map_info.html',
            replace : true,
            // TODO ywkang2 : 고립스코프로 변경해야함
//            scope: {
//          },
            link : function($scope, el, attrs) {
            },
            controller: 'MapInfoCtrl'
        };
    });
    
})(window, window.angular);