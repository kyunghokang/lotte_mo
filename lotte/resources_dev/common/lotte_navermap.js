(function(window, angular, undefined) {
    'use strict';
    var naverMap = angular.module('lotteNaverMap', []);
    /**
     * 네이버지도로 스마트픽 위치 보기 컨트롤러
     */
    naverMap.controller('NaverMapInfoCtrl', ['$scope', '$http', 'LotteCommon', function($scope, $http, LotteCommon) {
        // 팝업 오픈 여부
        $scope.isOpenedNaverMap = false;
        
        // 팝업 닫기
        $scope.$on('closeNaverStoreMap', function(event, params) {
            $scope.isOpenedNaverMap = false;
        });
        
        $scope.$on('showNaverStoreMap', function(event, params) {
            $scope.naver_store_map(
                    params.goods_no, 
                    false, 
                    params.entr_no, 
                    params.entr_contr_no, 
                    params.smp_ecoupon_yn
            );
        });
        
         //지점 담을 변수 대카 중카 소카 
        $scope.regionName0st = [];
        $scope.regionName1st = [];
        $scope.regionName2st = [];
        $scope.regionStoreList = [];
        $scope.naverStoreName;
        $scope.naverStoreAddr;
        
//        $("#mapContainer").empty();
        
        $scope.naver_store_map = function(goodsNo, isLoadScript, smpEtNo, smpEtContrNo, smpEcouponYn) {
            if (typeof isLoadScript != 'boolean' || isLoadScript === false) {
                LoadScript("http://map.naver.com/js/naverMap.naver?key=956f6f619b13d3caf5540349078f9593", function(){$scope.naver_store_map(goodsNo, true, smpEtNo, smpEtContrNo, smpEcouponYn);});
                return; 
            }
            
            console.log('naver_store_map called!!');
            
            $scope.isNaverStoreMapData = false;
//          $scope.reqParam.goods_no = goodsNo;
//          $scope.reqParam.smp_entr_no = smpEtNo;
//          $scope.reqParam.smp_entr_contr_no = smpEtContrNo;
//          $scope.reqParam.smp_ecoupon_yn = smp_ecpn_yn;
            
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
                console.log('naver_store_map Success!!');
                
                $scope.naverStoreMapData = data.mobileNaverMap; /*상품기본정보 로드*/
                $scope.isNaverStoreMapData = true;
                
                var smpShopList = $scope.naverStoreMapData.smartpick_store_addr;
                var separator = $scope.naverStoreMapData.separator;
                var currentOptionValue = "";
                var totalLocCnt = 0;
                var currentLocalShopCode = "0";
                var Smartpick_region = $scope.naverStoreMapData.smartpick_region;
                
                $scope.regionName0st = Smartpick_region;
                
                console.log('smpShopList.total_count', smpShopList.total_count);
                
                if (smpShopList.total_count > 0) {
                    if(smpShopList.total_count == 1){
                        console.log('Smartpick_region',Smartpick_region[0]);
                        console.log('smpShopList',smpShopList.items[0]);
                        
                        //한건일 경우 바로 지도 이미지 가져오기호출
                        //smpShopList.get(i).getPostAddr()+ " " +smpShopList.get(i).getDtlAddr()
                        $scope.getMapPoint(smpShopList.items[0].post_addr+ " " +smpShopList.items[0].dtl_addr);
                        $scope.naverStoreName=smpShopList.items[0].shop_nm;
                        $scope.naverStoreAddr=smpShopList.items[0].post_addr+smpShopList.items[0].dtl_addr;
                        
                    }else if(smpShopList.total_count >  1){
                        var smpShopListItems = $scope.naverStoreMapData.smartpick_store_addr.items;
                        
                        if(smpShopList != null && smpShopList.total_count > 0){
                            currentLocalShopCode = smpShopList.items[0].shop_no;
                        }
                        
                        /** 기본 업체 지점 Select Box 영역 문자열 생성 */
                        if(smpShopListItems != null && smpShopListItems.length >0){
                            for(var i=0; i<smpShopListItems.length; i++){
                                var localShopCode = smpShopListItems[i].shop_no;
                                var localAddress = smpShopListItems[i].post_addr+ " " +smpShopListItems[i].dtl_addr;
                                var localShopName = smpShopListItems[i].shop_nm;
                                var localPhoneNo = smpShopListItems[i].asgd_phon;
                                var optionValue = localShopCode + separator + localShopName.replace("\"", "\\\"") + separator + localAddress.replace("\"", "\\\"") + separator + localPhoneNo.replace("\"", "\\\"");
                                
                                /* 화면에 출력할 지점 정보 생성 */
                                if( currentLocalShopCode.length==0 && currentOptionValue.length==0 ) {
                                    currentOptionValue = optionValue;
                                }

                                /* Map URL Copy를 위한 Select box 선택 정보 생성 */
                                if( currentLocalShopCode == localShopCode ) {
                                    currentOptionValue = optionValue;
                                }           
                            }
                        }
                    }
                } else {
//                  alert('조회된 매장이 없습니다.');
                }
                
                $scope.isOpenedNaverMap = true;
            })
            .error(function() {
                alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
                return;
            });
        };
        
        //지도가져오기
        $scope.getMapPoint = function(value){
            console.log('getMapPoint', value);
            var address = "";
            address = value.replace(/ /g,"");
            address = value.replace(/\s/g,"");
            var map_link_url = LotteCommon.naverMapInfo + "?query=" + address;
            console.log('map_link_url',map_link_url);
            $http.get(map_link_url)
            .success(function(data) {
                var pointText = data;
                    var xpoint = pointText.substring(pointText.indexOf('<x>')+3,pointText.indexOf('</x>'));
                    var ypoint = pointText.substring(pointText.indexOf('<y>')+3,pointText.indexOf('</y>'));
//                    var xpoint = 315219;
//                    var ypoint = 544611;
                    console.log('xpoint',xpoint);
                    console.log('ypoint',ypoint);
                    $scope.mapScriptLoad();
                    $scope.display_marker('1',xpoint,ypoint);
            })
            .error(function() {
                console.log('getMapPoint : Download 실패');
                $scope.display_marker('1',309967,551771);
               // alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
            }); 

        };
        
        var MARKER_KEY = "marker";
        var iconcenter = "http://static.naver.com/maps/ic_spot.png";
        var latlng = "";
        var mapObj;
        
        var zoom;
        
        var centermarker;
        
        $scope.mapScriptLoad = function(){
            
            mapObj = new NMap(document.getElementById("mapContainer"),313,290);
            zoom =new NZoomControl();
            zoom.setAlign("right");
            zoom.setValign("top");
            mapObj.addControl(zoom);
            //지도를 휠로 조절한다.
            mapObj.enableWheelZoom();
            //지도 가운데 이미지 마커를 표시함.
            
            NEvent.addListener(mapObj,"endDrag",$scope.senddraged);
        };
        
        $scope.display_marker = function(recordUser,recordLat,recordLon) {
            //clearMarkers();//마크 텍스트 박스 삭제
            mapObj= new NMap(document.getElementById("mapContainer"));
            
            mapObj.clearOverlays(MARKER_KEY);//마크 텍스트 박스 삭제
            var new_marker_point  = new NPoint(recordLat,recordLon);        
            var new_marker_map  = new NPoint(parseInt(recordLat)+10,parseInt(recordLon)+30);
            //TM128 좌표를 경위도 좌표로 변환한다.
            latlng = mapObj.fromTM128ToLatLng(new_marker_point);
            //지도 가운데 이미지 마커를 표시함.
            var marker = new NMark(latlng, new NIcon(iconcenter,new NSize(52,41),new NSize(14,40)));
            $scope.centerDispMarker(latlng);
            //입력좌표 지도로 이동합니다.
            mapObj.setCenterAndZoom(new_marker_point,2);
        };
        
        //마커를 모두 삭제 합니다.
        $scope.clearMarkers = function() {
            mapObj.clearOverlays(MARKER_KEY);
        }
        
        //신규 마커이미지 여러개를 표시합니다.
        $scope.display_marker_list= function(recordUser,recordLat,recordLon) {
            var new_marker_point  = new NPoint(recordLat,recordLon);
            //TM128 좌표를 경위도 좌표로 변환한다.
            latlng = mapObj.fromTM128ToLatLng(new_marker_point);
            //지도 가운데 이미지 마커를 표시함.
            var marker = new NMark(latlng, new NIcon(iconcenter,new NSize(52,41),new NSize(14,40)));
            centerDispMarker(latlng);
            //입력좌표 지도로 이동합니다.
            mapObj.setCenterAndZoom(new_marker_point,2);
        }  
        
        //센터 위치에 마커 표시
        $scope.centerDispMarker = function(latlng){
            centermarker = new NMark(latlng,new NIcon(iconcenter,new NSize(52,41),new NSize(14,40)));
            mapObj.addOverlay(centermarker,MARKER_KEY);
        };
        
        //select box에서 선택 할경우 지도 
        $scope.getMapselected = function(searchVal) {
            console.log('getMapselected',searchVal);
            //select box 경우에 확인 하기 fun_gubun S
            if(searchVal != ""){
                var paramArr = searchVal.split("^");
                //{{item.shop_no }}^{{item.entr_no}}^{{item.entr_contr_no}}^{{item.post_addr}}^{{item.dtl_addr}}
                $scope.getMapPoint(paramArr[3]+paramArr[4]);
                $scope.naverStoreName=paramArr[5];
                $scope.naverStoreAddr=paramArr[3]+paramArr[4];
                
            }else{
                alert("본 상품의 매장정보는 제공하고 있지 않습니다.");
            }
        };
        
        //이벤트에서 호출하는 이전 센터 마커는 삭제 하고 새로운 센터 마커를 표시
        $scope.senddraged = function(movepos){
            zoomlevel=mapObj.getZoom();
            nposx=(movepos[0]+movepos[2])/2;
            nposy=(movepos[1]+movepos[3])/2;
            mapObj.removeOverlay(centermarkercross);
            centermarkercross = new NMark(new NPoint(nposx,nposy),new NIcon(iconcentercross,new NSize(52,41)));
            mapObj.addOverlay(centermarkercross);
        };
        
        //region 1
        $scope.getRegionName1stSelected = function(region,regionGubun){
        //$scope.regionName0st; 변경 없음
        //$scope.regionName1st; 초기화 필요
        //$scope.regionName2st; 초기화 필요
        //$scope.regionStoreList;     초기화 필요    
            console.log('getRegionName1stSelected',region+"|"+regionGubun);
            var regionItems = $scope.naverStoreMapData.smartpick_store_addr.items;
            var regionVal0;
            var regionVal1;
            var regionVal2;
            
            region = region.replace(/ /g,"");
            region = region.replace(/\s/g,"");
            if(regionItems != null && regionItems.length >0){
                //초기화
                if(regionGubun == 0){
                    $scope.regionName1st = [];
                    $scope.regionName2st = [];
                    $scope.regionStoreList = [];
                }else if(regionGubun == 1){
                    $scope.regionName2st = [];
                    $scope.regionStoreList = [];
                }else if(regionGubun == 2){
                    $scope.regionStoreList = [];
                }

                for(var i=0; i<regionItems.length; i++){
                    var regionPostAddr = regionItems[i].post_addr.split(" ");
                    regionVal0 = regionPostAddr[0];
                    regionVal1 = regionPostAddr[1];
                    regionVal2 = regionPostAddr[2];
                    //console.log('regionPostAddr',regionPostAddr.length+"|"+regionVal0+"|"+regionVal1+"|"+regionVal2);
                    //ex)서울특별시 
                    if(regionGubun == 0){
                        
                        regionVal0 = regionVal0.replace(/ /g,"");
                        regionVal0 = regionVal0.replace(/\s/g,"");
                        if(region == regionVal0){
                            console.log('regionVal1',regionVal1);
                            $scope.regionName1st.push(regionVal1);
                        }
                        
                    }else if(regionGubun == 1){

                        regionVal1 = regionVal1.replace(/ /g,"");
                        regionVal1 = regionVal1.replace(/\s/g,"");
                        if(region == regionVal1){
                            console.log('regionVal2',regionVal2);
                            $scope.regionName2st.push(regionVal2);
                        }
                    }else if(regionGubun == 2){

                        regionVal2 = regionVal2.replace(/ /g,"");
                        regionVal2 = regionVal2.replace(/\s/g,"");
                        
                        if(region == regionVal2){
                            console.log('regionVal2',regionVal2);
                            $scope.regionStoreList.push(regionItems[i]);
                        }
                    }
                }
            }
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
    naverMap.directive('naverMapInfo', function() {
        return {
            templateUrl : '/lotte/resources_dev/common/templates/naver_map_info.html',
            replace : true,
            // TODO ywkang2 : 고립스코프로 변경해야함
//            scope: {
//          },
            link : function($scope, el, attrs) {
            },
            controller: 'NaverMapInfoCtrl'
        };
    });
})(window, window.angular);