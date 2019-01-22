(function(window, angular, undefined) {
	'use strict';
	var tabIdx  =0;
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
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
	app.controller('ProductDetailPopUpCtrl', ['$scope', '$http', '$window', '$location', 'LotteCommon','Fnproductview','commInitData', function($scope, $http, $window, $location, LotteCommon,Fnproductview,commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;

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

		//console.log('productProductViewData', LotteCommon.productProductDetailHtmlData);
		//console.log('reqParam', $scope.reqParam);

		$http.get(LotteCommon.productProductDetailHtmlData, {params:$scope.reqParam})
		.success(function (data) {
			$scope.PrdExplainData = data.max; //상품기본정보 로드

			var html = $scope.PrdExplainData.replace(/<script/gi,"<noscript").replace(/<\/script/gi,"</noscript");
			//$scope.prdDetailHtml= html;

			angular.element("#htmlArea").html(html);
		})
		.error(function() {
			console.log('Data Error : productProductDetailData 메인페이지 데이터');
		});

		var $content = angular.element(".detail_zoom");
		$content.css(getTransformStyle($scope.contentScale));

		$scope.contentScale = angular.element($window).width() / 920;

		function getTransformStyle(scale) {
			return {
				"overflow": "hidden",
				"-ms-transform-origin": "0 0 0",
				"-moz-transform-origin": "0 0 0",
				"-o-transform-origin": "0 0 0",
				"-webkit-transform-origin": "0 0 0",
				"transform-origin": "0 0 0",
				"-ms-transform": "scale(" + scale + ", " + scale + ")",
				"-moz-transform": "scale(" + scale + ", " + scale + ")",
				"-o-transform": "scale(" + scale + ", " + scale + ")",
				"-webkit-transform": "scale(" + scale + ", " + scale + ")",
				"transform": "scale(" + scale + ", " + scale + ")"
			};
		}

		angular.element($window).on("resize", function () {
			$scope.contentScale = angular.element($window).width() / 920;
			$content.css(getTransformStyle($scope.contentScale));
		});

		// try {
		// 	if ($scope.appObj.isApp && $scope.appObj.iOsType != "iPad") {
		// 		if ($scope.appObj.isApp) {
		// 			//$window.lottesearch.callAndroid("lottesearch://newsearch");
		// 			$window.lottebridge.callAndroid("lottebridge://lotteapps/hide"); //android 액션바 감추기
		// 		} else {
		// 			//$window.location.href = "lottesearch://newsearch";
		// 			$window.location.href= "lottebridge://lotteapps/hide"; //ios는 액션바 감출 필요가 없음!!
		// 		}
		// 	}
		// } catch (e) {}
	}]);

	app.directive('productDetailNew', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
		return {
			templateUrl: "/lotte/resources_dev/product/m/product_detail_new.html",
			/*template: '<div class="smartNotice" ng-show="smartNoticeShow"><i class="close" ng-click="smartNoticeClose()"></i><p ng-click="smartNoticeClick()">{{smartNoticeMessage}}</p></div>',*/
			replace: true,
			link: function ($scope, el, attrs) {
				$scope.popLayerShow = true;

				$scope.goHistoryBack = function () {
					$window.history.go(-1);
				};

				// 3초 뒤 레이어 감추기
				$timeout(function () {
					$scope.popLayerShow = false;
				}, 2000);

				angular.element(el).find(".pop_zoom_info").on("transitionend.prddetail webkitTransitionEnd.prddetail oTransitionEnd.prddetail MSTransitionEnd.prddetail", function (event) {
					angular.element(this).hide();
				});
			}
		}
	}]);

/*
	app.directive('pinchZoom', ['$window', function($window) {
		var _directive =  {
			restrict: 'A',
			scope: false,
			link: _link
		};

		function _link(scope, element, attrs) {
			var elWidth = element[0].offsetWidth;
			var elHeight = element[0].offsetHeight;

			var mode = '';

			var distance = 0;
			var initialDistance = 0;

			var scale = angular.element($window).width() / 920;
			var relativeScale = angular.element($window).width() / 920;
			var initialScale = angular.element($window).width() / 920;
			var MAX_SCALE = 3;

			var positionX = 0;
			var positionY = 0;

			var initialPositionX = 0;
			var initialPositionY = 0;

			var originX = 0;
			var originY = 0;

			var startX = 0;
			var startY = 0;
			var moveX = 0;
			var moveY = 0;

			element.css({
				'-webkit-transform-origin' : '0 0',
				'transform-origin'         : '0 0'
			});

			element.on('touchstart', function (evt) {
				console.log("touchstart");

				evt.touches = evt.touches || evt.originalEvent.touches;

				startX = evt.originalEvent.touches[0].pageX;
				startY = evt.originalEvent.touches[0].pageY;
				initialPositionX = positionX;
				initialPositionY = positionY;
				moveX = 0;
				moveY = 0;
				mode = '';

				if (evt.touches.length === 2) {
					initialScale = scale;
					initialDistance = getDistance(evt);
					originX = evt.touches[0].pageX -
					parseInt((evt.touches[0].pageX - evt.touches[1].pageX) / 2, 10) -
					element[0].offsetLeft - initialPositionX;
					originY = evt.touches[0].pageY -
					parseInt((evt.touches[0].pageY - evt.touches[1].pageY) / 2, 10) -
					element[0].offsetTop - initialPositionY;
				}
			});

			element.on('touchmove', function(evt) {
				evt.touches = evt.touches || evt.originalEvent.touches;

				evt.preventDefault();

				if (mode === 'swipe' && scale > 1) {
					moveX = evt.touches[0].pageX - startX;
					moveY = evt.touches[0].pageY - startY;

					positionX = initialPositionX + moveX;
					positionY = initialPositionY + moveY;

					transformElement();
				} else if (mode === 'pinch') {
					distance = getDistance(evt);
					relativeScale = distance / initialDistance;
					scale = relativeScale * initialScale;

					positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
					positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

					transformElement();
				} else {
					if (evt.touches.length === 1) {
						mode = 'swipe';
					} else if (evt.touches.length === 2) {
						mode = 'pinch';
					}
				}

				transformElement();
			});

			element.on('touchend', function(evt) {
				evt.touches = evt.touches || evt.originalEvent.touches;

				if (mode === 'pinch') {
					if (scale < 1) {
						scale = 1;
						positionX = 0;
						positionY = 0;
					} else if (scale > MAX_SCALE) {
						scale = MAX_SCALE;
						relativeScale = scale / initialScale;
						positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
						positionY = originY * (1 - relativeScale) + initialPositionY + moveY;
					}
				}

				if (scale > 1) {
					if (positionX > 0) {
						positionX = 0;
					} else if (positionX < elWidth * (1 - scale)) {
						positionX = elWidth * (1 - scale);
					}

					if (positionY > 0) {
						positionY = 0;
					} else if (positionY < elHeight * (1 - scale)) {
						positionY = elHeight * (1 - scale);
					}
				}

				transformElement(0.1);
			});

			function getDistance(evt) {
				var d = Math.sqrt(Math.pow(evt.touches[0].pageX - evt.touches[1].pageX, 2) +
				Math.pow(evt.touches[0].pageY - evt.touches[1].pageY, 2));
				return parseInt(d, 10);
			}

			function transformElement(duration) {
				var transition  = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '',
					matrixArray = [scale, 0, 0, scale, positionX, positionY],
					matrix      = 'matrix(' + matrixArray.join(',') + ')';

				element.css({
					'-webkit-transition' : transition,
					'transition'         : transition,
					'-webkit-transform'  : matrix + ' translate3d(0,0,0)',
					'transform'          : matrix
				});
			}
		}
		return _directive;
	}]);
*/
})(window, window.angular);