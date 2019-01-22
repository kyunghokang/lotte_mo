(function(window, angular, undefined) {
    'use strict';
    var tabIdx  =0;
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg',
        //  'lotteSideMylotte',
         'lotteCommFooter'
    ]);
    
    app.service('Fnproductview', function () {
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
        });
    
    // 전체 Controller
    app.controller('ProductDetailPopUpCtrl', ['$scope', '$http', '$location', 'LotteCommon','Fnproductview','commInitData', function($scope, $http, $location, LotteCommon,Fnproductview,commInitData) {
     
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
        
        $scope.showWrap = true;
        $scope.contVisible = true;

        console.log('productProductViewData', LotteCommon.productProductDetailHtmlData);
        console.log('reqParam', $scope.reqParam);
        $http.get(LotteCommon.productProductDetailHtmlData, {params:$scope.reqParam})
        .success(function(data){
        	$scope.PrdExplainData = data.max; //상품기본정보 로드
            $scope.isPrdExplainData = true;
            var html = $scope.PrdExplainData.replace(/<script/gi,"<noscript").replace(/<\/script/gi,"</noscript");
            $scope.prdZoomImg= html;
            console.log('html', html);
        })
        .error(function() {
            console.log('Data Error : productProductDetailData 메인페이지 데이터');
        });

    }]);
})(window, window.angular);