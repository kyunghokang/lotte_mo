(function(window, angular, undefined) {
	'use strict';

	var utilModule = angular.module('lotteUtil', []);
	
	/**
	 * start : ngStorage
	 * original source : https://github.com/gsklee/ngStorage/blob/master/ngStorage.js
	 */
	utilModule.provider('$localStorage', _storageProvider('localStorage'));
	utilModule.provider('$sessionStorage', _storageProvider('sessionStorage'));
    function _storageProvider(storageType) {
        return function () {
          var storageKeyPrefix = 'ngStorage-';

          this.setKeyPrefix = function (prefix) {
            if (typeof prefix !== 'string') {
              throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setKeyPrefix() expects a String.');
            }
            storageKeyPrefix = prefix;
          };

          var serializer = angular.toJson;
          var deserializer = angular.fromJson;

          this.setSerializer = function (s) {
            if (typeof s !== 'function') {
              throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setSerializer expects a function.');
            }

            serializer = s;
          };

          this.setDeserializer = function (d) {
            if (typeof d !== 'function') {
              throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setDeserializer expects a function.');
            }

            deserializer = d;
          };

          // Note: This is not very elegant at all.
          this.get = function (key) {
            return deserializer(window[storageType].getItem(storageKeyPrefix + key));
          };

          // Note: This is not very elegant at all.
          this.set = function (key, value) {
            return window[storageType].setItem(storageKeyPrefix + key, serializer(value));
          };

          this.$get = [
              '$rootScope',
              '$window',
              '$log',
              '$timeout',

              function(
                  $rootScope,
                  $window,
                  $log,
                  $timeout
              ){
                function isStorageSupported(storageType) {

                    // Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
                    // when accessing window.localStorage. This happens before you try to do anything with it. Catch
                    // that error and allow execution to continue.

                    // fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
                    // when "Block cookies": "Always block" is turned on
                    var supported;
                    try {
                        supported = $window[storageType];
                    }
                    catch (err) {
                        supported = false;
                    }

                    // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
                    // is available, but trying to call .setItem throws an exception below:
                    // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
                    if (supported && storageType === 'localStorage') {
                        var key = '__' + Math.round(Math.random() * 1e7);

                        try {
                            localStorage.setItem(key, key);
                            localStorage.removeItem(key);
                        }
                        catch (err) {
                            supported = false;
                        }
                    }

                    return supported;
                }

                // The magic number 10 is used which only works for some keyPrefixes...
                // See https://github.com/gsklee/ngStorage/issues/137
                var prefixLength = storageKeyPrefix.length;

                // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
                var webStorage = isStorageSupported(storageType) || ($log.warn('This browser does not support Web Storage!'), {setItem: angular.noop, getItem: angular.noop}),
                    $storage = {
                        $default: function(items) {
                            for (var k in items) {
                                angular.isDefined($storage[k]) || ($storage[k] = items[k]);
                            }

                            $storage.$sync();
                            return $storage;
                        },
                        $reset: function(items) {
                            for (var k in $storage) {
                                '$' === k[0] || (delete $storage[k] && webStorage.removeItem(storageKeyPrefix + k));
                            }

                            return $storage.$default(items);
                        },
                        $sync: function () {
                            for (var i = 0, l = webStorage.length, k; i < l; i++) {
                                // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
                                (k = webStorage.key(i)) && storageKeyPrefix === k.slice(0, prefixLength) && ($storage[k.slice(prefixLength)] = deserializer(webStorage.getItem(k)));
                            }
                        },
                        $apply: function() {
                            var temp$storage;

                            _debounce = null;

                            if (!angular.equals($storage, _last$storage)) {
                                temp$storage = angular.copy(_last$storage);
                                angular.forEach($storage, function(v, k) {
                                    if (angular.isDefined(v) && '$' !== k[0]) {
                                        webStorage.setItem(storageKeyPrefix + k, serializer(v));
                                        delete temp$storage[k];
                                    }
                                });

                                for (var k in temp$storage) {
                                    webStorage.removeItem(storageKeyPrefix + k);
                                }

                                _last$storage = angular.copy($storage);
                            }
                        },
                    },
                    _last$storage,
                    _debounce;

                $storage.$sync();

                _last$storage = angular.copy($storage);

                $rootScope.$watch(function() {
                    _debounce || (_debounce = $timeout($storage.$apply, 100, false));
                });

                // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
                $window.addEventListener && $window.addEventListener('storage', function(event) {
                    if (storageKeyPrefix === event.key.slice(0, prefixLength)) {
                        event.newValue ? $storage[event.key.slice(prefixLength)] = deserializer(event.newValue) : delete $storage[event.key.slice(prefixLength)];

                        _last$storage = angular.copy($storage);

                        $rootScope.$apply();
                    }
                });

                $window.addEventListener && $window.addEventListener('beforeunload', function() {
                    $storage.$apply();
                });

                return $storage;
              }
          ];
      };
    }
    // end : ngStorage    
    
	utilModule.service('LotteUtil', ['LotteCommon', function (LotteCommon) {
		//간편회원가입 사용자 유효성 체크 (작성자 : 김낙운 date : 20150615)
		var korCheck = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; // 한글외에 입력 정규식
		var engCheck = /([가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; // 한글제외 입력 정규식 //20150617 수정
		var blankAllCheck = /^\s+|\s+$/g; // 공백만 입력 확인 정규식
		var blankCheck = /[\s]/g; // 중간 공백 확인 정규식
		var numCheck = /^[0-9]*$/; // 숫자 정규식 // 20150616 정규식 수정
		var mixCheck = /^(?=.*[a-zA-Z])(?=.*[`~!@#$%^*+=-?:;.,|\\\{\}\[\]\(\)\/])(?=.*[0-9]).{6,16}$/; // 영문, 숫자, 특수문자 혼합 확인 정규식 // 20150618 수정
		var specificCheck = /([\<\>\&\'\"])/i; // 특수문자 제외 정규식
		var self = this;
		
		this.setUrlAddBaseParam = function(url, param) {
			if (url.indexOf('?') > -1) {
				url += '&' + param;
			} else {
				url += '?' + param;
			}

			return url;
		};
		
		//파라메터 처리 - baseParameter rudolph
		this.baseGetParameter = function(name) {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
					function(m,key,value) {
				vars[key] = value;
			});
			
			return vars[name];
		};
		
		//파라메터 처리 - 없으면 기본값 돌려줌 rudolph
		this.getParameter = function (name, defaultValue) {
			var rtnval = '';
			rtnval = this.baseGetParameter(name);		
			if (!rtnval) {
				rtnval = (typeof defaultValue == 'undefined' ? '' : defaultValue);
			}
			return rtnval;		
		};

		// Service에서 baseParameter 구하기
		this.getBaseParam = function () {
			var rtnBaseParam = "udid=" + self.getParameter("udid") + "&"
							+ "v=" + self.getParameter("v") + "&"
							+ "cn=" + self.getParameter("cn") + "&"
							+ "cdn=" + self.getParameter("cdn") + "&"
							+ "schema=" + self.getParameter("schema");

			return rtnBaseParam;
		};
		
		//urlencoding적용된 파라메터 값 rudolph
		this.getDecodeParameter = function(name) {
			var rtnval = '';
			rtnval = this.baseGetParameter(name);
			if (typeof rtnval != 'undefined' && rtnval.length != 0) { 
				rtnval = decodeURIComponent(rtnval.replace(/\+/g, " "));
			}
			return rtnval;
		};
		
		//파라메터 전체 반환 rudolph
		this.getParameters = function() {
			var nowAddress = location.href;
			nowAddress = nowAddress.replace(/#/g, "&");
			var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');
			
			var rtnParameter = new Array();
			for(var i = 0 ; i < parameters.length ; i++){
				var varName = parameters[i].split('=')[0];
				var varValue = parameters[i].split('=')[1];
			
				var parameter = new Object();
				parameter.name = varName;
				parameter.value = varValue == undefined?"":varValue;
				rtnParameter.push(parameter);			
			};

			return rtnParameter;		
		};

		/**
		 * 파라미터에서 지정된 이름의 파라미터만 선택하여 리턴
		 * @param name 선택할 파라미터의 이름
		 * @return Array
		 */
		this.getParametersByName = function(name) {
			var result = [];
			var searchs = location.search.split('&');
			var len = searchs.length;
			for (var i = 0; i < len; i++) {
				if (searchs[i].indexOf(name) != -1 && typeof searchs[i].split('=')[1] != 'undefined') {
					result.push(searchs[i].split('=')[1]);
				}
			}
			return result;
		};
		
		//파라메터가 포함된 url형식에서 파라메터 값을 반환 - rudolph:151002
		this.getUrlParameter = function(url, name) {
			var vars = {};
			var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
			function(m,key,value) {
				vars[key] = value;
			});
			
			return vars[name];			
		}		
		
		/*
		 * App인지 웹인지 판단
		 * @deprecated $scope.appObj.isApp으로 대체됨
		 */
		this.isApp = function() {
			var udid = this.getParameter('udid');
			var schema = this.getParameter('schema');
		
			if(udid != "" && schema != "")
				return true;
			else
				return false;	
		};
		
		//스마트픽 여부
		this.isSmp = function() {
			var smp_yn = this.getParameter('smp_yn', "N"); 
			if(smp_yn == "Y")
				return true;
			else
				return false;
		};
		
		//스마트픽 모바일웹 여부
		this.isSmpApp = function() {
			var schema = this.getParameter("schema");
			var isSmp = this.isSmp();
			var isApp = this.isApp();
			
			return (isSmp && isApp && (schema == "splotte001" ||schema == "splotte002" ||schema == "splotte002a"));
		};
		
		//엘롯데 모바일 앱 여부
		this.isEllotteApp = function() {
			var schema = this.getParameter("schema");
			var isApp = this.isApp();
			
			return (isApp && (schema == LOTTE_CONSTANTS['ELLOTTE_IOS_APP_SCHEMA'] || schema == LOTTE_CONSTANTS['ELLOTTE_ANDROID_APP_SCHEMA']));
		};
		
		//UserAgent값을 분석해서 Android폰인지 구분한다
		this.boolAndroid = function(ua) {
			var agent = ua.toLowerCase();
			if(agent.indexOf("android") >= 0) 
				return true;
			else
				return false;
		};
		
		//userAgent값을 분석해서 ipad인지 구분한다
		this.boolipad = function(ua) {
			var agent = ua.toLowerCase();
			if(agent.indexOf("ipad") >= 0)  
				return true;
			else
				return false;
		};
		
		/**
		 * dimmedOpen 레벨의 스코프를 찾아서 반환
		 */
		this.getAbsScope = function(scope) {
			if(scope.$parent.dimmedOpen == undefined) {
				return this.getAbsScope(scope.$parent);
			} else {
				return scope.$parent;
			}
		}
		
		//현재 시간이 시스템 점검 기간에 포함되는지의 여부 체크 rudolph-약간수정*/
		this.getCurrSysTimeChk = function(f_year, f_month, f_date, f_hour, f_minute, 
				t_year, t_month, t_date, t_hour, t_minute) {
			var currInSysTime = false;
			
			var cal1 = new Date();
			var cal2 = new Date(f_year, f_month - 1, f_date, f_hour, f_minute);
			var cal3 = new Date(t_year, t_month - 1, t_date, t_hour, t_minute);
			
			if(cal1.getTime() >= cal2.getTime() && cal1.getTime() <= cal3.getTime())
				currInSysTime = true;
			
			return currInSysTime;
		};
		
		//엘롯데 사이트 여부
		this.isEllotte = function() {
			if(LOTTE_CONSTANTS['ELLOTTE_HOST_MOBILE']) {
				return (location.href.indexOf(LOTTE_CONSTANTS['ELLOTTE_HOST_MOBILE']) != -1);
			}
			return false;
		};
		
		//로그인시드키?
		this.getLoginSeed = function() {
			var isEllotte = this.isEllotte();
			var loginSeed = isEllotte? LOTTE_CONSTANTS['ELLOTTE_LOGIN_SEED']: LOTTE_CONSTANTS['LOGIN_SEED'];
			return loginSeed;
		};
		
		//userAgent값을 분석해서 App설치가 가능한지 구분한다
		this.boolAppInstall = function(ua)  {
			var agent = ua.toLowerCase();
			if(agent.indexOf("iphone") >= 0 || agent.indexOf("ipod") >= 0 || agent.indexOf("ipad") >= 0) {
				return true;
			} else {
				return false;
			}
		};
		
		//도메인 변수를 함수로 만듦 rudolph
		this.defaultDomain = function() {
			return this.isEllotte()? LOTTE_CONSTANTS['ELLOTTE_HOST_MOBILE'] : LOTTE_CONSTANTS['M_HOST_MOBILE']; 
		};
		
		//SSL도메인 변수를 함수로 만듦 rudolph
		this.sslDoamin = function() {
			return this.isEllotte()? LOTTE_CONSTANTS['ELLOTTE_HOST_SSL'] : LOTTE_CONSTANTS['M_HOST_SSL'];
		};
		
		//이미지 경로 common
		this.getImagePath = function(path) {
			var url = 'http://image.lotte.com/';
			if (typeof path == 'undefined') {
				var domain = this.defaultDomain();
				if (domain.indexOf('.ellote.com') >= 0) {
					path = 'ellotte';
				} else {
					path = 'lotte';
				}
			} else if (path.length == 0) {
				path = '';
			}
			return url + path;
		};
		
		//한글외에 입력 체크(이름) common_20150614_v1.js
		this.korWordCheck = function(sel, val) {
			var nameSel = sel; // 받아온 인자 [이름] 선택자
			var nameVal = val; // 받아온 인자 [이름] value값

			nameVal = val.toString().trim(); //공백이 포함되어 있을 경우 체크가 안되어서 공백제거후 반환
			$(nameSel).val(nameVal);

			if (korCheck.test(nameVal)){// 유효성 체크
				alert('이름은 한글만 입력 가능합니다.');
				$(nameSel).focus();
				return false;
			}else if(nameVal == ''){ // 빈 값일 경우
				alert('입력되지 않은 정보가 있습니다.');
				$(nameSel).focus();
				return false;
			}
			return true;
		};

		//한글제외 입력 체크(이메일) common_20150614_v1.js
		this.notKorWordCheck = function(sel, val) {
			var emailSel = sel; // 받아온 인자 [이름] 선택자
			var emailVal = val; // 받아온 인자 [이름] value값

			emailVal = val.toString().trim(); //공백이 포함되어 있을 경우 체크가 안되어서 공백제거후 반환
			$(emailSel).val(emailVal);

			if(engCheck.test(emailVal)){// 유효성 체크
				alert('이메일 주소는 영문, 숫자, 특수문자만 입력 가능합니다.');
				$(emailSel).focus();
				return false;
			}else if(emailVal == ''){ // 빈 값일 경우
				alert('입력되지 않은 정보가 있습니다.');
				$(emailSel).focus();
				return false;
			}
			return true;
		};

		//숫자외에 입력 체크(핸드폰 번호) common_20150614_v1.js
		this.numWordCheck = function(sel, val) {
			var numSel = sel; // 받아온 인자 [이름] 선택자
			var numVal = val; // 받아온 인자 [이름] value값

			numVal = val.toString().trim(); //공백이 포함되어 있을 경우 체크가 안되어서 공백제거후 반환
			$(numSel).val(numVal);

			if(numVal == ''){
				alert('입력되지 않은 정보가 있습니다.');
				$(numSel).focus();
				return false;
			}else if(numCheck.test(numVal)){ // 빈 값일 경우
				if(numVal.length < 3){ // 숫자 3자리 미만일 경우
					alert('휴대폰번호는 3~4자리 입력 가능합니다.') // 20150615-2 오타수정
					$(numSel).focus();
					return false;
				}
			}else{ // 유효성 체크
				alert('휴대폰번호는 숫자만 입력 가능합니다.');
				$(numSel).focus();
				return false;
			}
			return true;
		};
		
		// 비밀번호 유효성 체크
		this.pwWordCheck = function(sel, val) {
			var pwSel = sel; // 받아온 인자 [이름] 선택자
			var pwVal = val; // 받아온 인자 [이름] value값

			if(pwVal == ''){ // 빈 값일 경우
				alert('입력되지 않은 정보가 있습니다.');
				$(pwSel).focus();
				return false;
			}else if(pwVal.length < 8 || pwVal.length > 15 || !mixCheck.test(pwVal)){ // 숫자 7자리 미만 15자 초과이고 영문, 숫자, 특수문자 혼합 아닐 경우
				alert('비밀번호는 8~15자리의 영문, 숫자, 특수문자를 혼합하여 설정해주세요.')
				$(pwSel).focus();
				return false;
			}else if(blankAllCheck.test(pwVal)){ // 공백만 입력 되어 있을 경우
				alert('공백은 사용할 수 없습니다.');
				$(pwSel).focus();
				return false;
			}else if(blankCheck.test(pwVal)){ // 공백이 포함 되어 있을 경우
				alert('공백은 사용할 수 없습니다.');
				$(pwSel).focus();
				return false;
			}else{ // 제외 특수문자 포함 되어 있을 경우
				if(specificCheck.test(pwVal)) {
					alert('특수문자 중 &, <, >,", ' + "'는 사용할 수 없습니다.")
					$(pwSel).focus();
					return false;
				}
			};
			return true;
		};

		// 비밀번호 재입력값 체크
		this.pwReWordCheck = function(sel, val, orVal) {
			var pwReSel = sel; // 받아온 인자 [이름] 선택자
			var pwReVal = val; // 받아온 인자 [이름] value값
			var pwOrVal = orVal; // 받아온 인자 [기존 비밀번호] value값

			if(pwReVal !== pwOrVal){ // 재입력값이 변경값과 다를 경우
				alert('입력했던 비밀번호와 다릅니다. 다시 입력해주세요.');
				$(pwReSel).focus();
				return false;
			};
			return true;
		};		
				
		this.elementMoveX = function(el, start, moveTo, speed) {
			this.elementMoveTo(el, start, moveTo, speed,'translateX');
		};

		this.elementMoveY = function(el, start, moveTo, speed) {
			this.elementMoveTo(el, start, moveTo, speed,'translateY');
		};
		
		this.elementMoveTo = function(el, start, moveTo, speed, type) {
            var nextPos = start;
            var step = start < moveTo ? speed:-1*speed;
            var search_id = setInterval(function() {
				nextPos = nextPos+step;
				el[0].style.webkitTransform = type+"("+nextPos+"px)";
				if ((moveTo >= nextPos && step < 0) || (moveTo <= nextPos && step > 0)) {
					el[0].style.webkitTransform = type+"("+moveTo+"px)";
					clearInterval(search_id);
				}
			}, 10);
		};

		this.replaceAll = function (str, searchStr, replaceStr) {
			if (str == null){return '';}
		    return str.split(searchStr).join(replaceStr);
		};

		this.setDigit = function setDigit(val) {
			return (("" + val).length  == 1) ? "0" + val : val;
		};
		// addEventListener passive option 지원여부
		this.supportPassive = function() {
			var supportsPassiveOption = false;
			try {
				addEventListener("test", null, Object.defineProperty({}, 'passive', {
					get: function () {
						supportsPassiveOption = true;
					}
				}));
			} catch(e) {}
			return supportsPassiveOption;
		};
	}]);

	utilModule.service('LotteScroll', [function() {
		var keys = {37: 1, 38: 1, 39: 1, 40: 1};

		this.preventDefault = function(e) {
		  e = e || window.event;
		  if (e.preventDefault)
		      e.preventDefault();
		  e.returnValue = false;  
		};

		this.preventDefaultForScrollKeys = function(e) {
		    if (keys[e.keyCode]) {
		        this.preventDefault(e);
		        return false;
		    }
		};
		
		this.enableScroll = function() {
		    if (window.removeEventListener)
		        window.removeEventListener('DOMMouseScroll scroll touchstart touchmove touchend', this.preventDefault, false);
		    window.onmousewheel = document.onmousewheel = null; 
		    window.onwheel = null; 
		    window.ontouchmove = null;  
		    document.onkeydown = null;  
		};
		
		this.disableScroll = function() {
			  if (window.addEventListener) // older FF 
			      window.addEventListener('DOMMouseScroll scroll touchstart touchmove touchend', this.preventDefault, false);
			  window.onwheel = this.preventDefault; // modern standard
			  window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
			  window.ontouchmove  = this.preventDefault; // mobile
			  document.onkeydown  = this.preventDefaultForScrollKeys;
		};
	}])
	
	utilModule.service('LotteCookie', [ function() {
		this.setCookie = function(c_name, c_value, expire_date_num, domain) {
			var now_date = new Date(), 
				cookies = c_name + '=' + escape(c_value) + '; path=/ ';

			if (typeof expire_date_num != 'undefined' && expire_date_num != null) {
				var expire_date = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate() + expire_date_num, 0, 0, 0);
				cookies += ';expires=' + expire_date.toGMTString() + ';';
			} else {
				cookies += ';expires=0;';
			}

			if (domain) {
				cookies += 'domain=' + domain + ';';
			}

			document.cookie = cookies;
		};

		this.getCookie = function(c_name) {
			var c_name = c_name + '=', cookie_data = document.cookie, start = cookie_data.indexOf(c_name), c_value = "", end;

			if (start != -1) {
				start += c_name.length;
				end = cookie_data.indexOf(";", start);
				if (end == -1)
					end = cookie_data.length;
				c_value = cookie_data.substring(start, end);
			}
			return unescape(c_value);
		};

		this.delCookie = function(c_name) {
			var del_date = new Date(0);
			document.cookie = c_name + '=; path=/; expires=' + del_date + ';';
		};
	} ]);

	utilModule.service('LotteStorage', [ function() {
		this.setSessionStorage = function(key, value, type) {
			try {
				if (type == 'json') {
					value = JSON.stringify(value);
				}
				sessionStorage.setItem(key, value);
			} catch (e) {}
		};

		this.getSessionStorage = function(key, type) {
			var value = null;
			try {
				value = sessionStorage.getItem(key);
				if (type == 'json') {
					value = JSON.parse(value);
				}
			} catch (e) {
				value = -1;
			}

			return value;
		};

		this.delSessionStorage = function(key) {
			try {
				sessionStorage.removeItem(key);
			} catch (e) {}
		};

		this.clearSessionStorage = function() {
			try {
				sessionStorage.clear();
			} catch (e) {}
		};

		this.setLocalStorage = function(key, value, type) {
			try {
				if (type == 'json') {
					value = JSON.stringify(value);
				}
				localStorage.setItem(key, value);
			} catch (e) {
			}
		}
		
		this.getLocalStorage = function(key, type) {
			var value = null;
			try {
				value = localStorage.getItem(key);
				if (type == 'json') {
					value = JSON.parse(value);
				}
			} catch (e) {
				value = -1;
			}

			return value;
		}
		
		this.delLocalStorage = function(key) {
			try {
			localStorage.removeItem(key);
			} catch (e) {}
		};

		this.clearLocalStorage = function() {
			try {
				localStorage.clear();
			} catch (e) {}
		};
	} ]);

	// Google Analytics 분석 수집을 위한 유틸
	utilModule.service('LotteGA', [function () {
		// GA 이벤트 태깅
		this.evtTag = function (eventCategory, eventAction, eventLabel, dimension53, dimension54) {
			// console.log("GA Event Tagging");

			var evtParam = {
				ctg: eventCategory ? eventCategory + "" : "",
				action: eventAction ? eventAction + "" : "",
				label: eventLabel ? eventLabel + "" : "",
				dim53: dimension53 ? dimension53 + "" : "",
				dim54: dimension54 ? dimension54 + "" : ""
			};

			// GA 스크립트는 헤더 pub_tracking.js에 선언되어 있음.
			try {
				ga('send', {
					hitType: 'event',
					eventCategory: evtParam.ctg,
					eventAction: evtParam.action,
					eventLabel: evtParam.label,
					dimension53: evtParam.dim53,
					dimension54: evtParam.dim54
				});

				console.log(
					"%c[GA] " +
					"%c탭명(ctg) : %c" + evtParam.ctg + 
					"%c, 그룹명(action) : %c" + evtParam.action + 
					"%c, idx(label) : %c" + evtParam.label + 
					"%c, alt(cd53) : %c" + evtParam.dim53 + 
					"%c, 모듈명(cd54) : %c" + evtParam.dim54,
					"background:yellow;color:black;font-weight:bold;", // GA
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;" // value
				);
			} catch (e) {
				// console.dir({
				// 	hitType: 'event',
				// 	n1_eventCategory: evtParam.ctg,
				// 	n2_eventAction: evtParam.action,
				// 	n3_eventLabel: evtParam.label,
				// 	n4_dimension53: evtParam.dim53,
				// 	n5_dimension54: evtParam.dim54
				// });

				console.log(
					"%c[GA] " +
					"%c탭명(ctg) : %c" + evtParam.ctg + 
					"%c, 그룹명(action) : %c" + evtParam.action + 
					"%c, idx(label) : %c" + evtParam.label + 
					"%c, alt(cd53) : %c" + evtParam.dim53 + 
					"%c, 모듈명(cd54) : %c" + evtParam.dim54,
					"background:yellow;color:black;font-weight:bold;", // GA
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;", // value
					"background:yellow;color:black;", // key
					"background:yellow;color:red;font-weight:bold;" // value
				);
				// aaa
				
				console.error("Google Analytics Error. (로컬에서는 호출 불가)");
			}
		};
	}]);
	
	/**
	 * javascript form object를 url query string으로 변환
	 * @param {Object} obj - {key1: value, key:[value, value]}
	 */
	utilModule.service('LotteForm', ['$http','$timeout',function($http,$timeout) {
		this.JsonToParam = function(obj) {
			var str = [];
			for (var p in obj) {
				if (Array.isArray(obj[p])) {
					for(var i=0; i<obj[p].length; i++) {
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
					}
				} else {
				   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}
			return str.join("&");
		};
		
		this.FormSubmitForAjax = function(goUrl,param) {
			var objParam = this.JsonToParam(param);
			return $http({
	    	    method: 'POST',
	    	    url: goUrl,
	    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    	    data: objParam
	    	});
		};
		this.FormSubmit = function(frm) {
    		$timeout(function() {
    			frm.submit();
    		}, 300);
		};
	} ]);
	
	utilModule.service('LotteLink', ['$window', '$location', '$http', 'LotteUserService', 'LotteCommon', 'commInitData', 'LotteCookie', function($window, $location, $http, LotteUserService, LotteCommon, commInitData, LotteCookie) {
		var self = this;

		// 넘겨 받은 URL을 분석하여 Objet형태로 정보를 돌려준다.
		this.getURLInfo = function (url) {
			var url = encodeURI(url) + "",
				urlInfo = {
					url: "",
					protocol: "",
					domain: "",
					port: "",
					portNumber: "",

					fullPath: "",
					lastPath: "",
					fileName: "",
					paramsStrFull: "",
					paramsStr: "",
					paramsObj: {},
					hashFull: "",
					hash: "",
				},
				absFlag = false, // 절대 경로인지 확인하는 Flag
				parseURL= [];

			if (url.match(/^(https?):\/\//)) {
				absFlag = true;
			}

			if (absFlag) { // 절대경로일 경우 (http:// ~)
				parseURL = url.match(/^(https?):\/\/([^:\/\s]+)(:([^\/]*))?((\/[^\s/\/]+)*)?\/([^#\s\?]*)(\?([^#\s]*))?(#(\w*))?$/);

				if (!parseURL) {
					parseURL = url.match(/^(https?):\/\/([^:\/\s]+)(:([^\/]*))?((\/[^\s/\/]+)*)?$/);
				}

				urlInfo.url = parseURL[0] ? parseURL[0] : ""; // 절대경로 전체 URL (ex. http://m.lotte.com/mall/test/test1/spec_mall.do?dispNo=5553048)
				urlInfo.protocol = parseURL[1] ? parseURL[1] : ""; // protocol (http/https)
				urlInfo.domain = parseURL[2] ? parseURL[2] : ""; // domain (ex. m.lotte.com)
				urlInfo.port = parseURL[3] ? parseURL[3] : ""; // port (ex. :8080)
				urlInfo.portNumber = parseURL[4] ? parseURL[4] : ""; // port (ex. 8080)
				urlInfo.fullPath = parseURL[5] ? parseURL[5] : ""; // full path (ex. /mall/test/test1)
				urlInfo.lastPath = parseURL[6] ? parseURL[6] : ""; // 마지막 경로 (ex. /test1)
				urlInfo.fileName = parseURL[7] ? parseURL[7] : ""; // fileName (ex. spec_mall.do)
				urlInfo.paramsStrFull = parseURL[8] ? parseURL[8] : ""; // 파라메타 물음표 포함 (ex. ?dispNo=5553048)
				urlInfo.paramsStr = parseURL[9] ? parseURL[9] : ""; // 파라메타 물음표 비포함 (ex. dispNo=5553048)
				urlInfo.hashFull = parseURL[10] ? parseURL[10] : ""; // 해시태그 # 포함 (ex. #hash)
				urlInfo.hash = parseURL[11] ? parseURL[11] : ""; // hash (ex. hash)
			} else { // 상대 경로인 경우
				parseURL = url.match(/((\/[^\s/\/]+)*)?\/([^#\s\?]*)(\?([^#\s]*))?(#(\w*))?$/);

				urlInfo.url = parseURL[0] ? parseURL[0] : ""; // 상대경로 전체 URL (ex. /mall/test/test1/spec_mall.do?dispNo=5553048)
				urlInfo.protocol = ""; // protocol (http/https)
				urlInfo.domain = ""; // domain (ex. m.lotte.com)
				urlInfo.port = ""; // port (ex. :8080)
				urlInfo.portNumber = ""; // port (ex. 8080)
				urlInfo.fullPath = parseURL[1] ? parseURL[1] : ""; // full path (ex. /mall/test/test1)
				urlInfo.lastPath = parseURL[2] ? parseURL[2] : ""; // 마지막 경로 (ex. /test1)
				urlInfo.fileName = parseURL[3] ? parseURL[3] : ""; // fileName (ex. spec_mall.do)
				urlInfo.paramsStrFull = parseURL[4] ? parseURL[4] : ""; // 파라메타 물음표 포함 (ex. ?dispNo=5553048)
				urlInfo.paramsStr = parseURL[5] ? parseURL[5] : ""; // 파라메타 물음표 비포함 (ex. dispNo=5553048)
				urlInfo.hashFull = parseURL[6] ? parseURL[6] : ""; // 해시태그 # 포함 (ex. #hash)
				urlInfo.hash = parseURL[7] ? parseURL[7] : ""; // hash (ex. hash)
			}

			if (urlInfo.paramsStr != "") {
				var params = urlInfo.paramsStr.split("&"),
					paramsObj = {},
					i = 0;

				for (i = 0; i < params.length; i++) {
					var tmp = (params[i] + "").split("=");

					if (tmp[0]) {
						paramsObj[tmp[0]] = tmp[1] ? tmp[1] : "";
					}
				}

				urlInfo.paramsObj = paramsObj;
			}

			return urlInfo;
		};

		/**
		 * goLink
		 * @desc 내부 링크일 경우 baseParam을 붙여서 링크를 연결 시켜준다.
		 * @Params {string} url 연결링크
		 * @Params {string} baseParamStr baseParameter String
		 * @Params {object} params 추가 파라메타
		 */
		this.goLink = function (url, baseParamStr, params) {
			var urlInfo = self.getURLInfo(url),
				linkURL = "";

			linkURL += urlInfo.protocol ? urlInfo.protocol + "://" : ""; // Host
			linkURL += urlInfo.domain ? urlInfo.domain : ""; // Domain
			linkURL += urlInfo.port ? urlInfo.port : ""; // Port
			linkURL += (urlInfo.fullPath ? urlInfo.fullPath : "") + "/"; // Path
			linkURL += urlInfo.fileName ? urlInfo.fileName : ""; // FileName
			linkURL += "?" + baseParamStr; // Base Parameter

			if (params) { // 추가 파라메타가 있을 경우 확장
				angular.extend(urlInfo.paramsObj, params);
			}

			if (urlInfo.paramsObj) {
				for (var key in urlInfo.paramsObj) {
					// URL Parameter에 BaseParameter가 존재 할 경우 삭제하고 실제 BaseParam으로 교체
					if (key != "c" && key != "udid" && key != "v" && key != "cn" && key != "cdn" && key != "schema") {
						linkURL += "&" + key + "=" + urlInfo.paramsObj[key];
					}
				}
			}

			linkURL += urlInfo.hashFull ? urlInfo.hashFull : ""; // Hash
			$window.location.href = linkURL; // 링크 이동
		};

		// 외부 링크일 경우 APP일 경우에는 앱 스키마 호출, 웹일 경우 window open으로 새창을 띄워준다.
		this.goOutLink = function(url, mallType) {
			var lotteNativeAppUA = navigator.userAgent.match(/mlotte00[\d]\/[\d\.]*/);
			var isApp = (lotteNativeAppUA || commInitData.query['udid'] || commInitData.query['schema'] || (LotteCookie.getCookie('UDID')!='' && LotteCookie.getCookie('UDID')!='""')) ? true : false;
			var isDotSuperApp = navigator.userAgent.indexOf("baseApp") > -1;

			/*
			 * 닷컴 슈퍼 폴더앱 - 슈퍼 링크일때는 처리 방식 변경 (아웃링크 처리 안함)
			 * 조건 : 닷컴/슈퍼 앱이거나 웹일때만 처리 (기존 앱에서는 아웃링크 형태로 처리)
			 */
			if ((url + "").indexOf(".lottesuper.co.kr") > -1 && (isDotSuperApp || !isApp)) {
				var lendingSuperUrl = url + "";
				var noCacheTime = new Date();
				noCacheTime = noCacheTime.getTime();
				var apiGateUrl = LotteCommon.SuperLoginSSOUrl;

				var req = {
					method : "GET",
					url : LotteCommon.loginData,
					params : {
						date: noCacheTime,
						bigdataFlag : "Y" // 메인 빅딜 개인화 추가로 인해 Flag 추가
					}
				};
	
				$http(req)
				.success(function (res, status, headers, config) {
					if (res.loginCheck.isLogin) {
						if (res.loginCheck.seedCustId && !res.loginCheck.isSimple) {
							apiGateUrl += "?stpoint=DOTCOM&dotcustId=" + encodeURIComponent(res.loginCheck.seedCustId);
							
							if (res.loginCheck.isAuto) { // 자동로그인 여부 값 추가
								apiGateUrl += "&auto=1";
							}
						}
	
						apiGateUrl += ((apiGateUrl.indexOf("?") == -1) ? "?" : "&") + "returnUrl=" + encodeURIComponent(lendingSuperUrl);
	
						$window.location.href = apiGateUrl;
					} else {
						$window.location.href = lendingSuperUrl;
					}
				})
				.error(function (response, status, headers, config) {
					// apiGateUrl += "?returnUrl=" + encodeURIComponent(lendingSuperUrl);
					$window.location.href = lendingSuperUrl;
				});
			} else {
				if (isApp) {
					var uri = url.replace(/http\:\/\/|https\:\/\//gi, "");
	
					if (isIOS) {
						if (url.match("https://")) {
							$window.location.href = "family://" + uri;
						} else {
							$window.location.href = "lecsplatform://" + encodeURIComponent(uri);
						}
					} else if (isAndroid) {
						$window.lecsplatform.callAndroid(encodeURIComponent(url));
					}
				} else {
					var linkURL = url + "";
	
					if (!linkURL.match(/http|https/gi)) {
						linkURL = "http://" + linkURL;
					}
	
					$window.open(linkURL);
				}
			}

		};

		/*
		 * 딥링크를 위한 앱 실행 객체 생성
		 */
		var AppExec = (function () {
			var appExec = this,
				isIPHONE = navigator.userAgent.match("iPhone") != null,
				isIPAD = navigator.userAgent.match("iPad") != null,
				isANDROID = navigator.userAgent.match("iPad") != null,
				isCHROME = navigator.userAgent.match("Chrome") != null,
				isOldIPAD = navigator.userAgent.match("mlotte003") != null ? true : false,
				lotteApp = {
					rendingUrl: "m.lotte.com/app_landing.do",
					iPhone: {schema: "mlotte001", marketUrl: "http://itunes.apple.com/app/id376622474?mt=8"},
					iPad: {schema: isOldIPAD ? "mlotte003" : "mlotte001", marketUrl: "http://itunes.apple.com/app/id376622474?mt=8"},
					Android: {schema: "mlotte001", marketUrl: "market://details?id=com.lotte"}
				},
				ellotteApp = {
					rendingUrl: "m.ellotte.com/app_landing.do",
					iPhone: {schema: "ellotte001", marketUrl: "http://itunes.apple.com/app/id902962633"},
					iPad: {schema: "ellotte001", marketUrl: "http://itunes.apple.com/app/id902962633"},
					Android: {schema: "ellotte002", marketUrl: "market://details?id=com.lotte.ellotte"}
				},
				runAppOption = {
					deepLinkUrl: "",
					rendingUrl: "",
					referrer: "",
					tclick: "",
					iPhone: {schema: "", marketUrl: ""},
					iPad: {schema: "", marketUrl: ""},
					Android: {schema: "", marketUrl: ""}
				};

			return {
				/**
				 * Params
				 * @target string "lotte", "ellotte" 앱 타겟
				 * @deepLinkUrl string 반드시 http:// 포함 전체 URL (형식에 맞지 않을 경우 현재 location으로 딥링크 됨)
				 * @tclick string deepLink를 통한 접근시 tclick 수집명
				 * @referrer string 앱설치 referrer 수집 코드 (아이폰은 referrer 수집 불가)
				 */
				deepLink : function (target, deepLinkUrl, tclick, referrer) {
					// 타겟앱에 따른 기본 값 세팅
					if (target == "lotte") {
						angular.extend(runAppOption, lotteApp);
					} else if (target == "ellotte") {
						angular.extend(runAppOption, ellotteApp);
					} else { // target 설정값이 비정상적이라면 현재 서비스 체크후 해당 앱 세팅
						if ($location.host().indexOf(".ellotte.com") > -1) { // 엘롯데
							angular.extend(runAppOption, ellotteApp);
						} else { // 닷컴
							angular.extend(runAppOption, lotteApp);
						}
					}

					// deep link 보정 처리
					var validateLink = "",
						deepLinkObj = {
						url: "",
						protocol: "", // http/https
						host: "", // m.lotte.com / m.ellotte.com
						path: "",
						params: "",
						paramsStr: ""
					};

					// 넘어온 DeepLinkUrl이 유효하지 않다면 현재 URL 정보로 딥링크
					if (deepLinkUrl && deepLinkUrl.substring(0, 4) == "http") {
						validateLink = self.getURLInfo(deepLinkUrl);
					} else {
						validateLink = self.getURLInfo($location.absUrl());
					}

					deepLinkObj.url = validateLink.url;
					deepLinkObj.protocol = validateLink.protocol;
					deepLinkObj.host = validateLink.domain;
					deepLinkObj.path = validateLink.fullPath + "/" + validateLink.fileName;
					deepLinkObj.params = validateLink.paramsObj;

					if (deepLinkObj.params.c) { // 파라메타 c가 있다면 삭제
						delete deepLinkObj.params.c;
					}

					if (deepLinkObj.params.tclick) { // 파라메타 tclick이 있다면 삭제
						delete deepLinkObj.params.tclick;
					}

					if (tclick) { // 수집해야 하는 tclick이 있다면 tclick 추가
						deepLinkObj.params.tclick = tclick;
					}

					deepLinkObj.params.cn = "23"; // 앱으로 연결되기 때문에 채널값 23으로 고정

					// Parameter String으로 조합
					for (var key in deepLinkObj.params) {
						if (deepLinkObj.paramsStr != "") {
							deepLinkObj.paramsStr += "&";
						}

						deepLinkObj.paramsStr += key + "=" + deepLinkObj.params[key];
					}

					// 스테이지, 테스트 서버에서 테스트시 테스트 host로는 딥링크 기능을 사용할 수 없어 운영 URL로 변경
					deepLinkObj.host = deepLinkObj.host.replace(/(mo|mt|mt2|mprj|mprj2)\./gi, "m.");

					// 안드로이드 / iOS 구분하여 딥링크 실행
					if (isIPHONE || isIPAD) { // iOS
						var runMarketTimer = null,
							time = 350,
							osChk = (navigator.userAgent + "").match(/OS\s([0-9]+_[0-9]+)/gi),
							osVerArr = [],
							osChkFlag = false,
							//osVer = 0,
							osLimitVer = [9, 1, 9], // 9.2 이상
							deepLinkPath = "",
							marketPath = "";

						if (osChk && osChk.length > 0) {
							osVerArr = osChk[0].replace("OS ", "").split("_");
							//osVer = parseFloat(osChk[0].replace("OS ", "").replace("_", "."));

							// iOS 9.2 이상 체크
							var i = 0;

							for (i; i < osVerArr.length; i++) {
								if (osLimitVer[i] && osVerArr[i] > osLimitVer[i]) {
									osChkFlag = true;
									break;
								}
							}
						}

						if (osChkFlag) { // iOS 9.2 이상일때는 "앱으로 연결하시겠습니까?" Confirm 창 노출로 사용자가 클릭할 수 있는 딜레이가 필요하여 분기처리
							time = 2000;
						}

						if (isIPAD) { // iPad
							deepLinkPath = runAppOption.iPad.schema + "://" + deepLinkObj.host + deepLinkObj.path + "?" + deepLinkObj.paramsStr;
							marketPath = runAppOption.iPad.marketUrl;
						} else { // iPhone
							deepLinkPath = runAppOption.iPhone.schema + "://" + deepLinkObj.host + deepLinkObj.path + "?" + deepLinkObj.paramsStr;
							marketPath = runAppOption.iPhone.marketUrl;
						}

						// 마켓이동시 iOS 앱스토어에서는 앱 설치후 이동 페이지에 대한 기능을 제공하지 않음
						runMarketTimer = setTimeout(function () {
							$window.location.href = marketPath; // 마켓이동 실행
						}, time);

						// 딥링크를 받아주는 앱이 있다면 마켓이동 타이머 클리어
						angular.element($window).on("pagehide", function () {
							clearTimeout(runMarketTimer); // 타이머 클리어
							runMarketTimer = null;
							angular.element($window).off("pagehide"); // 이벤트 클리어
						});

						// alert(deepLinkPath);
						// alert(marketPath);

						// 앱설치여부를 체크하지 못하기 때문에 딥링크와 마켓 이동을 순차적으로 실행하여 앱이 없을때는 마켓으로 이동되도록 함
						$window.location.href = deepLinkPath; // 딥링크 실행
					} else { // Android
						var deepLinkPath = "",
							marketPath = runAppOption.Android.marketUrl;

						// 앱 설치 referrer 수집이 존재한다면
						if (referrer) {
							marketPath += "&referrer=" + referrer;
						}

						// 안드로이드는 크롬 브라우저에서 iframe 호출 방식을 지원하지 않기 때문에 마켓 이동시 설치 후 이동 URL을 심어 주어 처리
						if (isCHROME) {
							deepLinkPath = deepLinkObj.protocol + "://" + deepLinkObj.host + deepLinkObj.path + "?" + (deepLinkObj.paramsStr + "").replace(/\&/g, "@");
							marketPath += "&url=" + runAppOption.Android.schema + "://" + runAppOption.rendingUrl + "?url=" + deepLinkPath;
						} else {
							deepLinkPath = deepLinkObj.protocol + "://" + deepLinkObj.host + deepLinkObj.path + "?" + (deepLinkObj.paramsStr + "").replace(/\&/g, "@");
							marketPath += "&returnUrl=" + runAppOption.Android.schema + "://" + runAppOption.rendingUrl + "?url=" + deepLinkPath;
						}

						var iframe = document.createElement('iframe');
						iframe.style.visibility = 'hidden';
						iframe.style.display = "none";

						// alert(deepLinkPath);
						// alert(marketPath);

						if (!isCHROME)
							iframe.src = runAppOption.Android.schema + "://" + deepLinkPath;

						iframe.onload = function () {
							$window.location.href = marketPath;
						};

						document.body.appendChild(iframe);
					}
				}
			};
		})();

		//AppExec.deepLink("lotte", "http://m.lotte.com/category/m/cate_mid_list_anglr.do?c=mlotte&udid=&v=&cn=&cdn=&schema=&curDispNo=5537285&title=%EC%97%AC%EC%84%B1%EC%9D%98%EB%A5%98&cateDiv=MIDDLE&idx=1&tclick=m_DC_side_cate_catebig_5537285");
		// console.log(AppExec.runApp("lotte", ""));
		/*
		 * 딥링크 : 앱 실행
		 * @target string "lotte", "ellotte" 앱 타겟
		 *			빈값일 때는 현재 URL 베이스로 닷컴/엘롯데 구분
		 * @deepLinkUrl string 반드시 http:// 포함 전체 URL (형식에 맞지 않을 경우 현재 location으로 딥링크 됨)
		 *			빈값일 때는 현재 URL
		 * @tclick string deepLink를 통한 접근시 tclick 수집명
		 *			빈값일 때는 수집 안함
		 * @referrer string 앱설치 referrer 수집 코드 (아이폰은 referrer 수집 불가)
		 *			빈값일 때는 referrer 수집 없음
		 */
		this.appDeepLink = function (target, deepLinkUrl, tclick, referrer) {
			AppExec.deepLink(target, deepLinkUrl, tclick, referrer);
		};
	}]);
	
	// APP 여부 판단
	utilModule.service('LotteAppChk', ['LotteUserService', 'commInitData', '$window', 'LotteStorage', 'LotteCookie',
	function (LotteUserService, commInitData, $window, LotteStorage, LotteCookie) {
		var self = this;

		var lotteNativeAppUA = navigator.userAgent.match(/mlotte00[\d]\/[\d\.]*/);
		self.appObj = {
			isApp : (lotteNativeAppUA || commInitData.query['udid'] || commInitData.query['schema'] || (LotteCookie.getCookie('UDID')!='' && LotteCookie.getCookie('UDID')!='""')) ? true : false,
			isAndroid : false,
			isIOS : false,
			isIpad : false,
			isTablet : angular.element($window).width() >= 768, // 태블릿 여부
			isOldApp : false,
			iOsType : "",
			isSktApp: navigator.userAgent.indexOf("sklotte001") > -1 || commInitData.query['schema'] == "sklotte001", // T롯데(SKT 앱) 여부
			isDotSuperApp: navigator.userAgent.indexOf("baseApp") > -1,
			isSuperApp: navigator.userAgent.indexOf("baseApp/super") > -1,
			ver : commInitData.query['v'] ? commInitData.query['v'] : 0,
			verNumber : lotteNativeAppUA != null ? parseInt((lotteNativeAppUA[0] + "").replace(/(mlotte00[\d]\/)|(\.)/g, "")):parseInt(((commInitData.query['v'] ? commInitData.query['v'] : 0) + "").replace(/\./gi, "")),
			schema: commInitData.query['schema'] ? commInitData.query['schema'] : "",
			needUpdateApp : LotteStorage.getSessionStorage("needUpdateApp")=="Y",
			isNativeHeader : false
		};

		var mobileInfo = new Array('Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
		
		for (var info in mobileInfo) {
			var matchKw = navigator.userAgent.match(mobileInfo[info]);

			if (matchKw != null) {
				if (matchKw[0] == 'iPhone' || matchKw[0] == 'iPad') {
					self.appObj.isIOS = true;
					self.appObj.iOsType = matchKw[0];
				} else if (matchKw[0] == 'Android') {
					self.appObj.isAndroid = true;
				}

				if (matchKw[0] == 'iPad') {
					self.appObj.isIpad = true;
				}
			}
		}
	}]);

	utilModule.directive('onlyNumber', [ function() {
		return {
			require : 'ngModel',
			link : function($scope, el, attrs, modelCtrl) {
				modelCtrl.$parsers.push(function(value) {
					if (value) {
						if (attrs.onlyNumber == "float") {
							value = parseFloat(value);
						} else {
							value = parseInt(value);
						}
					}
					return value;
				});

				modelCtrl.$formatters.push(function(value) {
					if (value) {
						if (attrs.onlyNumber == "float") {
							value = parseFloat(value);
						} else {
							value = parseInt(value);
						}
					}
					return value;
				});

				el.on({
					"keypress" : function(e) {
						var charCode = (e.which) ? e.which : e.keyCode;

						if (charCode > 31 && (charCode < 48 || charCode > 57))
							return false;
					},
					"keyup" : function(e) {
						if (this.value) {
							if (attrs.onlyNumber == "float") {
								this.value = parseFloat(this.value);
							} else {
								this.value = parseInt(this.value);
							}
						}
					}
				});
			}
		};
	} ]);

	/*세로 스크롤 레이어 Directive*/
	utilModule.directive("verticalScrollLayer", [ '$window', function($window) {
		return {
			link : function($scope, el, attrs) {
				var touchStartPosY = 0, /*touch start 세로 위치 저장*/
				elHeight = el.height(), /*스크롤 wrapper 높이 저장*/
				contHeight = el.children().eq(0).height(), /*스크롤 Container 높이 저장*/
				maxScrollPosY = contHeight - elHeight; /*최대 스크롤 세로 위치 저장*/

				angular.element($window).on("resize", function() { /*윈도우 크기 변경시*/
					elHeight = el.height();
					contHeight = el.children().eq(0).height();
					maxScrollPosY = contHeight - elHeight;
				});

				el.on({
					"touchstart" : function(e) {
						touchStartPosY = e.originalEvent.touches[0].pageY;
						elHeight = el.height();
						contHeight = el.children().eq(0).height();
						maxScrollPosY = contHeight - elHeight;
					},
					"touchmove" : function(e) {
						var dir = touchStartPosY - e.originalEvent.touches[0].pageY; /*음수면 위, 양수면 아래*/

						if ((dir < 0 && el.scrollTop() <= 0) || (dir > 0 && el.scrollTop() >= maxScrollPosY)) { /*스크롤 방향과 스크롤 가능 여부 판단*/
							e.preventDefault(); /*이벤트 중지*/
						} else {
							e.stopPropagation(); /*이벤트 전파 중지*/
						}
					},
					"touchend" : function(e) {
						touchStartPosY = 0;
						e.stopPropagation(); /*이벤트 전파 중지*/
					}
				});
			}
		}
	} ]);

	/*레이어 하단으로 이벤트 전파 방지*/
	utilModule.directive("lyCover", [ '$window', function($window) {
		return {
			link : function($scope, el, attrs) {
				el.on("touchstart touchmove touchend", function(e) {
					e.preventDefault();
				}); /*이벤트 중지*/
			}
		}
	} ]);

    /* dimm 유닛 */
	utilModule.directive('lotteDimm', [function() {
    	return {
    		template: '<section id="lotteDimm" style="position:fixed; top:0; left:0px; width:100%; height:100%; background:rgba( 0, 0, 0, {{LotteDimm.dimmedOpacity}} ); z-index:100;" ng-show="LotteDimm.status && LotteDimm.dimmed" ng-click="dimmedClose()"></section>',
    		link: function($scope, el, attrs) {
    		}
    	}
    }]);
	
    /* 투명 클릭 방지 */
	utilModule.directive('lotteSuperBlock', [function() {
    	return {
    		template: '<section id="lotteSuperBlock" style="position:fixed; top:0; left:0px; width:100%; height:100%; background:rgba( 0, 0, 0, 0.0 ); z-index:9000;" ng-show="LotteSuperBlockStatus"></section>',
    		link: function($scope, el, attrs) {
    			$scope.LotteSuperBlockStatus = false;
    		}
    	}
    }]);

	//알림리스트
    utilModule.directive('lotteAlertMessage', ['$window','$timeout', function($window,$timeout){
        return {
            template: '<div ng-bind-html="lotteSystemAlertMessage"></div>',
            replace : true, link:function($scope, el, attrs){
            	var fRectHtml = '<div class="alertPop"><p><span>';
            	var eRectHtml = '</span></p></div>';
            	var fCircleHtml = '<div class="brieflyPop"><div class="popCntWrap"><div class="popCnt"><div class="popImg"></div>';
            	var eCircleHtml = '</div></div></div>';
                $scope.lotteSystemAlertMessage = "";
                /*
                 * obj : 
                 *  type : 팝업 타입 및 고정 타입
                 *  phone : 고객 전화번호
                 *  msg : 메시지
                 *  
                 *  ex) $scope.openCireleSystemAlert({type:"cartPop"})
                 */
                $scope.openCireleSystemAlert = function(obj) {
                    switch(obj.type) {
                    case "imgZoomPop": //확대안내
                        $scope.lotteSystemAlertMessage = fCircleHtml+"<div class=popTxt>자유로운 확대가<br />가능합니다</div>"+eCircleHtml;
                        break;
                    case "alarmPop": //재 입고 알림
                    	var message = [];
                    	var appPushYn = (obj.app_push_yn == undefined || '' == obj.app_push_yn || 'Y' != obj.app_push_yn) ? 'N' : obj.app_push_yn;
                    	var hasPhone = !(obj.phone == undefined || '' == obj.phone);
                    	
                    	// 앱 푸쉬 설정이 되어있지 않고 전화번호가 존재할 경우
                    	if ('N' == appPushYn && hasPhone) {
                    		message.push('<span>' + obj.phone + '</span>');
                    	}
                    	
                    	message.push('<div class=popTxt>재 입고 알림<br />신청되었습니다</div>');
                    	
                    	// 앱 푸쉬 설정이 되어있지 않은 경우
                    	if ('N' == appPushYn) {
                    		message.push('<p>연락처 수정은 마이롯데에서<br />하실 수 있습니다</p>');
                    	}
                    		
                    	$scope.lotteSystemAlertMessage = fCircleHtml+message.join("")+eCircleHtml;
                    	break;
                    	
                    	
                   	// if (obj.phone == undefined || '' == obj.phone){ //고객 전화번호 없을때
                    //        $scope.lotteSystemAlertMessage = "<span class=empy></span><div class=popTxt>재 입고 알림<br />신청되었습니다</div>";
                    //    } else {
                    //        $scope.lotteSystemAlertMessage = "<span>" + obj.phone + "</span>" + "<div class=popTxt>재 입고 알림<br />신청되었습니다</div>"+ "<p>연락처 수정은 마이롯데에서<br />하실 수 있습니다</p>";
                    //    }
                   	// break;
                    	
                    case "cartPop": //장바구니
                        $scope.lotteSystemAlertMessage = fCircleHtml+"<div class=popTxt>장바구니에<br />담겼습니다 </div>"+eCircleHtml;
                        break;
                    case "wishPop": //위시리스트
                        $scope.lotteSystemAlertMessage = fCircleHtml+"<div class=popTxt>위시리스트에<br />담겼습니다</div>"+eCircleHtml;
                        break;
                    case "optionPop": //상세 옵션이미지 설명
                        $scope.lotteSystemAlertMessage = fCircleHtml+"<div class=popTxt>옵션 이미지를 터치하면<br />자세한 상품설명을<br />볼 수 있어요!</div>"+eCircleHtml;
                        break;
                    default: //msg 를 받을때
                        $scope.lotteSystemAlertMessage = fCircleHtml+"<div class=popTxt>" + obj.msg + "</div>"+eCircleHtml;
                        break;
                    }
                    $timeout(function() {
                		$scope.$apply();
                		el.find(".brieflyPop").attr('class', 'brieflyPop ' + obj.type);
                		el.find(".brieflyPop").css('display', 'block');
                		el.show();
                        $timeout(function(){
                            el.hide();
                        },2500);
                    });
                }
                
                $scope.openSystemAlert = function(obj){
                	$scope.lotteSystemAlertMessage = fRectHtml+obj.msg+eRectHtml;
                	$timeout(function() {
                		$scope.$apply();
                		el.show();
                        $timeout(function(){
                            el.hide();
                        },2500);
                	});
                }
            }
        };
	}]);

})(window, window.angular);