<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <!--20160801 편의점 -> 세븐일레븐 문구 변경-->
        <title>세븐일레븐 지점찾기</title>
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="expires" content="0">
        <meta http-equiv="pragma" content="no-cache">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="format-detection" content="telephone=no">
        <script type="text/JavaScript" src="http://test.lotte.com/common/js/jquery-1.7.1.min.js"></script>
        <!-- 롯데grs 20180821 -->
        <style>

            body{margin:0;font-size:14px}
            div,p,ul,li,table,th,td,textarea,input,span,form,h1,h2,h3,h4,h5,h6,dt,dl,dd {font-size:14px}
            body section {padding: 41px 0;width: 100%;height: 100%;box-sizing: border-box;overflow-y: scroll}
            header{width:100%;position: fixed;top: 0;background:#749eff;color:#fff;text-align:center;height:40px;line-height:39px;font-size:16px;font-weight:bold;border-bottom:1px solid #d0d0d0}
            header a img.close{width:67px;height:35px;position: absolute;right:0}
            body a{text-decoration:none}
            .matable{display:table;width:100%;color:#888;font-size:14px;margin-top:6px;line-height:29px}
            .matable .macell{display:table-cell;height:20px;box-sizing: border-box;}/*20161121*/
            .matable .macell.title{width:85px;padding-left:15px}
            .matable .macell.search{width:auto}
            .matable .macell.search input[type=text]{font-size:14px;width:98%;height:30px;border-radius:5px;border:1px solid #ccc;padding:0 9px;box-sizing: border-box;-webkit-appearance: none}
            .matable .macell.search select{width:48%;height:30px;border-radius:5px;border:1px solid #ccc;padding:0 20px 0 9px;box-sizing: border-box;-webkit-appearance: none;
                background:url(http://image.lotte.com/lotte/mo2015/angular/detail/cross_select.png) no-repeat right;background-size:25px 28px}
            .matable .macell.button{width:65px;padding-left:10px}
            .matable .macell.button a{display:block;background:#f3f3f3;width:41px;height:30px;text-align: center;color:#666;border:1px solid #ccc;border-radius:5px;font-size:13px}
            .result_7e_wrap_{margin-top:16px;width:100%;padding-top:75%;overflow:hidden;position:relative}
            .result_7e_wrap_ .box{position:absolute;top:0;width:100%;height:100%}
            #map-canvas{width:100%;height:100%;}
            .result_7e_wrap_ .mapStr{font-size:14px;width:100%;height:100%;text-align:center;background:#eee;padding-top:33%;box-sizing: border-box;color:#999}
            .result_7e_select_{margin-top:15px;min-height: 102px}
            .result_7e_select_ .matable{margin-top:3px;line-height:16px;display:none}
            .result_7e_select_ .macell{color:#333;font-size:14px;text-align:left}
            .result_7e_select_ .macell.cell1{padding-left:15px;width:76px}
            .pop-footer_ {margin-top:10px;text-align: center}
            .pop-footer_ a{display:inline-block;color:#719cff;border:1px solid #719cff;border-radius:20px;width:123px;height:40px;line-height:39px;text-align:center}
            .pop-footer_ a.ok_7e{background:#719cff;color:#fff;margin-left:5px }

            .posInfo{margin-top:3px}
            .posInfo .matable{margin-top:5px}
            .posInfo .matable .macell{color:#333;line-height:16px}
            .posInfo .matable .macell.cell1{width:90px;padding-left:20px}
            .info_map_wrap{width: 100%;margin-top:10px;padding-bottom:200px;overflow: hidden;position:relative;top:0;height:100%;box-sizing: border-box}
            .info_map_wrap .box{position:relative;top:0;width:100%;height:100%}
            .mart_pos{padding: 3px 3px 5px 3px;background: #efefef;color:#333;height:25px;margin:0;font-size:13px}
            .info_map_wrap.smallmap{margin-top:25px;padding-bottom:25px}
            input{outline:none}
            input.check01[type=checkbox] {-webkit-border-top-right-radius: 0;-webkit-border-top-left-radius: 0;-webkit-border-bottom-right-radius: 0;-webkit-border-bottom-left-radius: 0;border: none;margin:3px 3px 3px 4px;vertical-align: middle;cursor: pointer;background: url(https://simage.lotte.com/lotte/mo2015/angular/order/input_order.png) no-repeat;background-size: 155px 202px;width: 20px;height: 20px;appearance: none;-webkit-appearance: none;margin-bottom: 0;-webkit-tap-highlight-color: rgba(0, 0, 0, 0)}
            input.check01[type=checkbox]:checked {background-position: -25px 0}

            .crossp_point_list{
                margin:14px auto 16px;
                width:91.68%;
                overflow:hidden;
                background:url("http://image.lotte.com/lotte/images/smartp/crossp_chk_list_v3.jpg ") no-repeat;
                background-size:100%;
            }/*20180912*/
            .crossp_point_list .check_p01{
                width:25%;
                padding:9.7% 0;
                float:left;
                margin:0;
                cursor:pointer;vertical-align:middle;
                appearance:none;-webkit-appearance:none;border:none;

            }
            .crossp_point_list .check_p01[type="checkbox"]:checked{
                background: url("http://image.lotte.com/lotte/images/smartp/crossp_chk_sel.png") no-repeat center;
                background-size:100%;
            }
            .crossp_point_list label{display:none}

            @media all and (min-width: 720px){
                .crossp_point_list{width:64.44%}
            }
        </style>
        <!-- ellotte -->
        <!-- <style>
            header{background:#a59573}
            .pop-footer_ a{color:#a59573;border:1px solid #a59573}
            .pop-footer_ a.ok_7e{background:#a59573}
            header a img.close{display:none}
            header a{display:block;width:67px;height:35px;position: absolute;right:0;top:0}
            header a:after{width:17px;height:17px;display:block;content:'';background: url(http://image.lotte.com/ellotte/mo2015/angular/common/side_cate.png) no-repeat;background-size: 300px 300px;background-position:-117px 0;position:absolute;right:10px;top:13px}

            .crossp_point_list .check_p01[type="checkbox"]:checked{
                background: url("http://image.ellotte.com/lotte/images/smartp/el_crossp_chk_sel.png") no-repeat center;
                background-size:100%;
            }
        </style> -->
        <!-- //ellotte -->
        <!-- //롯데grs 20180821 -->
    </head>
    <body>
        <section>

            <!--=============  상품상세에서 편의점 지점 찾기 영역 시작 : param 이 없음. ===================-->
            <!--20160801 편의점 -> 세븐일레븐 문구 변경-->
            <header>세븐일레븐 지점찾기<a href="javascript:popupResult();"><img src="http://image.lotte.com/lotte/mo2015/angular/detail/cross_close.png" class="close"></a></header>
            <!-- 20180615 지점찾기 수정  -->
            <div class="searchBox">
                <div class="crossp_point_list">
                    <input type="checkbox" id="chk_1000" name="crspk_corp" value="1000:^:1" class="check_p01"><label for="chk_1000">세븐일레븐</label>
                    <input type="checkbox" id="chk_3000" name="crspk_corp" value="3000:^:1" class="check_p01"><label for="chk_3000">하이마트</label>
                    <input type="checkbox" id="chk_4000" name="crspk_corp" value="4000:^:1" class="check_p01"><label for="chk_4000">롯데슈퍼</label>
                    <input type="checkbox" id="chk_5000" name="crspk_corp" value="5000:^:1" class="check_p01" checked=""><label for="chk_5000">롯데리아</label>
                </div>

                <div class="matable">
                    <div class="macell title">지점검색</div>
                    <div class="macell search">
                        <input type="text" name="crspk_str_str_name" id="crspk_str_str_name" value="" placeholder="매장명" />
                    </div>
                    <div class="macell button">
                        <a href="javascript:crspkInfoSearch('N');" class="sear">검색</a>
                    </div>
                </div>
                <div class="matable">
                    <div class="macell title">지역검색</div>
                    <div class="macell search">
                        <select name="sido_nm" class="selComp" id="sido_nm" onchange="sidoChange()">
                            <option value='강원도'>강원도</option>
                            <option value='경기도'>경기도</option>
                            <option value='경상남도'>경상남도</option>
                            <option value='경상북도'>경상북도</option>
                            <option value='광주광역시'>광주광역시</option>
                            <option value='대구광역시'>대구광역시</option>
                            <option value='대전광역시'>대전광역시</option>
                            <option value='부산광역시'>부산광역시</option>
                            <option value='서울특별시'>서울특별시</option>
                            <option value='세종특별자치시'>세종특별자치시</option>
                            <option value='울산광역시'>울산광역시</option>
                            <option value='인천광역시'>인천광역시</option>
                            <option value='전라남도'>전라남도</option>
                            <option value='전라북도'>전라북도</option>
                            <option value='제주특별자치도'>제주특별자치도</option>
                            <option value='충청남도'>충청남도</option>
                            <option value='충청북도'>충청북도</option>
                        </select>
                        <select name="gugun_nm" class="selComp" id="gugun_nm">
                            <option value="">시/군/구</option>
                        </select>
                    </div>
                    <div class="macell button">
                        <a href="javascript:crspkInfoSearch('Y');" class="sear">검색</a>
                    </div>
                </div>
            </div>
            <div class="result_7e_wrap_">
               <div class="box">
                    <!--20160801 편의점 -> 세븐일레븐 문구 변경-->
                    <div class="mapStr">세븐일레븐 지점을 검색해주세요.</div>
                    <div id="map-canvas"></div>
               </div>
            </div>
            <div class="result_7e_select_">
                <div class="matable">
                    <div class="macell cell1">매장명</div>
                    <div class="macell cell2"><span id="crspk_str_str_nm"></span></div>
                </div>
                <div class="matable">
                    <div class="macell cell1">매장주소</div>
                    <div class="macell cell2"><span id="crspk_str_post_addr"></span> <span id="crspk_str_dtl_addr"></span></div>
                </div>
                <div class="matable">
                    <div class="macell cell1">연락처</div>
                    <div class="macell cell2"><span id="crspk_str_phon"></span></div>
                </div>
                <input type="hidden" name="crspk_corp_cd" id="crspk_corp_cd" value=""/>
                <input type="hidden" name="crspk_corp_str_sct_cd" id="crspk_corp_str_sct_cd" value=""/>
                <input type="hidden" name="crspk_str_no" id="crspk_str_no" value=""/>
            </div>
            <div class="pop-footer_">
                <a href="javascript:popupResult();" class="close_7e">취소</a> <a href="javascript:popupResult('Y');" class="ok_7e">확인</a>
            </div>

            <!--=============  상품상세에서 편의점 지점 찾기 영역 끝 ===================-->


            <!--=============  스마트픽예약정보에서 픽업위치 시작 param : crspk_yn 이 전달됨 crspk_map 은 없음 ===================-->
            <!--20160801 편의점 -> 세븐일레븐 문구 변경-->
            <!--
            <header>세븐일레븐 픽업 위치안내<a href="javascript:popupResult();"><img src="http://image.lotte.com/lotte/mo2015/angular/detail/cross_close.png" class="close"></a></header>
            <div class="posInfo">
                <div class="matable">
                    <div class="macell cell1">픽업위치</div>
                    <div class="macell cell2">을지로 넥서스 <br>서울 중구 인현동 1가 대성빌딩 19-2 1층 102호 넥서스 세븐일레븐</div>
                </div>
                <div class="matable">
                    <div class="macell cell1">연락처</div>
                    <div class="macell cell2">02-1234-1234</div>
                </div>
            </div>
            <div class="info_map_wrap">
               <div class="box">
                    <div id="map-canvas"></div>
               </div>
            </div>
            -->
            <!--=============  스마트픽예약정보에서 픽업위치 끝 ===================-->

            <!--=============  스마트픽 교환권 상세 시작 =================== param : crspk_map = 'Y'  로 구분 -->
            <!--
            <p class="mart_pos">서울 중구 인현동 1가 대성빌딩 19-2 1층 102호 넥서스 세븐일레븐</p>
            <div class="info_map_wrap smallmap">
               <div class="box">
                    <div id="map-canvas"></div>
               </div>
            </div>  -->
            <!-- -->
            <!--=============  스마트픽 교환권 상세 끝 ===================-->






              <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script>
              <!-- GoogoleMap Asynchronously Loading the API ********************************************* -->
              <script type="text/javascript">
                var crspk_info; // 크로스픽업 점포 정보 JSON
                var map; // 지도
                var marker; // 마커
                var markers = []; // 마커 배열
                //var ele_obj = ["crspk_corp_cd", "crspk_corp_str_sct_cd", "crspk_str_no", "crspk_str_str_nm", "crspk_str_post_no", "crspk_str_phon", "crspk_str_post_addr", "crspk_str_dtl_addr", "crspk_str_stnm_post_addr", "crspk_str_stnm_dtl_addr"]; // 선택된 정보 셋팅 값
                var input_obj = ["crspk_corp_cd", "crspk_corp_str_sct_cd", "crspk_str_no"]; // 선택된 정보 input
                var ele_obj = ["crspk_str_str_nm", "crspk_str_phon", "crspk_str_post_addr", "crspk_str_dtl_addr"]; // 선택된 정보 셋팅 값
                var sido_gugun_arr = [];
                var loaded_tf = true;

                // 초기화
                var initialize = function() {
                  var mapLocation = new google.maps.LatLng('37.5675451', '126.9773356'); // 지도에서 가운데로 위치할 위도와 경도

                  var mapOptions = {
                     center: mapLocation, // 지도에서 가운데로 위치할 위도와 경도(변수)
                     disableDefaultUI: true,
                     zoom: 12, // 지도 zoom단계
                     mapTypeId: google.maps.MapTypeId.ROADMAP,
                     zoomControl: true
                  };
                  map = new google.maps.Map(document.getElementById("map-canvas"), // id: map-canvas, body에 있는 div태그의 id와 같아야 함
                      mapOptions);

                  map.addListener('tilesloaded', function(){
                      if (loaded_tf){
                        //$(".result_7e_wrap").hide();
                        $(".mapStr").show();
                        loaded_tf = false;
                      }
                    }
                  ); // 지도 가리기 (display:none 등으로 초기에 가릴 경우 지도 표현 안됨)

                  // 지역 옵션 배열 생성
                sido_gugun_arr = ['강원도','경기도','경상남도','경상북도','광주광역시','대구광역시','대전광역시','부산광역시','서울특별시','세종특별자치시','울산광역시','인천광역시','전라남도','전라북도','제주특별자치도','충청남도','충청북도'];
                sido_gugun_arr['강원도'] = ['강릉시','고성군','동해시','삼척시','속초시','양구군','양양군','영월군','원주시','인제군','정선군','철원군','춘천시','태백시','평창군','홍천군','화천군','횡성군'];
                sido_gugun_arr['경기도'] = ['가평군','고양시 덕양구','고양시 일산동구','고양시 일산서구','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시 소사구','부천시 오정구','부천시 원미구','성남시 분당구','성남시 수정구','성남시 중원구','수원시 권선구','수원시 영통구','수원시 장안구','수원시 팔달구','시흥시','안산시 단원구','안산시 상록구','안성시','안양시 동안구','안양시 만안구','양주시','양평군','여주시','연천군','오산시','용인시 기흥구','용인시 수지구','용인시 처인구','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'];
                sido_gugun_arr['경상남도'] = ['거제시','거창군','고성군','김해시','남해군','밀양시','사천시','산청군','양산시','의령군','진주시','창녕군','창원시 마산합포구','창원시 마산회원구','창원시 성산구','창원시 의창구','창원시 진해구','통영시','하동군','함안군','함양군','합천군'];
                sido_gugun_arr['경상북도'] = ['경산시','경주시','고령군','구미시','군위군','김천시','문경시','봉화군','상주시','성주군','안동시','영덕군','영양군','영주시','영천시','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군','포항시 남구','포항시 북구'];
                sido_gugun_arr['광주광역시'] = ['광산구','남구','동구','북구','서구'];
                sido_gugun_arr['대구광역시'] = ['남구','달서구','달성군','동구','북구','서구','수성구','중구'];
                sido_gugun_arr['대전광역시'] = ['대덕구','동구','서구','유성구','중구'];
                sido_gugun_arr['부산광역시'] = ['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'];
                sido_gugun_arr['서울특별시'] = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
                sido_gugun_arr['세종특별자치시'] = [' '];
                sido_gugun_arr['울산광역시'] = ['남구','동구','북구','울주군','중구'];
                sido_gugun_arr['인천광역시'] = ['강화군','계양구','남구','남동구','동구','부평구','서구','연수구','옹진군','중구'];
                sido_gugun_arr['전라남도'] = ['강진군','고흥군','곡성군','광양시','구례군','나주시','담양군','목포시','무안군','보성군','순천시','신안군','여수시','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군'];
                sido_gugun_arr['전라북도'] = ['고창군','군산시','김제시','남원시','무주군','부안군','순창군','완주군','익산시','임실군','장수군','전주시 덕진구','전주시 완산구','정읍시','진안군'];
                sido_gugun_arr['제주특별자치도'] = ['서귀포시','제주시'];
                sido_gugun_arr['충청남도'] = ['계룡시','공주시','금산군','논산시','당진시','보령시','부여군','서산시','서천군','아산시','예산군','천안시 동남구','천안시 서북구','청양군','태안군','홍성군'];
                sido_gugun_arr['충청북도'] = ['괴산군','단양군','보은군','영동군','옥천군','음성군','제천시','증평군','진천군','청주시 상당구','청주시 서원구','청주시 청원구','청주시 흥덕구','충주시'];


                  // 구군 셋팅
                    if($('#sido_nm').length > 0){
                        sidoChange();
                    }

                }

                // 마커 표시
                var crspkMarkerDisplay = function(){
                  if (crspk_info!=null && crspk_info.length>0){
                    // 지도 중앙
                    if (crspk_info.length > 1){
                        var geocoder = new google.maps.Geocoder();
                        var address = $('#sido_nm').val() + " " + $('#gugun_nm').val();

                        geocoder.geocode( { 'address': address}, function(results, status) { // 지역 검색 시 중앙
                            if (status == google.maps.GeocoderStatus.OK) {
                                map.setCenter(results[0].geometry.location);
                            } else {
                                console.log("주소검색에 실패하였습니다.");
                            }
                        });
                    }

                    var diff_area_tf = false; // 다른 지역 존재 시
                    var pre_post_3_no = ""; // 이전 우편번호 3자리

                    // 마커 생성
                    for (var i=0; i<crspk_info.length; i++){
                      crspkMarkerCreate(i);

                      if (!diff_area_tf && pre_post_3_no != "" && pre_post_3_no != (crspk_info[i].CRSPK_STR_POST_NO).substring(0, 3)){ // 우편번호 앞 3자리가 다르면
                          diff_area_tf = true;
                      }

                      pre_post_3_no = (crspk_info[i].CRSPK_STR_POST_NO).substring(0, 3);
                    }

                    if(diff_area_tf){ // 지역이 다른 경우 (서울 명동/천안 명동)
                        map.setCenter(new google.maps.LatLng('36', '128')); // 대한민국 중앙으로
                        map.setZoom(6);
                    }else if (crspk_info.length > 1){ // 결과가 2 이상이면
                        map.setZoom(12);
                    }
                  }
                }

                // 마커 생성
                var crspkMarkerCreate = function(crspk_idx){
                  var address = crspk_info[crspk_idx].CRSPK_STR_POST_ADDR + " " + crspk_info[crspk_idx].CRSPK_STR_DTL_ADDR; // DB에서 주소 가져와서 검색.
                  var geocoder = new google.maps.Geocoder();
                  var crspk_str_nm = crspk_info[crspk_idx].CRSPK_STR_STR_NM; // 마커 타이틀

                  geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                       markers[crspk_idx] = new google.maps.Marker({
                                    map: map,
                                    icon: "http://image.lotte.com/lotte/images/smartp/postion_7e_off.png",
                                    title: crspk_str_nm,
                                    position: results[0].geometry.location
                                    });
                       // 주소가 하나일 경우 주소 중앙 셋팅
                       if (crspk_info != undefined && crspk_info.length == 1){
                           map.setCenter(markers[crspk_idx].position);
                           map.setZoom(15);
                       }

                        google.maps.event.addListener(markers[crspk_idx], "click", function() {crspkMarkerSelect(markers[crspk_idx], crspk_idx);}); // 마커 클릭시 이벤트 지정
                    } else {
                      markers[crspk_idx] = null;
                      console.log(crspk_str_nm + "의 주소검색에 실패하였습니다.");
                    }
                  });
                }

                // 마커 삭제
                var crspkMarkerRemoveAll = function(){
                  for (var i=0; i < markers.length; i++){
                    markers[i].setMap(null);
                  }
                }

                // 마커 선택
                var crspkMarkerSelect = function(crspk_marker, sel_idx){
                  // 모든 마커 이미지 초기화
                  for (var i=0; i < markers.length; i++){
                    if (markers[i]!=null){
                      markers[i].setIcon("http://image.lotte.com/lotte/images/smartp/postion_7e_off.png");
                    }
                  }

                  crspk_marker.setIcon("http://image.lotte.com/lotte/images/smartp/postion_7e_on.png"); // 선택된 마커 이미지 변경

                  // 편의점 정보 셋팅 1
                  for (var i=0; i < input_obj.length; i++){
                    $('#'+input_obj[i]).val(crspk_info[sel_idx][input_obj[i].toUpperCase()]);
                  }

                  // 편의점 정보 셋팅 2
                  for (var i=0; i < ele_obj.length; i++){
                    $('#'+ele_obj[i]).html(crspk_info[sel_idx][ele_obj[i].toUpperCase()]);
                  }
                    $(".result_7e_select_ .matable").show();
                }

                // 지역 검색
                var crspkInfoSearch = function(area_search_yn){
                  crspkMarkerRemoveAll(); // 기존 마커 제거
                  markers = []; // 마커 배열 초기화

                  var params = "area_search_yn="+area_search_yn;

                  if (area_search_yn=='Y'){
                      params += "&sido_nm="+$("#sido_nm").val()+"&gugun_nm="+$("#gugun_nm").val();
                  }else{
                      var search_nm = $("#crspk_str_str_name").val();

                      if (search_nm.length < 1 || search_nm=='점'){
                          alert('점 이름을 입력하세요.');
                          return;
                      }

                      params += "&crspk_str_str_nm="+search_nm;
                  }

                  // 편의점 정보 초기화 1
                  for (var i=0; i < input_obj.length; i++){
                    $('#'+input_obj[i]).val('');
                  }

                  // 편의점 정보 초기화 2
                  for (var i=0; i < ele_obj.length; i++){
                    $('#'+ele_obj[i]).html('');
                  }
                  $(".result_7e_select_ .matable").hide();


                  var jsonlink = '/system/searchCrssShopListAjax.lotte';
                  //localtest 용
                  jsonlink = "/json/product/mart_map.json";
                  $.getJSON(jsonlink , params, function(data){
                      if (data.length < 1){
                          $(".mapStr").show().text("수령 가능한 지점이 없습니다.");
                          return;
                      }
                      $(".mapStr").hide();
                      crspk_info = data;
                      crspkMarkerDisplay();
                  });

                }

                // 지역 시도 선택
                var sidoChange = function(){

                    var sido = $("#sido_nm").val();
                    var gugun = sido_gugun_arr[sido];
                    var gugun_opt = "";

                    for (var i=0; i < gugun.length; i++){
                        gugun_opt += "<option value='" + gugun[i] + "'>" + gugun[i] + "</option>";
                    }

                    $("#gugun_nm").html(gugun_opt);
                }

                // 결과 셋팅, 창 닫기
                var popupResult = function(set_yn){
                    if (set_yn=='Y'){
                        if($(".result_7e_select_ .matable").css("display") == "none"){
                            alert("세븐일레븐 지점을 선택해주세요.");
                            return;
                        }
                        var paramObj = {
                            "name" : $("#crspk_str_str_nm").text(),
                            "address": $("#crspk_str_post_addr").text() +" "+ $("#crspk_str_dtl_addr").text(),
                            "tel" : $("#crspk_str_phon").text(),
                            "crspk_corp_cd" : $("#crspk_corp_cd").val(),
                            "crspk_corp_str_sct_cd" : $("#crspk_corp_str_sct_cd").val(),
                            "crspk_str_no" : $("#crspk_str_no").val()
                        };
                        parent.searchMartResult(paramObj); //매장명, 주소, 전화 정보 전달
                    }
                    //부모창의 함수 호출 : 닫기
                    parent.searchMartClose();
                }

                google.maps.event.addDomListener(window, 'load', initialize); // 지도 초기화

                $('#crspk_str_str_name').bind("click", function(){
                    $(this).attr('value', '');
                });
              </script>
            <div style="display:none">
                <iframe src="" name="paction_frame" width="0" height="0" title="빈 프레임"></iframe>
                <div id="tempFormDiv">
                    <form name="tempForm" method="post" action=""><!-- 201303 form 서식미흡(action 속성부재) -->
                        <input type="hidden" name="method" />
                        <div id="divTemp"></div>
                    </form>
                </div>
            </div>

        </section>
    </body>
</html>
