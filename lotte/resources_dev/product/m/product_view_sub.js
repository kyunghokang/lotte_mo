(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteUnit',
        'lotteCommFooter',
        'angular-carousel',
        'lotteNgSwipe'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl : '/lotte/resources_dev/product/product_view_container.html',
            controller: 'ProductDetailPage',
            reloadOnSearch : false
        })
        .when('/none', {
            templateUrl : '/lotte/resources_dev/product/product_view_container.html',
            controller: 'ProductDetailPage',
            reloadOnSearch : false
        })
        .when('/submain_gucci', {
            templateUrl : '/lotte/resources_dev/product/gucci_faq_list.html',
            controller: 'GucciFaqListPage',
            reloadOnSearch : false
        })
        .when('/product_quest_write_gucci/:mdl_no?', {
            templateUrl : '/lotte/resources_dev/product/product_quest_write_gucci.html',
            controller: 'GucciQnaListPage',
            reloadOnSearch : false
        })
        .otherwise({
            templateUrl : '/lotte/resources_dev/product/product_view_container.html',
            controller: 'ProductDetailPage',
            reloadOnSearch : false
        })
    }]);
    
    app.factory('SharedData',function(){
    	var data = {SharedData : undefined};
    	return {
    		getSharedData : function(){
    			return data.SharedData;
    		},
    		setSharedData : function(data_){
    			data.SharedData = data_
    		}
    	};
    });
    
	app.service('Fnproductview', function () {
	  this.productbtnlayertp = function ($scope) {
		  console.log('productbtnlayertp', 'called');
		  var rtnVal = "00";
          if ($scope.BasicData.tworld_sell == "N"){
        	  rtnVal = "01";
          } else if ($scope.reqParam.goods_no == '19338070'){
        	  rtnVal = "02";
          } else if ($scope.BasicData.product.goodsTpCd == '30' || $scope.BasicData.product.goodsTpCd == '40' || $scope.BasicData.m_yn == 'Y'){
        	  rtnVal = "03";
          } else if ($scope.BasicData.product.item_opt_yn == 'Y'){
        	  rtnVal = "04";
          } else if ($scope.BasicData.product.entr_yn == 'Y'){
        	  rtnVal = "05";
          } else if ($scope.BasicData.product.pmg_md_gsgr_no == '1696' && $scope.BasicData.product.org_sale_prc == '10'){
        	  rtnVal = "06";
          } else if ($scope.BasicData.product.sale_stat_cd == '20'){
        	  rtnVal = "07";
          } else if ($scope.BasicData.product.sale_stat_cd == '30'){
        	  rtnVal = "08";
          } else if ($scope.BasicData.is_gucci_sale == 'fals'){
        	  rtnVal = "09";
          }
	    return rtnVal;
	  };
	  this.isEmpty = function (str) {
		  console.log('isEmpty', 'called');
		  var rtnVal = false;
          if ( str != null && str != "" && str != 'null'){
        	  rtnVal = true;
          }
          return rtnVal;
	  };
	  this.getNumberFormat = function(num) { // 숫자 콤마찍기
			var pattern = /(-?[0-9]+)([0-9]{3})/;
			while (pattern.test(num)) { num = (num + "").replace(pattern, "$1,$2"); }
			return num;
	  };
	  this.objectToString = function(obj) { // 숫자 콤마찍기
			return obj == undefined ? "" : obj;
	  };
	  this.getTclickCd = function(isEllotte,cd) { // 상품상세용 tclick
		  var rtnVal = "";
		  if (isEllotte) {
			  rtnVal = "el_m_o_" + cd;
		  } else {
			  rtnVal = "m_o_" + cd;
		  }
//		  tclickArray.push("prod_tclick_brand");
//		  if (isEllotte) {
//			  
//				prod_tclick_brand = "el_m_o_brandshop";
//				prod_tclick_bigimg = "el_m_o_enlargeview";
//				prod_tclick_calculate = "el_m_o_calculate";
//				prod_tclick_directorder = "el_m_o_directorder";
//				prod_tclick_cart = "el_m_o_cart";
//				prod_tclick_wishlist = "el_m_o_wishlist";
//				prod_tclick_detailinfomation = "el_m_o_detailinfomation";
//				prod_tclick_goodsqna = "el_m_o_goodsqna";
//				prod_tclick_goodscomment = "el_m_o_goodscomment";
//			} else {
//				prod_tclick_brand = "m_o_brandshop";
//				prod_tclick_bigimg = "m_o_bigimg";
//				prod_tclick_calculate = "m_o_calculate";
//				prod_tclick_directorder = "m_o_directorder";
//				prod_tclick_cart = "m_o_cart";
//				prod_tclick_wishlist = "m_o_wishlist";
//				prod_tclick_detailinfomation = "m_o_detailinfomation";
//				prod_tclick_goodsqna = "m_o_goodsqna";
//				prod_tclick_goodscomment = "m_o_goodscomment";
//			}
			return rtnVal;
	  };
	});
	
	

    // 전체 Controller
    app.controller('ProductCtrl', ['$scope', '$http', '$routeParams', '$location', 'LotteCommon','Fnproductview','commInitData', function($scope, $http,$routeParams, $location, LotteCommon,Fnproductview,commInitData) {
    	console.log('ProductCtrl call start');
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "상품상세"; //서브헤더 타이틀
        $scope.isBasicData = false;
        $scope.windowWidth = $(window).width();
        $scope.windowHeight = $(window).height();
        /* menu Small Category GET */
       
        // UI Scope
//        $scope.reqParam = {
//        	upCurDispNo : findStr( chkHref , 'upCurDispNo' , '&' ), // 상위 카테고리번호 
//        	dispDep : findStr( chkHref , 'dispDep' , '&' ), 
//        	curDispNo : findStr( chkHref , 'curDispNo' , '&' ),
//        	goods_no : findStr( chkHref , 'goods_no' , '&' ),
//        	wish_lst_sn : findStr( chkHref , 'wish_lst_sn' , '&' ),
//        	cart_sn : findStr( chkHref , 'cart_sn' , '&' ),
//        	item_no : findStr( chkHref , 'item_no' , '&' ),
//        	genie_yn : findStr( chkHref , 'genie_yn' , '&' ),
//        	cn : findStr( chkHref , 'cn' , '&' ),
//        	cdn : findStr( chkHref , 'cdn' , '&' ),
//        	curDispNoSctCd : findStr( chkHref , 'curDispNoSctCd' , '&' ),
//        	tclick : findStr( chkHref , 'tclick' , '&' )
//        };
        $scope.reqParam = {
            	upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호 
            	dispDep : Fnproductview.objectToString(commInitData.query['dispDep']), 
            	curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
            	goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
            	wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
            	cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
            	item_no : Fnproductview.objectToString(commInitData.query['item_no']),
            	genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
            	cn : Fnproductview.objectToString(commInitData.query['cn']),
            	cdn : Fnproductview.objectToString(commInitData.query['cdn']),
            	curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
            	tclick : Fnproductview.objectToString(commInitData.query['tclick'])
            };
        $scope.reqParamStr = $scope.baseParam;
        if ($scope.reqParam.curDispNoSctCd != null){$scope.reqParamStr += "&curDispNoSctCd="+$scope.reqParam.curDispNoSctCd;}
        if ($scope.reqParam.curDispNo != null){$scope.reqParamStr += "&curDispNo="+$scope.reqParam.curDispNo;}
        if ($scope.reqParam.goods_no != null){$scope.reqParamStr += "&goods_no="+$scope.reqParam.goods_no;}

        /**
         * Data Load Scope Func
         */
        // 상품기본정보 데이터 로드
        $scope.loadBasicData = function() {
            if ($scope.BasicData == undefined) {
                console.log('reqParam', $scope.reqParam);
                $http.get(LotteCommon.productProductViewData, {params:$scope.reqParam})
                .success(function(data) {
                    $scope.BasicData = data.max; //상품기본정보 로드
                    $scope.isBasicData = true;
                    //$scope.goodsnm = $scope.reqParam.curDispNo;
                    $scope.btnDispTp = Fnproductview.productbtnlayertp($scope);
                    $scope.mdNtcFcont = '';
                    if (Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont)){$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont;}
                    if (Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont1)){$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont1;}
                    if (Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont2)){$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont2;}
                    
                    $scope.reqCheckList(); //체크리스트 
                    
                })
                .error(function() {
                    console.log('Data Error : 상품기본정보 로드 실패');
                });
            }
        };
        // faq 데이터 로드
        $scope.loadFaqListData = function() {
            if ($scope.faqListData == undefined) {
                console.log('faqListData-reqParam', 'called');
                $http.get(LotteCommon.custcenterFaqListData, {params : {cust_inq_sml_tp_cd : "1578"}})
                .success(function(data) {
                    $scope.faqListData = data.faqList; //상품기본정보 로드
                    $scope.isFaqListData = true;
                })
                .error(function() {
                    console.log('Data Error : 상품기본정보 로드 실패');
                });
            }
        };
        $scope.reqCheckList = function() {
        	//성인 인증 체크
        	if ($scope.BasicData.product.byr_age_lmt_cd == 19) { /*19금 상품*/
        		if ($scope.loginInfo.isAdult == "") { /*본인인증 안한 경우*/

                    if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        $scope.loginProc('Y');
                    } else {
                        $scope.goAdultSci();
                    }
                    return false;
                } else if (!$scope.loginInfo.isAdult) { /*성인이 아닌 경우*/
                    alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
                    return false;
                }
            }
        };

    }]);

    // Route용 Controller
    app.controller('ProductDetailPage', ['$scope', '$window', function($scope, $window) {
    	console.log('ProductDetailPage called');
    	$scope.loadBasicData();
    	//$scope.productDetail(); //bottom 상품옵션정보 layer 
        angular.element($window).scrollTop(0);
        
     // 상품기본정보 데이터 로드
        $scope.optionChange = function(idx,t) {
           console.log('idx', idx);
        };
    }]);
 // Route용 Controller
    app.controller('GucciFaqListPage', ['$scope', '$window', 'LotteCommon','Fnproductview', function($scope, $window, LotteCommon,Fnproductview) {
    	console.log('GucciFaqListPage called');
    	$scope.loadFaqListData(); //gucci faq list data
        angular.element($window).scrollTop(0);

        angular.element(document).ready(function(){
        	// FAQ 페이지 내용 펼치기/접기
        	$('.gucci_faq_list').on('click',' > ul > li > a' , function(e){
        		if($(this).parent('li').hasClass('faq_on')){
        			$(this).siblings('ul').slideUp('fast', function(){
        				$(this).parent('li').removeClass('faq_on');
        			});
        		}else{
        			if($('.gucci_faq_list > ul > li').hasClass('faq_on')){
        				$('.gucci_faq_list > ul > li.faq_on').children('ul').slideUp('fast', function(){
        					$('.gucci_faq_list > ul > li').removeClass('faq_on');
        				});
        			}
        			$(this).siblings('ul').slideDown('fast', function(){
        				$(this).parent('li').addClass('faq_on');
        			});
        		};
        		return false;
        	});
        	
        	//history back 키 눌렸을 때 이벤트처리
			window.addEventListener( 'popstate', function(event){
				$window.location.href = "#/";
			}, false);
        });
     // --------------------------------------------- FAQ  ---------------------------------------------- //
    }]);
    
 // Route용 Controller
    app.controller('GucciQnaListPage', ['$http','$scope', '$window', 'LotteCommon','Fnproductview','$routeParams','commInitData', function($http,$scope, $window, LotteCommon,Fnproductview,$routeParams,commInitData) {
    	console.log('GucciQnaListPage called');
        angular.element($window).scrollTop(0);
        $scope.mdl_no = $routeParams.mdl_no == undefined ? "" : $routeParams.mdl_no;
        if ($scope.reqParam == undefined){
        	$scope.reqParam = {
                	upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호 
                	dispDep : Fnproductview.objectToString(commInitData.query['dispDep']), 
                	curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
                	goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
                	wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
                	cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
                	item_no : Fnproductview.objectToString(commInitData.query['item_no']),
                	genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
                	cn : Fnproductview.objectToString(commInitData.query['cn']),
                	cdn : Fnproductview.objectToString(commInitData.query['cdn']),
                	curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
                	tclick : Fnproductview.objectToString(commInitData.query['tclick'])
                };
        }
        
        /**
         * Data Load Scope Func
         */
        // qna 화면 데이터 로드
        var fnGucciQnaData = function() {
            if ($scope.GucciQnaData == undefined) {
                console.log('reqParam', $scope.reqParam);
                                
                $http.get(LotteCommon.custcenterQuestWriteGucciData, {params:$scope.reqParam})
                .success(function(data) {
                    $scope.GucciQnaData = data.data_set; //상품기본정보 로드
                    $scope.isGucciQnaData = true;
                    //$scope.goodsnm = $scope.reqParam.curDispNo;
                    $scope.gucciQnaInit();
                    
                })
                .error(function(ex) {
                	if (ex == null){
                		console.log('Data Error : 구찌문의하기 로드 실패-->null');
                		return;
                	}
                	if (ex.error.response_code == '2000'){
                		alert("로그인이 필요한 서비스입니다.");
                		$scope.loginProc();
                	} else {
                		console.log('Data Error : 구찌문의하기 로드 실패-->' + ex.error.response_msg);
                	}                    
                });
            }
        };
        fnGucciQnaData();
	        
        $scope.goQnaWrite = function(){
        	
        };
        $scope.gucciQnaInit = function(){
	        	//angular.element(document).ready(function(){
	            	
		    		$('#email_ans_ntc_yn').change(function(){
		    			$scope.fn_changeWrtrEmail();
		    		});
		    		
		    		$('#sms_ans_rcv_yn').change(function(){
		    			$scope.fn_changeWrtrPhone();
		    		});
		    		$('#wrtr_cell_no1').change(function(){
		    			$("input[name=wrtr_cell_no1]").val(this.value);
		    		});
		    	
		    		$('input[name=wrtr_cell_no2]').click(function(){
		    			var frm = document.getElementById("questWrite");
		    			if(!frm.sms_ans_rcv_yn.checked){
		    				if(confirm("답신 여부를 SMS로 받으시겠습니까?")){
		    					frm.sms_ans_rcv_yn.checked = true;
		    					$scope.fn_changeWrtrPhone();	
		    				}
		    			}
		    		});
		    		$('input[name=wrtr_cell_no3]').click(function(){
		    			var frm = document.getElementById("questWrite");
		    			if(!frm.sms_ans_rcv_yn.checked){
		    				if(confirm("답신 여부를 SMS로 받으시겠습니까?")){
		    					frm.sms_ans_rcv_yn.checked = true;
		    					$scope.fn_changeWrtrPhone();	
		    				}
		    			}
		    		});		
		    		
		    		// 직접입력 이메일 바인드 방법 변경
		    		var email_addr = $scope.GucciQnaData.email_addr;
		    		if(email_addr.indexOf("@") >= 0){
		    			var emailAddr = email_addr.split("@");

			    		$('INPUT[name="wrtr_email_addr1"]').val( emailAddr[0] );
			    		$('SELECT[name="wrtr_email_addr2"]').val( emailAddr[1] );
			    		if( "D" == $('SELECT[name="wrtr_email_addr2"]').val() && "" != emailAddr[1] && null != emailAddr[1] )
			    			$('SELECT[name="wrtr_email_addr2"]').val( "" );
			    		
			    		$scope.f_InputEmail( $('SELECT[name="wrtr_email_addr2"]').val() );
		    		}
		    		
	        	//});    
        };
        
        $scope.fn_changeWrtrPhone = function(){
			var obj = document.getElementById("sms_ans_rcv_yn");
			if( obj.checked ){
				obj.value ="Y";
				$("#wrtr_cell_no1").attr("disabled",false);
				$("input[name=wrtr_cell_no2]").attr("readOnly",false);
				$("input[name=wrtr_cell_no3]").attr("readOnly",false);
			}else{
				obj.value ="N";
				$("#wrtr_cell_no1").attr("disabled",true);
				$("input[name=wrtr_cell_no2]").attr("readOnly",true);
				$("input[name=wrtr_cell_no3]").attr("readOnly",true);
			}
		};
		$scope.fn_changeWrtrEmail = function(){
			var obj = document.getElementById("email_ans_ntc_yn");
			if( obj.checked ){
				obj.value ="Y";
			}else{
				obj.value ="N";
			}	
		};
		$scope.f_InputEmail = function (pval){
			var frm = document.questWrite;
//			if( pval == "D" ){ 
//				$('.direct').hide();
//				return;
//			}
//			if( pval == "" ) {
//				$('.direct').show();
//				$("input[name=wrtr_email_addr_direct]").attr("readOnly",false);
//				frm.wrtr_email_addr_direct.value = "";
//				frm.wrtr_email_addr_direct.focus();
//			} else {
//				$("input[name=wrtr_email_addr_direct]").attr("readOnly",true);
//				frm.wrtr_email_addr_direct.value = pval;
//				$('.direct').hide();
//			}
		};
        
	        
	        
	        
	}]);
// --------------------------------------------- Qna  ---------------------------------------------- //

 
 // Directive :: rendering 후 호출하기위한 함수
    app.directive('onFinishRender', function($timeout) {
        return {
        	restrict:'A',
        	scope:true,
        	link:function($scope, el, attrs) {
        		console.log('$scope.$last : ',$scope.$last);
	        	if ($scope.$last === true){
		          	  $timeout(function(ngFinishedEvent){
		              	  $scope.$emit(attrs.onFinishRender);
		              	  $scope.$apply();
		          	  },0)
	        	  }
        	}
        };
    });
    
    app.directive('lotteFooterProductOptionbar', ['$http','$window', '$timeout', '$location','$compile','LotteCommon','Fnproductview', function($http,$window, $timeout, $location, $compile,LotteCommon,Fnproductview) {
        return {
        	templateUrl: '/lotte/resources_dev/product/lotte_footer_product_optionbar.html',
            replace:true,
            link:function($scope, el, attrs) {
        	$scope.soldoutCheck = "";
        	
        	$scope.setOptsQty = function (num) { // 수량 +, - 처리
        		if ($scope.soldoutCheck == "Y") {
        			return false;
        		}        		
        		var $qty = $("#frm_send input[name=order_qty]:hidden"),
        			qty = parseInt($qty.val()),
        			calNum = num > 0 ? qty + 1: qty - 1;
        		
        			$scope.changeQty(calNum);
        	};        	
        	
        	// 바로주문 레이어 옵션 선택처리
        	$scope.setLayerOrderQty = function(optnum, target) {
        		var optn = parseInt(optnum), 
        			obj = $('#opt_value'+optn);
        		
        		obj.val(obj.find('option').eq(target).val());
        		$scope.optionChange(optn, obj[0]);
        		$('.s_box01').eq(optn).find( 'a' ).addClass( 'select_on' );
        		
        		$("div.option_select_layer.act").removeClass("act").css("bottom","-500px");//선택후 레이어 닫기
        		
        	};
        	
        	$scope.initOrderQty = function (optval) {
	        	
	        	var qty = parseInt($scope.initOptValue(optval)[3]);// sample : value^itemno^soldout^qty 중 문자열 split하고 맨 마지막 qty
	        	
	        	var _opt_max_qty = parseInt($("#frm_send input[name=lmt_cnt_max]:hidden").val());
	        	var _opt_min_qty = parseInt($("#frm_send input[name=lmt_cnt_min]:hidden").val());
	
	        	if (qty != '' && qty > 0) {
	        		if (qty < _opt_max_qty) {
	        			_opt_max_qty = qty;
	        		}	
	        		if (_opt_min_qty > _opt_max_qty) {
	        			_opt_max_qty = _opt_min_qty;
	        		}	
	        		if (_opt_max_qty > 50) {
	        			_opt_max_qty = 50;
	        		}
	        	}
	        	$scope.changeQty(parseInt($("#frm_send input[name=order_qty]:hidden").val()));
	        };
	      //품절 상품 체크
	        $scope.isSoldout = function (optval) {
		         var soldout = $scope.initOptValue(optval)[2];
		         if ( soldout == 'Y') {
		             return true;
		         } else  {
		             var qty = $scope.initOptValue(optval)[3];
	
		             if (qty == "0") return true;
		             else return false;
		         }
	        };
	        $scope.setSoldoutQty = function (){
	        	$scope.soldoutCheck = "Y";
	    		$scope.changeQty(0);
	    		$("#frm_send input[name=order_qty]:hidden").val("0");	
	    	};
	        $scope.getItemDtlStkInfo = function (optValCd){
	        	var optItemStkList = $scope.BasicData.product.item_dtl_stk_list;
	        	var rtnObj;
	        	for(var i=0; i < optItemStkList.total_count; i++){
	        		if (optItemStkList.items[i].opt_val_cd == optValCd){
	        			rtnObj = optItemStkList.items[i];
	        			break;
	        		}
	        	}
	        	return rtnObj;
	    	};
	    	$scope.initOptValue = function (optval) {
        		var arrOptVal = "";
        		try{
        			arrOptVal = optval.split("^");
        		}catch(e){}
        	    return arrOptVal;
        	};
        	$scope.getOptItemNo = function (optval) {
        		 return $scope.initOptValue(optval)[1];
        	};
        	$scope.getMakeOptValCd = function () { // 1x1x...
        		var rtnVal = "";
        		var opt1    = $("#frm_input select[name=opt_value1]").val();
    	    	var opt2    = $("#frm_input select[name=opt_value2]").val();
    	    	var opt3    = $("#frm_input select[name=opt_value3]").val();
    	    	var opt4    = $("#frm_input select[name=opt_value4]").val();
    	
    	        if ( opt1 != '' && opt1 != undefined ) { 
    	        	rtnVal	= $scope.getOptItemNo(opt1);
    	        }
    	        if (rtnVal == ""){
    	        	return rtnVal;
    	        }
    	        if ( opt2 != '' && opt2 != undefined ) {
    	        	rtnVal	+= " x "+$scope.getOptItemNo(opt2);
    	    	}
    	        if ( opt3 != '' && opt3 != undefined ) {
    	        	rtnVal	+= " x "+$scope.getOptItemNo(opt3);
    	        }
    	        if ( opt4 != '' && opt4 != undefined ) {
    	        	rtnVal	+= " x "+$scope.getOptItemNo(opt4);
    	        }
        			
       		 return rtnVal;
       	};
	        
	        $scope.changeQty = function (num) { // 수량 +, - 처리 (Layer 동기화)
	        	var _opt_max_qty = parseInt($("#frm_send input[name=lmt_cnt_max]:hidden").val());
	        	var _opt_min_qty = parseInt($("#frm_send input[name=lmt_cnt_min]:hidden").val());
//	        	var basePrice =  parseInt($(".option_list_layer .totalPrice .price").text().replace(/[^0-9]/g, ""));  // 상품가격 출력
	        	var basePrice =  parseInt($scope.BasicData.product.sale_prc);  // 상품가격 출력
	        	
        		var $qty = $("#frm_send input[name=order_qty]:hidden"),
        			$iptOptsQty = $("#optQty"),
        			$iptOptsQtyLayer = $("#optQtyLayer");
        	
        		if ($.isNumeric(num)) {
        			num = Math.floor(num);
        		} else {
        			num = 0;
        		}
        	
        		if (num < _opt_min_qty) {
        			num = _opt_min_qty;
        		}
        	
        		if (num > _opt_max_qty) {
        			num = _opt_max_qty;
        		}
        		
        		$qty.val(num);
        		$iptOptsQty.val(num);
        		$iptOptsQtyLayer.val(num);

        		$(".option_list_layer .totalPrice .num").html(num);  // 수량합계 출력
        		var totalPrice = basePrice*num ;
        		$(".option_list_layer .totalPrice .price").html( Fnproductview.getNumberFormat(totalPrice) );  // 금액합계 출력
        	};
        	
        	//옵션 change 시 ajax[삭제 라인 재처리]
        	$scope.optionChange = function (optnum, obj, div){
        	  var optItemStkList = $scope.BasicData.product.item_dtl_stk_list;
        	  var optItemList 	= $scope.BasicData.product.item_dtl.items[optnum-1].item.items;
        	  var itemno		= $("#frm_send input[name=itemno]:hidden").val();
        	  var optcount	= $("#frm_input select[name^=opt_value]").length; // 옵션갯수
        	  var optval		= $("#frm_input select[name=opt_value" + optnum + "]").val();
        	  var invMgmtYn	= $("#frm_input input[name=invMgmtYn]:hidden").val();
        	  
        		if($("#opt_value"+optnum+" option:selected").attr('sold_yn') == "Y"){
        			alert('품절 상품을 선택하셨습니다.');
        	
        			for(var i=optnum; i<=optcount; i++){
        				$("#opt_value"+i+" option:first").attr('selected',true);
        			}
        	
        			return;
        		}
        	
        		// 마지막 옵션
        	    if ( optnum == optcount ) {
        	
        	    	$scope.initOrderQty(optval);
        		    
        		    if ( $scope.isSoldout(optval) ) {
        		    	$scope.setSoldoutQty();
        		        alert('선택하신 옵션은 품절입니다.');
        		        return;
        		    }else{
        		    	$scope.soldoutCheck = "N";
        		    }
        		    
        		    $("#frm_send input[name=itemno]:hidden").val( $scope.getOptItemNo(optval) );//option value를 split하고 첫번째 값을 세팅.
        		    
        	    }
        	    // 마지막 바로전 옵션 
        	    else if ( optnum == (optcount - 1) ) {

              	  var optNextItemList 	= $scope.BasicData.product.item_dtl.items[optnum].item.items;
//        	    	var optno1 = "", optno2 = "", optno3 = "", optno4 = "";
//        	    	
        	    	$("#opt_value"+optcount+" option:first").attr("selected", true); 							// 마지막 옵션은 비선택 상태로 변경한다.
        	    	$('div.option_list_layer').find('.s_box01').eq(optcount-1).find('.tl a').text( '선택하세요' );// 레이어 마지막 옵션은 비선택 상태로 변경한다.
//        	
//        	    	var opt1    = $("#frm_input select[name=opt_value1]").val();
//        	    	var opt2    = $("#frm_input select[name=opt_value2]").val();
//        	    	var opt3    = $("#frm_input select[name=opt_value3]").val();
//        	    	var opt4    = $("#frm_input select[name=opt_value4]").val();
//        	
//        	        if ( opt1 != '' && opt1 != undefined ) { 
//        	            optno1	= $scope.getOptItemNo(opt1);
//        	        }
//        	        if ( opt2 != '' && opt2 != undefined ) {
//        	            optno2	= $scope.getOptItemNo(opt2);
//        	    	}
//        	        if ( opt3 != '' && opt3 != undefined ) {
//        	            optno3	= $scope.getOptItemNo(opt3);
//        	        }
//        	        if ( opt4 != '' && opt4 != undefined ) {
//        	            optno4	= $scope.getOptItemNo(opt4);
//        	        }
//        	        
        	    	//alert(invMgmtYn);
        	    	// 바로 주문에 필요한 레이어 데이터 json 으로 만든다
        	        var optValCd = $scope.getMakeOptValCd();
        	        var optcnt = optnum+1;
        	    	var leyerRenderData = [];
        	    	$("#opt_value"+optcnt).empty();
        	    	$("#opt_value"+optcnt).append("<option value=''>선택하세요</option>");
        	    	//for(var itemList in optItemList){
        	    	for(var i = 0; i <optNextItemList.length; i++){
        	    		var itemList = optNextItemList[i];
        	    		var opt_stk_yn = "";
        	    		var opt_cnt = "";
        	    		var itemDtlStkInfo = $scope.getItemDtlStkInfo(optValCd + " x " + itemList.item_no );
        	    		
        	    		if (itemDtlStkInfo.opt_stk_yn == 'Y' || itemDtlStkInfo.inv_qty == '0'){
        	    			$("#opt_value"+optcnt).append("<option value =\"" + itemList.opt_value + "^"+itemList.item_no+ "^"+itemDtlStkInfo.opt_stk_yn+ "^"+itemDtlStkInfo.inv_qty + "\" disabled>(품절) "+ itemList.opt_value +" </option>");
                	    	leyerRenderData.push( { disabled : "disabled", value : "(품절) "+ itemList.opt_value} );
        	    		} else {
        	    			$("#opt_value"+optcnt).append("<option value =\"" + itemList.opt_value + "^"+itemList.item_no+ "^"+itemDtlStkInfo.opt_stk_yn+ "^"+itemDtlStkInfo.inv_qty + "\">"
                	        	    + itemList.opt_value +" </option>");
                	    	leyerRenderData.push( { disabled : "", value : itemList.opt_value } );
        	    		}
        	    		
        	    	}
        	    	//$("#opt_value"+optcnt).attr('selectedIndex','0');
        	    	$("#opt_value"+optcnt+" option:first").attr('selected',true);
        	    	$compile($("#opt_value"+optcnt))($scope);
        	    	// 바로 주문 레이어 렌더
        	    	$scope.setLayerOptionRender( leyerRenderData, optnum+1 );
        	    	
        	    	
        			// 옵션 그리는 로직
//        	        $.ajax({
//        	            type: 'get'
//        	            , async: false
//        	            , url: '/product/m/product_option_change.do'
//        	            , data: 'goodsno=${param.goods_no}&optcnt=' + optcount + '&optnum=' + optnum 
//        	            	+ '&opt1=' + optno1 + '&opt2=' + optno2 + '&opt3=' + optno3 + '&opt4=' + optno4 +'&invMgmtYn='+invMgmtYn
//        	            	+ '&<%=commonParam %>'
//        	            , success: function(response) {
//        	                $("div#script").html(response);
//        	            }
//        	        });
        	    }
        	    else {
        	    	this.setOption(optnum, obj);
        	        // 하위 옵션을 초기화 한다.
        			for(i=optnum+1; i<optcount+1; i++) {
        				$("#opt_value"+i+" option:first").attr('selected',true);
        				$('div.option_list_layer').find('.s_box01').eq(i).find('.tl a').text( '선택하세요' );
        			}
        	    }
        	
        	    // 바로주문 레이어 값 변경
        		if ( $scope.initOptValue(optval)[0] == '' ) {
        			$('div.option_list_layer').find('.s_box01').eq(optnum-1).find('.tl a').text( '선택하세요' );
        		} 
        		else {
        	    	$('div.option_list_layer').find('.s_box01').eq(optnum-1).find('.tl a').text( $scope.initOptValue(optval)[0] );
        		}
        		return false;
        	};
        	
        	
        	
        	//옵션 초기화
        	var setOption = function (optnum, obj){
        		
        		var empty_str = "<option value=''>선택하세요</option>";
        		var html_str = empty_str;
        		var nxt_opt = parseInt(optnum) + 1;
        		var opt = "";
        		var opt_val;
        		
        	    for( var i=1 ; i <= optnum ; i++ ){
        	    	opt_val = $("#frm_input select[name=opt_value"+i+"]").val().split("^");
        	    	
        	        opt+=(opt==""?"":"x")+opt_val[1];
        	    } 
        	    
        	    var option_item_arr = $("input[name=option_item]:hidden");
        	    var opt_str_len = opt.length;
        	    var opt_id = "";
        	    var opt_arr;
        	    var leyerRenderData = []; 
        	    for(var i=0; i<option_item_arr.length; i++){
        	        opt_id = option_item_arr[i].id
        			opt_arr = opt_id.split("x");
        	        
        	        if (nxt_opt==opt_arr.length && opt_str_len < opt_id.length && opt == opt_id.substring(0, opt_str_len)){
        	
        	                html_str += option_item_arr[i].value;
        	
        	                var value = option_item_arr[i].value.replace(/(<([^>]+)>)/ig, "");
        					leyerRenderData.push( { disabled : ( value.indexOf("품절") != -1 ? "disabled" : "" ) , value : value  } );
        					
        	        }
        	    }
        	
        	    $("#frm_input select[name=opt_value"+nxt_opt+"]").html(html_str);
        	
        	    $scope.setLayerOptionRender( leyerRenderData , nxt_opt )
        	    
        	};
        	
        	// 바로주문 레이어 옵션 랜더링
        	$scope.setLayerOptionRender = function ( data, optNum ){        	
        		var el = "";        		
        		$(data).each(function( idx , item ){
        			if( item.disabled != "" )
        				el += '<li><a href="#go" disabled>' + item.value + '</a></li>';
        			else
        				el += '<li><a href="#go1" ng-click="setLayerOrderQty('+ optNum + ', '+(idx+1)+');">' + item.value + '</a></li>';
        		});
        	
        		$( '#option_select_layer_' + optNum + ' .option_select ul' ).html( el );
        		
        		$compile($( '#option_select_layer_' + optNum + ' .option_select ul' ))($scope);
        		//$compile($( '#option_select_layer_' + optNum + ' .option_select ul' ).html())($scope);
        		$('div.option_list_layer').find('.s_box01').eq(optNum).find('.tl a').text( '선택하세요' );
        	};
        	
        	$scope.$on('ngRepeatFinished',function(ngFinishedEvent){        		        		
        	});
        	
        	//상품구매 레이어 Check        	
        	$scope.openOptionCheckYn = false; //바로주문 사용여부 
        	$scope.openOptionCheck = function (strLink){
        		var $opLayer = angular.element('.detail_option_layer'),
        		$optionBtn = angular.element('.detail_option_layer > .layer_head > a'),
        		$opSelect = angular.element('div.option_select_layer'),
        		$opLayerList = angular.element('.option_list_layer'),
    			$selBtn = $opLayerList.find('div.tl'),
    			$selectBtn = $opSelect.find('.layer_head > a'),
    			$list = $opSelect.find('div.option_select > a');
        		
        		if($scope.openOptionCheckYn){
        			if ( "imallBuy" == strLink) {
        				$scope.buy('imall');
        			} else if ( "imallCart" == strLink ) {
        				$scope.cartAdd('imall');
        			} else if ( "buy" == strLink ) {
        				$scope.buy('buy');
        			} else if ( "reserve" == strLink ) {
        				$scope.buy('reserve');
        			} else if ( "cart" == strLink ) {
        				$scope.cartAdd();
        			} else if ( "smart" == strLink ) {
        				$scope.buy('smart');
        			} else if ( "wish" == strLink ) {
        				$scope.wishListAdd()
        			}
        		}else{
        			$opLayer.css("bottom","50px"); //바로주문 열기
        			$scope.openOptionCheckYn = true;
        		}    		
	    		$optionBtn.click(function(){ //바로주문 닫기
	    			console.log("wer")
	        		$opLayer.css("bottom", -500 );
	        		$scope.openOptionCheckYn = false;
	        	});
	    		$selBtn.click(function(){ //옵션 셀렉트레이어 열기
	        		$(this).parent().parent().find("div.option_select_layer").addClass("act").css("bottom","50px");
	        	});
	    		$selectBtn.click(function(){ //옵션 셀렉트레이어 닫기
	    			$(this).parent().parent().removeClass("act").css("bottom", "-500px");
	    		});
        	};
		      
        	
	        	//상품구매 레이어 Check
	        	$scope.wishListAdd = function ()
	        	{
	        		console.log('wishListAdd : called');
	        		var qty = $("#frm_send input[name=order_qty]:hidden").val();
	        	    
	        		var optcount  = $("#frm_input select[name^=opt_value]").length;	// 옵션갯수
	        	    for (var i=1; i<=optcount; i++){
	        	    
	        		    if( $scope.isSoldout($("#frm_input select[name=opt_value"+i+"]").val()) ){
	        		       alert("선택하신 제품은 품절되었습니다.");
	        		       return;
	        		   }
	        	    }
	        	
	        		if (qty < 1){
	        			alert('주문수량을 선택해 주세요.');
	        			return;
	        		}
	        	
	        		if($scope.BasicData.product.smpExgYn == "Y"){
	        			var smartpickdate =  $("select[name=smartpickdate] option:selected").val();
	        			var sptoday = $("input[name=sptoday]:hidden").val();
	        	
	        		    var now = new Date();
	        	
	        			var dd = now.getDate();
	        			var mm = now.getMonth();
	        			var yyyy = now.getFullYear();		
	        			var today	= yyyy+(mm+1)+dd;
	        	
	        			var hour = now.getHours();
	        			if(hour < 10)
	        			{
	        				hour = "0" + hour;
	        			}
	        		 	
	        		 	if ( smartpickdate == today ) {
	        		 		if ( sptoday == 'Y' && hour > 10) {
	        		 			alert('당일 주문 가능한 시간이 지났습니다.\n다른 일자를 선택해 주세요.');
	        		 			return;
	        		 		}
	        		 	}
	        	
	        		 	if ( $.trim(smartpickdate) == '' )
	        		 	{
	        		 		alert('픽업예정일을 선택해 주세요.');
	        		 		return;
	        		 	}
	        		 } 	
	        		if ($scope.BasicData.login_check != "1"){
	        			$scope.loginProc('Y');
		    		    return false;
	        		}
	        		 
	        		$http.get(LotteCommon.productWishInsData, {params:{
	        			
						goods_no: $scope.BasicData.goods_no,
						goods_cmps_cd: $scope.BasicData.product.goods_cmps_cd,
				        goods_choc_desc: $("#frm_send input[name=goodsChocDesc]:hidden").val(),
				        ord_qty: "1",
				        item_no: $("#frm_send input[name=itemno]:hidden").val(),
				        dno: $scope.reqParam.curDispNo,
				        mc: "",
				        smp_vst_shop_no: $("#frm_send input[name=smpVstShopNo]:hidden").val(),
				        smp_vst_rsv_dtime: $("#frm_send input[name=smartpickdate]:hidden").val(),
				        conr_no: "0",
				        smp_tp_cd : $scope.BasicData.product.smp_tp_cd,
				        smp_deli_loc_sn : $scope.smp_deli_loc_sn
		            }})
	                .success(function(data) {
		                    alert("저장되었습니다.");
	//	                    $('#wishAdd').addClass('off');
	                })
	                .error(function(ex) {
	                	if (ex.error.response_code == '1001'){
	                		alert("이미 담은 상품입니다.");
	                	} else if (ex.error.response_code == '2000'){
	                		alert("로그인이 필요한 서비스입니다.");
	                		$scope.loginProc('Y');
	                	} else {
	                		alert("프로그램 오류로 인해 처리되지 않았습니다." );
	                	}
	                });
	        	   
	        	};
	        		        	
	        	//장바구니 담기
	        	$scope.cartAdd = function(imall){
	        		var checkResult = $scope.cartCheckResult();
	        		if (checkResult != ""){
	        			alert(checkResult);
	        			return;
	        		}
	        	    /** 홈쇼핑 상품인경우 - 연동에 의해 장바구니 담기가 결정됨 */
	        		if(imall&&imall=='imall'){
	        			$scope.imall_prod_chk('cart', $("#frm_send input[name=itemno]:hidden").val()); // 아이몰 재고수량 체크
	        		} else {
	        			$scope.cartAddProc();
	        		}
	        	};
	        	//cartAdd end
	        	
	        	//cartAdd common
	        	$scope.cartAddProc = function (){
	        		$http.get(LotteCommon.mylotteCartInsData, {params:{
        				goods_no: $scope.BasicData.goods_no,
						item_no: $("#frm_send input[name=itemno]:hidden").val(),
						goods_cmps_cd: $scope.BasicData.product.goods_cmps_cd,
						goods_choc_desc: $("#frm_send input[name=goodsChocDesc]:hidden").val(),
						ord_qty: $("#frm_send input[name=order_qty]:hidden").val(),
						infw_disp_no: $scope.reqParam.curDispNo,
						infw_disp_no_sct_cd : $scope.reqParam.curDispNoSctCd,
						master_goods_yn: $scope.BasicData.product.master_goods_yn,
						cart_sn: "",
						cart_no: "",
						cmps_qty: "0",
						mast_disp_no: $scope.BasicData.product.mast_disp_no,
						smp_tp_cd : $scope.BasicData.product.smp_tp_cd,
				        smp_deli_loc_sn : $scope.smp_deli_loc_sn
		            }})
	                .success(function(data) {
	                	if (!confirm("장바구니에 상품이 담겼습니다. \n장바구니로 이동하시겠습니까?")){
	                        return;
	                    }
	                    //장바구니로 이동시 탭셋팅값
	                    var type = "normal";
	                    if ($scope.BasicData.product.entr_no == '13145'){
	                    	type = "imall";
	                    } else if ($scope.BasicData.product.entr_no == '443808'){
	                    	type = "manggo";
	                    } else if ($scope.BasicData.product.entr_contr_no == '226680'){
	                    	type = "book";
	                    }
	                    var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"cart");
	                    $window.location.href = LotteCommon.cateLstUrl + "?type="+type + "&" + $scope.baseParam;
	                    //location.href = "defaultDomain/mylotte/cart/cart_list.do?commonParam&tclick=prod_tclick_cart&type="+type;
	                })
	                .error(function(ex) {
	                	if (ex.error.response_code == 'M000200'){
	                		alert(ex.error.response_msg);
	                		$scope.loginProc('Y');
	                	} else {
	                		alert("프로그램 오류로 인해 처리되지 않았습니다." );
	                		console.log('[Error]Cart Save Fail', ex.error.response_msg);
	                	}
	                });
	        	};
	        	//cartAdd common end
	        	//cart and buy option check
	        	$scope.cartCheckResult = function(){
	        		var checkResult = ""; 
	        		var qty = $("#frm_send input[name=order_qty]:hidden").val();
	        	    
		        	  var opt_name1   = $("#frm_input input[name=opt_name1]").val();
		        	  var opt_name2   = $("#frm_input input[name=opt_name2]").val();
		        	  var  opt_name3   = $("#frm_input input[name=opt_name3]").val();
		        	  var  opt_name4   = $("#frm_input input[name=opt_name4]").val();
		        	  var  opt_name5   = $("#frm_input input[name=opt_name5]").val();
		        	    
		        	  var  opt_value1  = $("#frm_input select[name=opt_value1]").val();
		        	  var  opt_value2  = $("#frm_input select[name=opt_value2]").val();
		        	  var  opt_value3  = $("#frm_input select[name=opt_value3]").val();
		        	  var  opt_value4  = $("#frm_input select[name=opt_value4]").val();
		        	  var  opt_value5  = $("#frm_input select[name=opt_value5]").val();
		        	  var checkGoodsChocDesc = $scope.setGoodsChocDesc();
		        	    if ( $.trim(opt_name1) != '' && $.trim(opt_value1) == '' ) {
		        	    	checkResult = opt_name1 + '을(를) 선택해주세요.';
		        	        return checkResult;
		        	    } else if ( $.trim(opt_name2) != '' && $.trim(opt_value2) == '' ) {
		        	    	checkResult = opt_name2 + '을(를) 선택해주세요.';
		        	        return checkResult;
		        	    } else if ( $.trim(opt_name3) != '' && $.trim(opt_value3) == '' ) {
		        	    	checkResult = opt_name3 + '을(를) 선택해주세요.';
		        	        return checkResult;
		        	    } else if ( $.trim(opt_name4) != '' && $.trim(opt_value4) == '' ) {
		        	    	checkResult = opt_name4 + '을(를) 선택해주세요.';
		        	        return checkResult;
		        	    } else if ( $.trim(opt_name5) != '' && $.trim(opt_value5) == '' ) {
		        	    	checkResult = opt_name5 + '을(를) 선택해주세요.';
		        	        return checkResult;
		        	    } else if (checkGoodsChocDesc != "" ){
		        	        return checkGoodsChocDesc;
		        	    }

		        	   var optcount  = $("#frm_input select[name^=opt_value]").length;
		        	    for (var i=1; i<=optcount; i++){
		        		    if( $scope.isSoldout($("#frm_input select[name=opt_value"+i+"]").val()) ){
		        		    	checkResult = "선택하신 제품은 품절되었습니다.";
		        		       return checkResult;
		        		   }
		        	    }

		        	    if (qty < 1){
		        	    	checkResult = '주문수량을 선택해 주세요.';
		        			return checkResult;
		        		}
		        	    $("#frm_send input[name=qty]:hidden").val( qty );
		        	    
		        	    $("#frm_send input[name=opt_name1]:hidden").val( opt_name1 );
		        	    $("#frm_send input[name=opt_name2]:hidden").val( opt_name2 );
		        	    $("#frm_send input[name=opt_name3]:hidden").val( opt_name3 );
		        	    $("#frm_send input[name=opt_name4]:hidden").val( opt_name4 );
		        	    $("#frm_send input[name=opt_name5]:hidden").val( opt_name5 );
		        	
		        	    $("#frm_send input[name=opt_value1]:hidden").val( opt_value1 );
		        	    $("#frm_send input[name=opt_value2]:hidden").val( opt_value2 );
		        	    $("#frm_send input[name=opt_value3]:hidden").val( opt_value3 );
		        	    $("#frm_send input[name=opt_value4]:hidden").val( opt_value4 );
		        	    $("#frm_send input[name=opt_value5]:hidden").val( opt_value5 );
		        	    return checkResult;
	        	}
	        	
	        	//바로구매, 예약구매, 스마트픽구매
	        	$scope.buy = function buy(buy){
	        	    var loginCheck = $scope.BasicData.login_check;
	        	    var dlvGoodsSctCd = $scope.BasicData.product.dlv_goods_sct_cd;
	        	    var orderYn = $scope.BasicData.order_yn;
	        	    var deliveryInfo = $scope.BasicData.product.delivery_info;
	        	    var delivery = deliveryInfo.replace("순차적", "주문순서대로");
	        	    
	        	    var checkResult = $scope.cartCheckResult();
	        		if (checkResult != ""){
	        			alert(checkResult);
	        			return;
	        		}
	        		if(orderYn == 'N'){
	        	        alert("롯데닷컴 정회원만 주문/결제가 가능합니다. 정회원 신청은 롯데닷컴 웹사이트를 이용해 주세요.");
	        	        return;
	        	    }
	        		
	        		if (buy!="smart" && loginCheck != '1'){
	        	    	if(dlvGoodsSctCd == '03')alert("본 상품은 주문제작상품으로서 고객님의 주문을 확인한 후 제작에 착수합니다. 실제 상품제작 7일~12일 소요(토,일,공휴일제외) 배송정보를 꼭 확인해 주세요.");
	        	    	if(buy == 'imall'){		//홈쇼핑 상품
	        	    		$scope.imall_prod_chk('buylogin', $("#frm_send input[name=itemno]:hidden").val());
	        	    	}else{
	        	    		$("#frm_send").attr("action", M_HOST_SSL + "/login/loginForm.do?"+$scope.baseParam+"&fromPg=" + ONENONE_BUY_LOGIN +"&minority_yn="+$scope.BasicData.minority_limit_yn +"&smp_buy_yn="+(buy=='smart'?'Y':'N')+"&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8'));
	        		    	$("#frm_send").submit();
	        	    	}
	        	
	        	    } else if (buy == 'imall'){
	        	    	$scope.imall_prod_chk('buy', $("#frm_send input[name=itemno]:hidden").val());
	        	    } else {
	        	    	if ('${product.lgf_tgt_yn }' == 'Y'){ // LG 패션 재고 관리
	        	    		$scope.lgFashionStockMng(buy, dlvGoodsSctCd, delivery); 
	        	    	}else{
	        	        	$scope.dotcom_buy(buy, dlvGoodsSctCd, delivery);
	        	    	}
	        	    }
	        	};
	        	//$scope.buy end
	        	
	        	//입력형 상품 체크 및 파라메터 생성
	        	$scope.setGoodsChocDesc = function (){
	        		var checkResult = "";
	        		if ($("input[name=opt_input_name]") == "undefiend") { return true; } // 입력형이 없을 경우
	        		
	        		var goodsChocDesc = "";
	        		var opt_len = $("input[name=opt_input_name]").length;
	        		var opt_name = "";
	        		var opt_type = "";
	        		var opt_value= "";

	        		for (var i = 0 ; i < opt_len ; i++){
	        			opt_type = $("#frm_input input[name=opt_input_type]:eq("+i+")").val();
	        			opt_name = $("#frm_input input[name=opt_input_name]:eq("+i+")").val();
	        			opt_value= $("#frm_input input[name=opt_input_value]:eq("+i+")").val();
	        			if ( opt_name != '' && opt_value == '' ) {
	        				checkResult = opt_name + '을(를) 입력해주세요.';
	        		        return checkResult;
	        		    }
	        			
	        		    opt_value = opt_value.replace(/-/gi, "");
	        		    
	        			if (i > 0) { goodsChocDesc += SPLIT_GUBUN_3; } // SPLIT_GUBUN_3-> angular_common_..jsp

	        			goodsChocDesc += opt_type;
	        			goodsChocDesc += ":"+opt_name;
	        			goodsChocDesc += ":"+opt_value;
	        		}

	        		$("#frm_send input[name=goodsChocDesc]:hidden").val( goodsChocDesc );
	        		
	        		return checkResult;
	        	};
	        	//setGoodsChocDesc end
	        	
	        	// 아이몰 재고 체크
	        	$scope.imall_prod_chk = function (gubun, opt_value){
	        		$http.get(LotteCommon.productImallStockCheckData, {params:{
	        			ord_qty : $("#frm_send input[name=order_qty]:hidden").val(),
        		    	goods_no : $scope.BasicData.goods_no,
        		    	item_no : opt_value
		            }})
	                .success(function(data) {
	                	if (gubun == "buy") {
	                		if(data.gift_goods_nos != "" ) {
	    						$('#frm_send input[name=gift_goods_no]:hidden').val(data.gift_goods_nos);
	    						$('#frm_send input[name=girtGoodsChoice]:hidden').val('Y');
	    					}
	                		$("#frm_send").attr("action", M_HOST_SSL + "/product/m/imall_select_present.do?"+$scope.reqParamStr+"&mastDispNo="+$scope.BasicData.product.mast_disp_no + "&tclick=m_o_buynow");
	        	            $("#frm_send").submit();
	                	} else if (gubun == "buylogin"){
	                		$("#frm_send").attr("action", M_HOST_SSL + "/login/loginForm.do?"+$scope.baseParam+"&fromPg="+IMALL_BUY_LOGIN+"&minority_yn="+$scope.BasicData.minority_limit_yn +"&smp_buy_yn="+(buy=='smart'?'Y':'N')+"&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8'));
        			    	$("#frm_send").submit();
	                	} else if (gubun == "cart"){
	                		$scope.cartAddProc();
	                	}
	                })
	                .error(function(ex) {
	                	if (ex.error.response_code == '1000'){
	                		alert(ex.error.response_msg);
        			    	location.reload();
	                	} else {
	                		alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
	                	}
	                });
	        	};
	        	//imall_prod_chk end
	        	
	        	//LG패션 재고 관리
	        	$scope.lgFashionStockMng = function (buy, dlvGoodsSctCd, delivery){
	        	
	        		var item_no = $("#frm_send input[name=itemno]:hidden").val();
	        		var ord_qty = $("#frm_send input[name=order_qty]:hidden").val();
	
	        		$http.get(LotteCommon.productLgStockCheckData, {params:{
	        			ord_qty : $("#frm_send input[name=order_qty]:hidden").val(),
        		    	goods_no : $scope.BasicData.goods_no,
        		    	item_no : opt_value,
        		    	entr_no : $scope.BasicData.product.entr_no
		            }})
	                .success(function(data) {
	                	$scope.dotcom_buy(buy, dlvGoodsSctCd, delivery);
	                })
	                .error(function(ex) {
	                	if (ex.error.response_code == '1000'){
	                		alert(ex.error.response_msg);
	                	} else {
	                		alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
	                	}
	                });
//		        		
//	        		$.ajax({
//	        			type: 'post'
//	        			, async: false
//	        			, url: '/popup/lg_fashion_stock_mng.do?'+$scope.baseParam
//	        			, data: 'goods_no='+$scope.BasicData.goods_no+'&item_no='+item_no+'&entr_no='+$scope.BasicData.product.entr_no +'&ord_qty='+ord_qty
//	        			, success: function(response) {
//	        				if(response!=""){
//	        					alert(response);
//	        					return;
//	        				}else{
//	        					$scope.dotcom_buy(buy, dlvGoodsSctCd, delivery);
//	        				}		
//	        			}
//	        		});
	        	};
	        	//lgFashionStockMng end
	        	
	        	//공통 주문처리 코드
	        	$scope.dotcom_buy = function (buy, dlvGoodsSctCd, delivery){ 
	        		if(buy == 'buy'){
	        	        if(dlvGoodsSctCd == '03')alert("본 상품은 주문제작상품으로서 고객님의 주문을 확인한 후 제작에 착수합니다. 실제 상품제작 7일~12일 소요(토,일,공휴일제외) 배송정보를 꼭 확인해 주세요.");  
	        	        var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"directorder");
	        	        $("#frm_send").attr("action", M_HOST_SSL + "/product/m/select_present.do?"+$scope.reqParamStr+"&mastDispNo="+$scope.BasicData.product.mast_disp_no+"&tclick="+tclickcd);
	        	        
	        	    } else if (buy == 'smart'){
	        	    	
	        	       $("#frm_send").attr("action", M_HOST_MOBILE + "/product/m/product_visit_date.do?"+$scope.reqParamStr+"&mastDispNo="+$scope.BasicData.product.mast_disp_no + ($scope.BasicData.spick_app_yn=='Y' ? "&spick_app_yn="+$scope.BasicData.spick_app_yn :"" ));
	        	       $("#frm_send input[name=smartOrd]:hidden").val("Y");
	        	
	        	    } else if (buy == 'reserve'){
	        	        if ( dlvGoodsSctCd == '03' ) {
	        	            alert("본 상품은 주문제작상품으로서 고객님의 주문을 확인한 후 제작에 착수합니다. 실제 상품제작 7일~12일 소요(토,일,공휴일제외) 배송정보를 꼭 확인해 주세요.");
	        	        }
	        	        if(confirm("본 상품은 예약상품이므로 " + delivery + "됩니다. 배송일자를 미리 확인하시기 바랍니다.")){
	        	            $("#frm_send").attr("action", M_HOST_SSL +"/product/m/select_present.do?"+$scope.reqParamStr+"&mastDispNo=" + $scope.BasicData.product.mast_disp_no);
	        	        }else{
	        	            return ;
	        	        }
	        	    }
	        	    
	        	    $("#frm_send").submit();
	        	};
	        	//dotcom_buy end
            }
        };
    }]);
    
    
  //Directive :: 상품이미지 정보
    app.directive('imagelist', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/product/gucciImagelist.html',
            replace:true,
            link:function($scope, el, attrs) {
        		console.log('gucciImagelist', 'called');
        		$scope.imageList = [];
        		function addImage(img_url){
        			if (img_url != null && img_url != ''){
    	        		var item = {}; item.imgUrl = img_url.replace('_280', '_550');
    	        		$scope.imageList.push(item);
            		}
        		}
        		addImage($scope.BasicData.product.img_url0);
        		//addImage($scope.BasicData.max.product.img_url1);
        		
            }
        };
    }]);
  //Directive :: 상품주문관련 Form 정보
    app.directive('productFormInfo', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/product/productFormInfo.html',
            replace:true,
            link:function($scope, el, attrs) {
        		console.log('productFormInfo', 'called');
        		
            }
        };
    }]);
    
   
    
    // Directive :: 상품정보>상품설명>가격정보
    app.directive('productInfoPrice', [function() {
        return {
            templateUrl: '/lotte/resources_dev/product/product_info_price.html',
            replace:true,
            link : function(){
        		console.log('productInfoPrice', 'called');
        	}
        };
    }]);   
    
 // Directive :: 상품상세 Html정보 셋팅
    app.directive('productDetailHtml', ['$http','$timeout','LotteCommon',function($http,$timeout,LotteCommon) {
        return {
	        	link:function($scope, el, attrs) {
		        	console.log('productDetailHtml reqParam', $scope.reqParam);
		            $http.get(LotteCommon.productProductDetailData, {params:$scope.reqParam})
		            .success(function(data) {
		                $scope.DetailData = data.max.dtl_info_fcont; //상품기본정보 로드
		                $scope.isDetailData = true;
		                el.html($scope.DetailData);
		            })
		            .error(function() {
		                console.log('Data Error : 상품상세정보 로드 실패');
		            });
	        	}
        };
    }]); 

////////////////////////////////////////////////////////
///// 상품 상세 js start    
////////////////////////////////////////////////////////   
    // 전체 Controller
    app.controller('ProductDetailCtrl', ['$scope', '$http', '$routeParams', '$location', 'LotteCommon','Fnproductview','commInitData', function($scope, $http,$routeParams, $location, LotteCommon,Fnproductview,commInitData) {
    	console.log('ProductDetailCtrl call start');
    	
        $scope.reqDetailParam = {
            	upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호 
            	dispDep : Fnproductview.objectToString(commInitData.query['dispDep']), 
            	curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
            	goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
            	wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
            	cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
            	item_no : Fnproductview.objectToString(commInitData.query['item_no']),
            	genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
            	cn : Fnproductview.objectToString(commInitData.query['cn']),
            	cdn : Fnproductview.objectToString(commInitData.query['cdn']),
            	curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
            	tclick : Fnproductview.objectToString(commInitData.query['tclick']),
            	page : Fnproductview.objectToString(commInitData.query['page']),
            	sort: Fnproductview.objectToString(commInitData.query['sort']),
            	siteNo: Fnproductview.objectToString(commInitData.query['siteNo'])
            };
        $scope.reqDetailParamStr = $scope.baseParam;
        if ($scope.reqDetailParam.curDispNoSctCd != null){$scope.reqDetailParamStr += "&curDispNoSctCd="+$scope.reqDetailParam.curDispNoSctCd;}
        if ($scope.reqDetailParam.curDispNo != null){$scope.reqDetailParamStr += "&curDispNo="+$scope.reqDetailParam.curDispNo;}
        if ($scope.reqDetailParam.goods_no != null){$scope.reqDetailParamStr += "&goods_no="+$scope.reqDetailParam.goods_no;}

       
        $scope.productInfotabIdx = 0;
        $scope.productInfotabUrl = "";
        $scope.prdZoomImg = "";
        $scope.SaleBestData="";
        
        //CommentViewList paging 테스트
        $scope.CommentViewList = [];
        $scope.CommentViewCurrnetPage = 1; 	//상품평 현재페이지
        
        //CommentViewList paging 테스트
        $scope.FaqList = [];
        $scope.FaqListPage = 1;//faq 현재페이지
        
        $scope.loadingTabData = function(idx) {
        	
        	$scope.productInfotabIdx = idx;
        	console.log('productInfotabIdx', $scope.productInfotabIdx);
        	switch(idx) {
	    		case 0:
	    			$scope.productInfotabUrl=LotteCommon.productProductDetailDataA;//상품상세
	    			break;
	    		case 1:
	    			$scope.productInfotabUrl=LotteCommon.commentCommentViewMobileData;//상품평
	    			break;
	    		case 2:
	    			$scope.productInfotabUrl=LotteCommon.commentProductQuestListMobileData;//[상품상세]faq List
	    			break;
        	}
        	
        	if(idx < 3){
        		console.log('params',$scope.reqParam);
	        	$http.get($scope.productInfotabUrl, {params:$scope.reqParam})
	        	.success(function(data) {
	        		switch(idx) {
		        		case 0:
		        			$scope.func_Tab0(idx,data);
		        			break;
		        		case 1:
		        			$scope.func_Tab1(idx,data);
		        			break;
		        		case 2:
		        			$scope.func_Tab2(idx,data);
		        			break;
	        		}
	        	})
	        	.error(function() {
	        		 console.log('Data Error : 상품기본정보 로드 실패');
	        	});
        	}else if (idx == 3){
        		$scope.func_Tab3(idx);
        	}
        	//구매정보 일경우 데이터만 보여주고 있는 데이터 보이는 화면 처리만 ajax는 필요 없음
        	if($scope.SaleBestData == ""){
        		 $scope.func_SaleBestData();
        	}	
        	
        };
        
        // 상품설명tab0
        $scope.func_Tab0 = function(idx,data){
        	console.log('func_Tab0', data);
        	$scope.productInfoDetailCase=4; 
        	if(data.result){
        		console.log('result');
        		$scope.PrdExplainData = data.result; //상품기본정보 로드
	            $scope.isPrdExplainData = true;
	            if(data.result.spdp_shp_goods_tmpl_cd == "A"){
	            	$scope.productInfoDetailCase = 1;
	            }else if(data.result.spdp_shp_goods_tmpl_cd == "B"){
	            	if(data.result.spdp_shp_goods_brws_tp_cd == "1" ){
	            		$scope.productInfoDetailCase = 2;
	            	}else{
	            		$scope.productInfoDetailCase = 3;
	            	}
	            }
        	}else{
        		console.log('func_Tab0 html');
	            $scope.PrdExplainData = data.max.dtl_info_fcont; //상품기본정보 로드
	            $scope.isPrdExplainData = true;
	            
	            var html = $scope.PrdExplainData.replace(/<script/gi,"<noscript").replace(/<\/script/gi,"</noscript");
	            $scope.prdZoomImg= html;
	            $scope.lodomain= LotteCommon.productProductImgData+"?"+$scope.reqDetailParamStr;
	            console.log('$scope.lodomain',$scope.lodomain);
				$("#detailLayout").html(html);
        	}
        	console.log('productInfoDetailCase',$scope.productInfoDetailCase);
            //el.html($scope.PrdExplainData);
		    $("#detailTab0").show();
            $("#detailTab1").hide();
            $("#detailTab2").hide();
            $("#detailTab3").hide();
            //tab css 적용 필요 on off
	
        };
        
        // 상품평 tab1
        $scope.func_Tab1 = function(idx,data){
        	console.log('func_Tab1', data);
            $scope.PrdCommentData = data.data_set; //상품평
            $scope.isPrdCommentData = true;
            $scope.CommentViewList = data.data_set.product_review.items; //상품평 페이징
            
            $("#detailTab0").hide();
            $("#detailTab1").show();
            $("#detailTab2").hide();
            $("#detailTab3").hide();
	
        };
        // 상품평 tab2
        $scope.func_Tab2 = function(idx,data){
        	console.log('func_Tab2', data);
            $scope.FAQData = data.data_set; //Q&A
            $scope.isFAQData = true;
            $scope.FaqList = data.data_set.product_quest.items; //상품평 페이징
            $("#detailTab0").hide();
            $("#detailTab1").hide();
            $("#detailTab2").show();
            $("#detailTab3").hide();
 
            //$scope.isPrdExplainData = true;
        };
        
        // 상품 tab3
        $scope.func_Tab3 = function(idx){
        	//console.log('func_Tab3', data);
            //$scope.FAQData = data.faqList; //Q&A
            $("#detailTab0").hide();
            $("#detailTab1").hide();
            $("#detailTab2").hide();
            $("#detailTab3").show();
 
            //$scope.isPrdExplainData = true;
        };        
        /*
        $scope.prdZoom = function() {
        	if ($scope.prdZoomImg != undefined || $scope.prdZoomImg != "") {
        		
        	}else{
        		console.log('상품이미지가 없습니다.');
        	}
        };
        */
        $scope.prdZoom = function () {
        	  var modalInstance = window.open({
        	      templateUrl:'/lotte/resources_dev/product/prdZoomPop.html',
        	      replace:true,
                  link : function(){
              		console.log('prdZoom', 'called');
              	}
        	  });

        };
        
        $scope.func_SaleBestData = function() {
        	console.log('func_saleBestData1',$scope.reqParam);
        	$http.get(LotteCommon.productProductSalebestData, {params:$scope.reqParam})
        	.success(function(data) {
        		console.log('func_saleBestData2',data.max);
        		$scope.SaleBestData = data.max;
        	})
        	.error(function() {
        		 console.log('Data Error : saleBestData로드 실패');
        	});
        };
       
        $scope.getCommentViewListPaging = function(pageNum,fun_gubun) {
        	pageNum *= 1; 
        	$scope.CommentViewCurrnetPage = pageNum+1;        	
        	console.log('$scope.CommentViewCurrnetPage',$scope.CommentViewCurrnetPage);
        	$scope.reqDetailParam.page = $scope.CommentViewCurrnetPage;
        	
        	// 사진상품평순/최근상품평순
        	if(fun_gubun == "P" || fun_gubun == "L"){
        		$scope.reqDetailParam.sort = fun_gubun;
        	}

        	console.log('page',$scope.reqDetailParam);

        	$http.get(LotteCommon.commentCommentViewMobileData, {params:$scope.reqDetailParam})
        	.success(function(data) {
        		try {
        			var dataset = data.data_set;
        			if(dataset.product_review) {
        				for(var i=0;i < dataset.product_review.items.length;i++) {
                			$scope.CommentViewList.push(dataset.product_review.items[i]);
        				}
        			}
        			 $scope.PrdCommentData = data.data_set; //상품평
        		}catch(e) {
        		}
        	})
        	.error(function() {
        		 console.log('Data Error : getCommentViewListPaging 실패');
        	});
        	
        	console.log('$scope.CommentViewList22',$scope.CommentViewList);
        };

        // faq 페이징  작업 후 진행
        $scope.getFaqListPaging = function(pageNum) {
        	
        	$scope.FaqListPage = pageNum+1;
        	console.log('$scope.getFaqListPaging',$scope.FaqList);
        	$scope.reqDetailParam.page = $scope.FaqListPage;
        	console.log('page',$scope.reqDetailParam);
        	
        	$http.get(LotteCommon.custcenterFaqListData, {params:$scope.reqDetailParam})
        	.success(function(data) {
        		
    			try {
        			var dataset = data.data_set;
        			if(dataset.product_review) {
        				for(var i=0;i < dataset.product_quest.items.length;i++) {
                			$scope.FaqList.push(dataset.product_quest.items[i]);
        				}
        			}
        			 $scope.FAQData = data.data_set; ////Q&A
        		}catch(e) {
        		}
        	})
        	.error(function() {
        		 console.log('Data Error : getCommentViewListPaging 실패');
        	});
        	
        	console.log('$scope.getFaqListPaging',$scope.FaqList);
        };
        
        //$scope.productDetailLayer = []; //상품레이어 값 set
        $scope.productDetailLayer = { tgt_goods_nm:"" , sale_prc:0, spdp_shp_img_file_path_nm:""  , spdp_shp_img_file_nm:"" , lwnd_desc_fcont:"",immed_pay_dscnt_amt:""};
        
        $scope.productLayer = function(productOne) {
        	
        	if(productOne != null){
        		 console.log('productLayer productOne',productOne);
        		 
        		 $scope.productDetailLayer.tgt_goods_nm = productOne.tgt_goods_nm;
        		 $scope.productDetailLayer.sale_prc = productOne.sale_prc;
        		 $scope.productDetailLayer.spdp_shp_img_file_path_nm = productOne.spdp_shp_img_file_path_nm;
        		 $scope.productDetailLayer.spdp_shp_img_file_nm = productOne.spdp_shp_img_file_nm;
        		 $scope.productDetailLayer.lwnd_desc_fcont = productOne.lwnd_desc_fcont;
        		 $scope.productDetailLayer.immed_pay_dscnt_amt = productOne.immed_pay_dscnt_amt;
        		 //할인율 추가 필요	 
        		 
        		 $("#productDetailLayer").show();
        	}
        	console.log('$scope.productDetailLayer',$scope.productDetailLayer);
        	//alert($scope.productDetailLayer.tgt_goods_nm);
        };
        
        //layer close
        $scope.closeProductDetailLayer = function() {
        	$("#productDetailLayer").hide();
        };
        $scope.qnaListOpenClose = function (idx)  {
        	console.log('qnaListOpenClose idx',idx);
        	addClassFunc($(this).parent());
        	addClassFunc($('.qnaList li').eq(idx));
    	};

        //AddClass 함수
    	function addClassFunc(selElem){
    		$(selElem).addClass('on').siblings('.on').removeClass('on');
    	};

    }]);  
    
    // Directive :: 상품정보
    app.directive('productInfo', [function() {
        return {
            templateUrl: '/lotte/resources_dev/product/product_info.html',
            replace:true,
            link : function(){
        		console.log('productInfo', 'called');
        	}
        };
        
    }]);

    // Directive :: 상품정보
    app.directive('productInfoDetail', [function() {
        return {
            templateUrl: '/lotte/resources_dev/product/product_info_detail.html',
            replace:true,
            link : function(){
        		console.log('productInfoDetail', 'called');
        	}
        };
        
    }]);     
////////////////////////////////////////////////////////
///// 상품 상세 js end    
////////////////////////////////////////////////////////    
    
})(window, window.angular);