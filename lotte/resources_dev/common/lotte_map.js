(function(window, angular, undefined) {
    'use strict';
    var map = angular.module('lotteMap', []);
    /**
     * google 지도로 스마트픽 위치 보기 컨트롤러
     */
    map.controller('MapInfoCtrl', ['$scope', '$http', 'LotteCommon', function($scope, $http, LotteCommon) {
        // 팝업 오픈 여부
        $scope.isOpenedMap = false;
        
        // 팝업 닫기
        $scope.$on('closeStoreMap', function(event, params) {
            $scope.isOpenedMap = false;
        });
        
        $scope.$on('showStoreMap', function(event, params) {
            //console.log($("#googlemap").length);
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
                LoadScript("http://maps.googleapis.com/maps/api/js?key=AIzaSyBsmhk0bJ_vPCFpG2JAcxmnLry_0wsLXHM", function(){$scope.store_map(goodsNo, true, smpEtNo, smpEtContrNo, smpEcouponYn);});
                
                return; 
            }            
            console.log('google_map called!!');            
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
                    //if(smpShopList.total_count == 1){
                        //한건일 경우 바로 지도 이미지 가져오기호출
                        //$scope.getMapPoint(smpShopList.items[0].post_addr+ " " +smpShopList.items[0].dtl_addr);
                    var value = smpShopList.items[0].post_addr+ " " +smpShopList.items[0].dtl_addr;
                    setTimeout(function(){
                      var mapLocation = new google.maps.LatLng('37.5675451', '126.9773356'); // 지도에서 가운데로 위치할 위도와 경도
                      //var mapLocation = new google.maps.LatLng(xpoint, ypoint); // 지도에서 가운데로 위치할 위도와 경도
                      var mapOptions = {
                         center: mapLocation, // 지도에서 가운데로 위치할 위도와 경도(변수)
                         disableDefaultUI: true,
                         zoom: 15, // 지도 zoom단계
                         mapTypeId: google.maps.MapTypeId.ROADMAP,
                         zoomControl: true
                      };                    
                      var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);  

                      var geocoder = new google.maps.Geocoder();
                      geocoder.geocode( {'address': value}, function(results, status) {                      
                        if (status == google.maps.GeocoderStatus.OK) {
                           var markers = new google.maps.Marker({
                                        map: map,
                                        icon: "http://static.naver.com/maps/ic_spot.png",
                                        title: $scope.naverStoreName,
                                        position: results[0].geometry.location
                                        });
                           // 주소가 하나일 경우 주소 중앙 셋팅
                           map.setCenter(markers.position);
                           map.setZoom(15);
                        } else {
                          //markers[crspk_idx] = null;
                          console.log("주소검색에 실패하였습니다.");
                        }
                      });                                          
                    }, 10);                    
                        $scope.naverStoreName=smpShopList.items[0].shop_nm;
                        $scope.naverStoreAddr=smpShopList.items[0].post_addr+smpShopList.items[0].dtl_addr;                        
                    //}else if(smpShopList.total_count >  1){
                        
                    //}
                } else {
//                  alert('조회된 매장이 없습니다.');
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