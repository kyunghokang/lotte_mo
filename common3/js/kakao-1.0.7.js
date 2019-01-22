/**
 * Kakao Javascript SDK for Kakao Open Platform Service - v1.0.7
 *
 * Copyright 2014 Kakao Corp.
 *
 * Redistribution and modification in source are not permitted without specific prior written permission. 
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
/*******************
 * API
 *******************/
module.exports = (function(){
  var API = {};

  var _easyXDM = require('../vendor/easyXDM.js');
  var _ = require('./util.js');
  var _k = require('./common.js');

  var _rpc;

  API.request = function(settings) {
    _k.processRules(settings, rules.request, 'API.request');

    _.defaults(settings, {
      data: {},
      success: _.emptyFunc,
      fail: _.emptyFunc,
      always: _.emptyFunc
    });

    var url = settings.url;

    _k.processRules(settings.data, rules.api[url].data, 'API.request - ' + url);

    return new Promise(function(resolve, reject) {
      getConfig().then(function(config) {
        getRPC().request(config,
          function(res) {
            settings.success(res);
            settings.always(res);

            resolve(res);
          },
          function(xdmErr) {
            var err = getErrorObj(xdmErr);
            settings.fail(err);
            settings.always(err);

            reject(err);
          });
      }, function(err) {
        reject(err);
      });
    });

    function getConfig(callback) {
      var serializedData = {};
      _.each(settings.data, function(value, key) {
        var serialized = _.isString(value) ? value : JSON.stringify(value);
        serializedData[key] = serialized;
      });

      var config = {
        url: url,
        method: rules.api[url].method,
        headers: {
          'Authorization': 'Bearer ' + Kakao.Auth.getAccessToken(),
          'KA': _k.KAKAO_AGENT
        },
        data: serializedData
      };

      return new Promise(function(resolve, reject) {
        if (isFileRequired(url)) {
          if (!settings.files) {
            throw new _k.KakaoError("'files' parameter should be set for " + url);
          }

          getFileConfig(settings.files).then(function(fileConfig) {
            config.file = fileConfig;
            resolve(config);
          }, function(err) {
            reject(err);
          });
        } else {
          resolve(config);
        }
      });
    }

    function getFileConfig(files) {
      return new Promise(function(resolve, reject){
        var fileDataPromises = _.map(files, function(file) {
          return _k.serializeFile(file).then(function(stringified) {
            return {
              name: file.name,
              type: file.type,
              str: stringified
            };
          });
        });

        Promise.all(fileDataPromises).then(function(fileDatas) {
          resolve({
            paramName: 'file',
            data: fileDatas
          });
        }, function(err) {
          reject(err);
        });
      });
    }

    function getErrorObj(easyXDMError) {
      try {
        _k.logDebug(easyXDMError);

        var xhrError = easyXDMError.message;
        return JSON.parse(xhrError.responseText);
      } catch (ex) {
        return {
          code: -777,
          msg: 'Unknown error'
        };
      }
    }
  };

  function getRPC() {
    if (!_rpc) {
      _rpc = _k.guardCreateEasyXDM(function() {
        return new _easyXDM.Rpc({
          remote: _k.URL.apiRemote
        }, {
          remote: {
            request: {}
          }
        });
      });
    }

    return _rpc;
  }

  function isFileRequired(url) {
    return url === '/v1/api/story/upload/multi';
  }

  var rules = {
    request: {
      required: { url: function(url) { return _.isOneOf(_.keys(rules.api))(url); } },
      optional: { data: _.isObject,
                  files: function(obj) { return _.passesOneOf([_.isArray, _.isFileList])(obj) &&
                                                _.every(obj, _.passesOneOf([_.isFile, _.isBlob])); },
                  success: _.isFunction, fail: _.isFunction, always: _.isFunction }
    },
    api: {
      // User Management
      '/v1/user/signup': {
        method: 'post',
        data: {
          optional: { properties: _.isObject }
        }
      },
      '/v1/user/unlink': {
        method: 'post'
      },
      '/v1/user/me': {
        method: 'post',
        data: {
          optional: { propertyKeys: _.isArray }
        }
      },
      '/v1/user/logout': {
        method: 'post',
        data: {}
      },
      '/v1/user/update_profile': {
        method: 'post',
        data: {
          required: { properties: _.isObject }
        }
      },
      // Talk
      '/v1/api/talk/profile': {
        method: 'get'
      },
      // Story
      '/v1/api/story/profile': {
        method: 'get'
      },
      '/v1/api/story/mystory': {
        method: 'get',
        data: {
          required: { id: _.isString }
        }
      },
      '/v1/api/story/mystories': {
        method: 'get',
        data: {
          optional: { last_id: _.isString }
        }
      },
      '/v1/api/story/linkinfo': {
        method: 'get',
        data: {
          required: { url: _.isString }
        }
      },
      '/v1/api/story/post/note': {
        method: 'post',
        data: {
          required: { content: storyActivityContentValidator },
          optional: { permission: _.isOneOf(['A', 'F']),
                      enable_share: _.isBoolean,
                      android_exec_param: _.isString, ios_exec_param: _.isString }
        }
      },
      '/v1/api/story/post/photo': {
        method: 'post',
        data: {
          required: { image_url_list: kageImageUrlListValidator},
          optional: {
            permission: _.isOneOf(['A', 'F']),
            enable_share: _.isBoolean,
            content: storyActivityContentValidator,
            android_exec_param: _.isString, ios_exec_param: _.isString
          }
        }
      },
      '/v1/api/story/post/link': {
        method: 'post',
        data: {
          required: { link_info: _.isObject },
          optional: {
            permission: _.isOneOf(['A', 'F']),
            enable_share: _.isBoolean,
            content: storyActivityContentValidator,
            android_exec_param: _.isString, ios_exec_param: _.isString
          }
        }
      },
      '/v1/api/story/upload/multi': {
        method: 'post',
        data: {}
      }
    }
  };

  function storyActivityContentValidator(obj) {
    if (!_.isString(obj)) {
      return false;
    }

    if (obj.length > 2048) {
      throw new _k.KakaoError('content length should be less than 2048');
    }

    return true;
  }

  function kageImageUrlListValidator(obj) {
    if (!_.isArray(obj)) {
      return false;
    }

    return _.every(obj, function(path) {
      if (!_.isString(path)) {
        return false;
      }

      if (_.isURL(path)) {
        throw new _k.KakaoError("url in image_url_list should be a kage url, obtained from '/v1/api/story/upload/multi'.");
      }

      return true;
    });
  }

  API.cleanup = function() {
    if (_rpc) {
      _rpc.destroy();
      _rpc = null;
    }
  };

  return API;
})();

},{"../vendor/easyXDM.js":9,"./common.js":4,"./util.js":7}],3:[function(require,module,exports){
/*******************
 * Auth
 *******************/
module.exports = (function() {
  var Auth = {};

  var _easyXDM = require('../vendor/easyXDM.js');
  var _ = require('./util.js');
  var _k = require('./common.js');

  var cleanups = [];

  /**
   * container: element or id for login button container
   * lang: login button language. 'en', 'kr'. default: 'kr'
   * size: login button size. 'small', 'medium', 'large'. default: 'medium'
   * success: function(authObj) {}, authObj: { access_token:"...", refresh_token:"..." token_type:"bearer", expires_in:43199, scope:"Basic_Profile"}
   * error: function(errorObj) {}, errorObj: { error: "access_denied", error_description: "..."}
   * always: function (authObj | errorObj)
   * persistAccessToken: persist access token. default: true
   * persistRefreshToken: persist refresh token. default: false
   */
  Auth.createLoginButton = function(settings) {
    _k.processRules(settings, rules.createLoginButton, 'Auth.createLoginButton');

    _.defaults(settings, {
      lang: 'kr',
      size: 'medium'
    }, loginDefaultSettings);

    var container = _.getElement(settings.container);
    if (!container) {
      throw new _k.KakaoError('container is required for Kakao login button: pass in element or id');
    }

    var stateToken = '';

    // proxy created per button
    var proxy = getProxy({
      container: container
    }, function(response) {
      checkStateToken(response);
      handleAuthResponse(response, settings);

      refreshStateToken();
    });

    refreshStateToken();
    configureRemoteClient();

    cleanups.push(function() {
      proxy.destroy();
    });

    function checkStateToken(response) {
      if (response.stateToken !== stateToken) {
        throw new _k.KakaoError('security error: #CST');
      }

      delete response.stateToken;
      return response;
    }

    function refreshStateToken() {
      stateToken = _.getRandomString();
      proxy.setStateToken(stateToken);
    }

    function configureRemoteClient() {
      proxy.setClient(settings.lang, settings.size, _k.RUNTIME.appKey, function(size) {
        var iframe = container.getElementsByTagName('iframe')[0];
        iframe.style.width = size.width + 'px';
        iframe.style.height = size.height + 'px';
      });
    }
  };

  // used in Auth.login
  var _proxy;
  var _channelName = _.getRandomString();
  var _loginSettings = {};

  Auth.login = function(settings) {
    _k.processRules(settings, rules.login, 'Auth.login');

    _.defaults(settings, loginDefaultSettings);

    if (!_proxy) {
      _proxy = getProxy({
        channel: _channelName
      }, function(response) {
        if (!_.has(_loginSettings, response.stateToken)) {
          throw new _k.KakaoError('security error: #CST2');
        }

        var callback = _loginSettings[response.stateToken];
        delete _loginSettings[response.stateToken];
        delete response.stateToken;

        handleAuthResponse(response, callback);
      });

      cleanups.push(function() {
        _proxy.destroy();
      });
    }

    var stateToken = _.getRandomString();
    _loginSettings[stateToken] = settings;

    window.open(getAuthUrl(), '', 'width=720, height=480');

    function getAuthUrl() {
      var authParams = _.encodeQueryString({
        client_id: _k.RUNTIME.appKey,
        redirect_uri: 'kakaojs',
        response_type: 'code',
        state: stateToken,
        proxy: 'easyXDM_Kakao_' + _channelName + '_provider'
      });

      return _k.URL.authorize + '?' + authParams;
    }
  };

  var loginDefaultSettings = {
    success: _.emptyFunc,
    fail: _.emptyFunc,
    always: _.emptyFunc,
    persistAccessToken: true,
    persistRefreshToken: false
  };

  var rules = {
    createLoginButton: {
      required: { container: _.passesOneOf([_.isElement, _.isString]) },
      optional: {
        lang: _.isOneOf(['en', 'kr']), size: _.isOneOf(['small', 'medium', 'large']),
        success: _.isFunction, fail: _.isFunction, always: _.isFunction,
        persistAccessToken: _.isBoolean, persistRefreshToken: _.isBoolean
      }
    },
    login: {
      optional: {
        success: _.isFunction, fail: _.isFunction, always: _.isFunction,
        persistAccessToken: _.isBoolean, persistRefreshToken: _.isBoolean
      }
    }
  };

  function getProxy(config, responseHandler) {
    _.extend(config, {
      remote: _k.URL.loginWidget
    });

    return _k.guardCreateEasyXDM(function() {
      return new _easyXDM.Rpc(config, {
        local: {
          postResponse: responseHandler,
          getKakaoAgent: function() { return _k.KAKAO_AGENT; }
        },
        remote: {
          setClient: {},
          setStateToken: {},
          deleteAuthCookie: {}
        }
      });
    });
  }

  function handleAuthResponse(response, authSettings) {
    _k.logDebug(response);

    if (response.error) {
      if (response.error === 'window_closed') {
        return;
      }

      Auth.setAccessToken(null);
      Auth.setRefreshToken(null);
      authSettings.fail(response);
      authSettings.always(response);
    } else {
      Auth.setAccessToken(response.access_token, authSettings.persistAccessToken);
      Auth.setRefreshToken(response.refresh_token, authSettings.persistRefreshToken);
      authSettings.success(response);
      authSettings.always(response);
    }
  }

  Auth.logout = function(callback) {
    _k.validate(callback || _.emptyFunc, _.isFunction, 'Auth.logout');

    var onLogout = function() {
      var proxy = _proxy || getProxy({}, _.emptyFunc);
      proxy.deleteAuthCookie();

      if (callback) {
        callback(true);
      }
    };

    if (!Auth.getAccessToken()) {
      onLogout();
    } else {
      Kakao.API.request({
        url: '/v1/user/logout',
        always: function(res) {
          Auth.setAccessToken(null);
          Auth.setRefreshToken(null);
          onLogout();
        }
      });
    }
  };

  // get & set access tokens
  Auth.setAccessToken = function(token, persist) {
    _k.RUNTIME.accessToken = token;
    if (token === null || persist === false) { // explicitly requested non-persistance
      removeItem(getAccessTokenKey());
    } else {
      storeItem(getAccessTokenKey(), token);
    }
  };

  Auth.setRefreshToken = function(token, persist) {
    _k.RUNTIME.refreshToken = token;
    if (token !== null && persist === true) { // explicitly requested persistance
      storeItem(getRefreshTokenKey(), token);
    } else {
      removeItem(getRefreshTokenKey());
    }
  };

  Auth.getAccessToken = function() {
    if (!_k.RUNTIME.accessToken) {
      _k.RUNTIME.accessToken = retrieveItem(getAccessTokenKey());
    }

    return _k.RUNTIME.accessToken;
  };

  Auth.getRefreshToken = function() {
    if (!_k.RUNTIME.refreshToken) {
      _k.RUNTIME.refreshToken = retrieveItem(getRefreshTokenKey());
    }

    return _k.RUNTIME.refreshToken;
  };

  function storeItem(key, value) {
    var item = _.encrypt(value, _k.RUNTIME.appKey);
    localStorage.setItem(key, item);
  }

  function retrieveItem(key) {
    var item = localStorage.getItem(key);

    if (item) {
      return _.decrypt(item, _k.RUNTIME.appKey);
    } else {
      return null;
    }
  }

  function removeItem(key) {
    localStorage.removeItem(key);
  }

  // cache token storage keys
  var tokenStorageKeys = {};

  function getAccessTokenKey() {
    if (!tokenStorageKeys.accessTokenKey) {
      tokenStorageKeys.accessTokenKey = 'kakao_' + _.hash('kat' + _k.RUNTIME.appKey);
    }

    return tokenStorageKeys.accessTokenKey;
  }

  function getRefreshTokenKey() {
    if (!tokenStorageKeys.refreshTokenKey) {
      tokenStorageKeys.refreshTokenKey = 'kakao_' + _.hash('krt' + _k.RUNTIME.appKey);
    }

    return tokenStorageKeys.refreshTokenKey;
  }

  Auth.getAppKey = function() {
    return _k.RUNTIME.appKey;
  };

  Auth.getStatus = function(callback) {
    _k.validate(callback, _.isFunction, 'Auth.getStatus');

    if (!Auth.getAccessToken()) {
      callback({
        status: "not_connected"
      });
    } else {
      Kakao.API.request({
        url: '/v1/user/me',
        success: function(res) {
          callback({
            status: "connected",
            user: res
          });
        },
        fail: function() {
          callback({
            status: "not_connected"
          });
        }
      });
    }
  };

  Auth.cleanup = function() {
    _.each(cleanups, function(func, i) {
      func();
      cleanups.splice(i, 1);
    });
  };

  return Auth;
})();

},{"../vendor/easyXDM.js":9,"./common.js":4,"./util.js":7}],4:[function(require,module,exports){
/*
 * common codes, specific to kakao.js
 */

module.exports = (function() {
  var _k = {};

  var _ = require('./util.js');

  _k.VERSION = '1.0.7';

  _k.KAKAO_AGENT = 'sdk/' + _k.VERSION + ' os/javascript' +
                   ' lang/' + (navigator.userLanguage || navigator.language) +
                   ' device/' + navigator.platform.replace(/ /g, '_');

  _k.URL = {
    authorize: 'https://kauth.kakao.com' + '/oauth/authorize',
    loginWidget: 'https://kauth.kakao.com' + '/public/widget/login/kakaoLoginWidget.html',
    apiRemote: 'https://kapi.kakao.com' + '/cors/'
  };

  // global variables
  _k.RUNTIME = {
    appKey: '',
    accessToken: '',
    refreshToken: ''
  };

  var KakaoError = function(message) {
    Error.prototype.constructor.apply(this, arguments);
    this.name = 'KakaoError';
    this.message = message;
  };

  KakaoError.prototype = new Error();

  _k.KakaoError = KakaoError;

  _k.isDebug = function() {
    return false;
  };

  _k.logDebug = function(obj) {
    if (_k.isDebug()) {
      console.log(JSON.stringify(obj));
    }
  };

  /*
   * target: target to validate
   * validator: function to validate target. if given in array form, returns true if any validator returns true
   * callerMsg: msg to display in error
   */
  _k.validate = function(target, validator, callerMsg) {
    if (validator(target) !== true) {
      throw new KakaoError('Illegal argument for ' + callerMsg);
    }
  };

  /*
   * params: target to check
   * contstraint: { required: { a: _.isObject, b: function(p) { p < 50 } }, optional: {} }
   * callerMsg: msg to display in error
   */
  _k.processRules = function(params, rules, callerMsg) {
    _k.validate(params, _.isObject, callerMsg);

    if (rules.before) {
      rules.before(params);
    }

    _.defaults(params, rules.defaults);

    var required = rules.required || {};
    var optional = rules.optional || {};

    var allowed = _.extend({}, required, optional);

    var missingRequiredKeys = _.difference(_.keys(required), _.keys(params));
    if (missingRequiredKeys.length) {
      throw new KakaoError('Missing required keys: ' + missingRequiredKeys.join(',') + ' - ' + callerMsg);
    }

    var invalidKeys = _.difference(_.keys(params), _.keys(allowed));
    if (invalidKeys.length) {
      throw new KakaoError('Invalid parameter keys: ' + invalidKeys.join(',') + ' - ' + callerMsg);
    }

    _.each(params, function(value, key) {
      var validator = allowed[key];
      _k.validate(value, validator, '"' + key + '" in ' + callerMsg);
    });

    if (rules.after) {
      rules.after(params);
    }
  };

  /*
   * returns: "ios", "android+chrome", "android", "not_supported"
   */
  _k.getPlatform = function() {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return "ios";
    } else if (navigator.userAgent.match(/Android/i)) {
      var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
      if (window.chrome && !isOpera) {
        return "android+chrome";
      } else {
        return "android";
      }
    } else {
      return "not_supported";
    }
  };

  _k.createHiddenIframe = function(id, src) {
    var iframe = document.getElementById(id);

    if (iframe !== null) {
      iframe.parentNode.removeChild(iframe);
    }

    iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.style.border = "none";
    iframe.style.display = "none";
    iframe.style.width = "0px";
    iframe.style.height = "0px";

    iframe.src = src;

    return iframe;
  };

  // throw helpful exception when kakao.js is loaded from file system (file:///)
  _k.guardCreateEasyXDM = function(createEasyXDM) {
    try {
      return createEasyXDM();
    } catch (ex) {
      if (ex instanceof TypeError) {
       throw new KakaoError("kakao.js should be loaded from a web server");
      } else {
        throw new KakaoError('EasyXDM -' + ex.message);
      }
    }
  };

  _k.serializeFile = function(file) {
    return new Promise(function(resolve, reject) {
      if (typeof FileReader === "undefined") {
        reject(new KakaoError('File API is not supported for this browser.'));
      }

      var fileReader = new FileReader();

      fileReader.onload = function(e) {
        try {
          resolve(_.arrayBufferToString(e.target.result));
        } catch (e) {
          reject(e);
        }
      };

      fileReader.onerror = function(e) {
        reject(new KakaoError('Cannot read file: ' + file.name));
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  return _k;
})();

},{"./util.js":7}],5:[function(require,module,exports){
(function(root) {
  root.Kakao = root.Kakao || {};
  var Kakao = root.Kakao;

  var _ = require('./util.js');
  var _k = require('./common.js');

  Kakao.VERSION = _k.VERSION;

  Kakao.init = function(appKey) {
    if (_k.RUNTIME.appKey) {
      throw new _k.KakaoError('Already initialized.');
    }

    if (!_.isString(appKey)) {
      throw new _k.KakaoError('App key must be provided');
    }

    _k.RUNTIME.appKey = appKey;

    require('../vendor/es6-promise.js');

    Kakao.Auth = require('./auth.js');
    Kakao.API = require('./api.js');
    Kakao.Link = require('./link.js');
  };


  Kakao.cleanup = function() {
    Kakao.Auth.cleanup();
    Kakao.API.cleanup();
    Kakao.Link.cleanup();

    _.nullify(_k.RUNTIME);
  };

}(window));

},{"../vendor/es6-promise.js":10,"./api.js":2,"./auth.js":3,"./common.js":4,"./link.js":6,"./util.js":7}],6:[function(require,module,exports){
module.exports = (function() {
  var Link = {};

  var _ = require('./util.js');
  var _k = require('./common.js');

  var KakaoTalkLink = function() {
    this.appkey = _k.RUNTIME.appKey;
    this.appver = '1.0';
    this.apiver = '3.0';
    this.linkver = '3.5';
    this.objs = [];
  };

  var cleanups = [];

  /**
   * container: element or id for link container
   */
  Link.createTalkLink = Link.createTalkLinkButton = function(settings) {
    _k.processRules(settings, rules.createTalkLink, 'Link.createTalkLink');

    var container = _.getElement(settings.container);
    if (!container) {
      throw new _k.KakaoError('container is required for KakaoTalk Link: pass in element or id');
    }

    var linkUrl = buildLinkUrl(settings);

    var platform = _k.getPlatform();
    if (platform === "not_supported") {
      if (settings.fail) {
        settings.fail(linkUrl);
      }
      return;
    }

    var handler = function() {
      sendLink(linkUrl, platform);
    };

    _.addEvent(container,'click', handler);

    var cleanup = function() {
      _.removeEvent(container, 'click', handler);
    };

    cleanups.push(cleanup);
  };

  var rules = {
    createTalkLink: {
      required: { container: _.passesOneOf([_.isElement, _.isString]) },
      optional: {
        label: _.passesOneOf([_.isString, _.isObject]),
        image: _.isObject,
        webButton: _.isObject,
        webLink: _.isObject,
        appButton: _.isObject,
        appLink: _.isObject,
        fail: _.isFunction
      },
      before: function(settings) {
        if (_.isString(settings.label)) {
          settings.label = { text: settings.label };
        }
      }
    },
    kakaoTalkLink: {
      label: {
        required: { text: _.isString }
      },
      image: {
        required: { src: _.isString, width: imageSizeValidator, height: imageSizeValidator},
        before: function(image) {
          image.width = parseInt(image.width, 10);
          image.height = parseInt(image.height, 10);
        }
      },
      webButton: {
        optional: { text: _.isString, url: _.isString, inweb: _.isBoolean }
      },
      webLink: {
        required: { text: _.isString },
        optional: { url: _.isString, inweb: _.isBoolean }
      },
      appButton: {
        optional: { text: _.isString, execParams: _.isObject }
      },
      appLink: {
        required: { text: _.isString },
        optional: { execParams: _.isObject }
      }
    },
    appExecParams: {
      optional: { iphone: _.isObject, ipad: _.isObject, android: _.isObject }
    }
  };

  function imageSizeValidator(sizeValue) {
    var parsed = parseInt(sizeValue, 10);

    if (isNaN(parsed) || parsed < 70) {
      throw new _k.KakaoError('Illegal argument for image: should be a number larger than 70');
    }

    return true;
  }

  function buildLinkUrl(settings) {
    var link = new KakaoTalkLink();

    var linkObjectAdders = {
      label: function () {
        var labelObj = {
          "objtype": "label",
          "text": settings.label.text
        };

        link.objs.push(labelObj);
      },
      image: function () {
        var imageObj = {
          "objtype" : "image",
          "src": settings.image.src,
          "width": settings.image.width,
          "height": settings.image.height
        };

        link.objs.push(imageObj);
      },
      webButton: function () {
        var webButtonObj = getWebObj("button", settings.webButton.text, settings.webButton.url, settings.webButton.inweb);
        link.objs.push(webButtonObj);
      },
      webLink: function () {
        var webLinkObj = getWebObj("link", settings.webLink.text, settings.webLink.url, settings.webLink.inweb);
        link.objs.push(webLinkObj);
      },
      appButton: function () {
        var appButtonObj = getAppObj("button", settings.appButton.text, settings.appButton.execParams);
        link.objs.push(appButtonObj);
      },
      appLink: function () {
        var appLinkObj = getAppObj("link", settings.appLink.text, settings.appLink.execParams);
        link.objs.push(appLinkObj);
      }
    };

    _.each(settings, function(linkSettings, key) {
      var isLinkObjectSetting = _.contains(_.keys(rules.kakaoTalkLink), key);

      if (isLinkObjectSetting) {
        _k.processRules(linkSettings, rules.kakaoTalkLink[key], "parameter '" + key + "' in Link.createTalkLink");
        var adder = linkObjectAdders[key];
        adder();
      }
    });

    return 'kakaolink://send?' + _.encodeQueryString(link);

    function getWebObj(objType, text, url, isInweb) {
      return {
        "objtype": objType,
        "text": text,
        "action": {
          "type": isInweb? "inweb" : "web",
          "url": url ? formatUrl(url) : undefined
        }
      };

      function formatUrl(maybeUrl) {
        if (maybeUrl.indexOf("http://") === 0 || maybeUrl.indexOf("https://") === 0) {
          return maybeUrl;
        } else {
          return "http://" + maybeUrl;
        }
      }
    }

    function getAppObj(objType, text, execParams) {
      return {
        "objtype": objType,
        "text": text,
        "action": {
          "type": "app",
          "actioninfo": execParams ? getAppActionInfos(execParams) : []
        }
      };

      function getAppActionInfos(execParams) {
        var actionInfos = [];

        _k.processRules(execParams, rules.appExecParams, 'execParams in Kakao.Link.createTalkLink');

        if (execParams.android) {
          actionInfos.push({
            "os": "android",
            "execparam": _.encodeQueryString(execParams.android)
          });
        }

        if (execParams.iphone) {
          actionInfos.push({
            "os": "ios",
            "devicetype": "phone",
            "execparam": _.encodeQueryString(execParams.iphone)
          });
        }

        if (execParams.ipad) {
          actionInfos.push({
            "os": "ios",
            "devicetype": "pad",
            "execparam": _.encodeQueryString(execParams.ipad)
          });
        }

        return actionInfos;
      }
    }
  }

  var androidTalkInstallReferrer = {
    appkey: _k.RUNTIME.appKey,
    KA: _k.KAKAO_AGENT
  };

  var talkInstallUrls = {
    android: 'market://details?id=com.kakao.talk&referrer=' + JSON.stringify(androidTalkInstallReferrer),
    ios: 'http://itunes.apple.com/app/id362057947'
  };

  var talkPackageName = 'com.kakao.talk';

  function sendLink(url, platform) {
    if (platform === "android+chrome") {
      window.location = "intent:" + url + "#Intent;package=" + talkPackageName + ";end;";
    } else {
      var startTalkTime = new Date();
      var waitTime = 1500;
      var minTimeToSendLink = 2000;

      // * talk uninstalled:
      // will navigate to market after waitTime

      // * talk installed:
      // 1) opens before waitTime
      // if sending link takes more than minTimeToSendLink, all is good.
      // if comes back too quickly: incorrectly goes to market.

      // 2) callback called before talk opens (slow devices)
      // incorrectly goes to market.

      // minTimeToSendLink should be larger than waitTime.
      // if not, will not go to market even if talk is uninstalled.
      var timer = setTimeout(function() {
        var timePassed = new Date() - startTalkTime;
        var talkNotInstalled = timePassed < minTimeToSendLink;
        if (talkNotInstalled) {
          window.location.replace(talkInstallUrls[platform]);
        }
      }, waitTime);

      var frame = _k.createHiddenIframe('kakao_talkLink_iframe', url);
      document.body.appendChild(frame);
    }
  }

  Link.cleanup = function() {
    _.each(cleanups, function(func, i) {
      func();
      cleanups.splice(i, 1);
    });
  };

  return Link;
})();

},{"./common.js":4,"./util.js":7}],7:[function(require,module,exports){
/*
 * utility functions, not specific to kakao.js
 */

module.exports = (function(){
  var _ = {};

  var _crypto = require('../vendor/CryptoJS.js');

  /*
   * Underscore functions
   */
  var breaker = {};
  var ArrayProto = Array.prototype;
  var ObjProto = Object.prototype;
  var slice = ArrayProto.slice;
  var concat = ArrayProto.concat;
  var toString = ObjProto.toString;
  var hasOwnProperty   = ObjProto.hasOwnProperty;
  var nativeForEach = ArrayProto.forEach;
  var nativeMap = ArrayProto.map;
  var nativeFilter = ArrayProto.filter;
  var nativeEvery = ArrayProto.every;
  var nativeSome = ArrayProto.some;
  var nativeIndexOf = ArrayProto.indexOf;
  var nativeIsArray = Array.isArray;
  var nativeKeys = Object.keys;

  var each = _.each = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  _.filter = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  _.every = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  var any = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  _.contains = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  _.difference = function(array) {
     var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
     return _.filter(array, function(value){ return !_.contains(rest, value); });
   };

  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Blob', 'File', 'FileList'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  _.identity = function(value) {
    return value;
  };

  /*
   * end Underscore functions
   */

  _.emptyFunc = function() {};

  // get first element matched by selector
  _.getElement = function(selector) {
    if (_.isElement(selector)) { // passed in DOM element instead of selector
      return selector;
    } else if (_.isString(selector)) {
      return document.querySelector(selector);
    } else {
      return null;
    }
  };

  _.addEvent = function(element, event, func) {
    if (element.addEventListener) {
      element.addEventListener(event, func, false);
    } else if (element.attachEvent) { // IE 8 and below
      element.attachEvent("on" + event, func);
    }
  };

  _.removeEvent = function(element, event, func) {
    if (element.removeEventListener) {
      element.removeEventListener(event, func, false);
    } else if (element.detachEvent) { // IE 8 and below
      element.detachEvent('on' + event, func);
    }
  };

  _.encodeQueryString = function(params) {
    var ret = [];
    for (var key in params) {
      if (!params.hasOwnProperty(key))
        continue;

      var value = params[key];
      if (_.isObject(value)) {
        value = JSON.stringify(value);
      }

      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }

    return ret.join('&');
  };

  _.getRandomString = function() {
    return Math.random().toString(36).slice(2);
  };

  _.hash = function(msg) {
    var hashed = _crypto.MD5(msg);
    return hashed.toString();
  };

  _.encrypt = function(msg, passphrase) {
    var encrypted = _crypto.AES.encrypt(msg, passphrase);
    return encrypted.toString();
  };

  _.decrypt = function(encrypted, passphrase) {
    var decrypted = _crypto.AES.decrypt(encrypted, passphrase);
    return decrypted.toString(_crypto.enc.Utf8);
  };

  _.nullify = function(obj) {
    _.each(obj, function(value, key) {
      obj[key] = null;
    });
  };

  _.isOneOf = function(elements) {
    return _.partial(_.contains, elements);
  };

  _.passesOneOf = function(validators) {
    if (!_.isArray(validators))
      throw new Error('validators should be an Array');

    return function(obj) {
      return _.any(validators, function(validator) {
        return validator(obj);
      });
    };
  };

  _.isURL = function(obj) {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

    return urlPattern.test(obj);
  };

  _.arrayBufferToString = function (buffer) {
     var stringResult = "";
     var arrayBufferView = new Uint8Array(buffer);
     var length = arrayBufferView.length;
     var CHUNK_SIZE = Math.pow(2, 16);

     var offset, readLength, sub;
     for (offset = 0; offset < length; offset += CHUNK_SIZE) {
        readLength = Math.min(CHUNK_SIZE, length-offset);
        sub = arrayBufferView.subarray(offset, offset+readLength);
        stringResult += String.fromCharCode.apply(null, sub);
     }
     return stringResult;
  };

  return _;
})();

},{"../vendor/CryptoJS.js":8}],8:[function(require,module,exports){
module.exports = (function() {

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

  return CryptoJS;
})();
},{}],9:[function(require,module,exports){
module.exports = (function() {
/**
 * easyXDM 2.4.19
 * License: MIT
 */
 (function(N,d,p,K,k,H){var b=this;var n=Math.floor(Math.random()*10000);var q=Function.prototype;var Q=/^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;var R=/[\-\w]+\/\.\.\//;var F=/([^:])\/\//g;var I="";var o={};var M=N.easyXDM;var U="easyXDM_";var E;var y=false;var i;var h;function C(X,Z){var Y=typeof X[Z];return Y=="function"||(!!(Y=="object"&&X[Z]))||Y=="unknown"}function u(X,Y){return !!(typeof(X[Y])=="object"&&X[Y])}function r(X){return Object.prototype.toString.call(X)==="[object Array]"}function c(){var Z="Shockwave Flash",ad="application/x-shockwave-flash";if(!t(navigator.plugins)&&typeof navigator.plugins[Z]=="object"){var ab=navigator.plugins[Z].description;if(ab&&!t(navigator.mimeTypes)&&navigator.mimeTypes[ad]&&navigator.mimeTypes[ad].enabledPlugin){i=ab.match(/\d+/g)}}if(!i){var Y;try{Y=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");i=Array.prototype.slice.call(Y.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/),1);Y=null}catch(ac){}}if(!i){return false}var X=parseInt(i[0],10),aa=parseInt(i[1],10);h=X>9&&aa>0;return true}var v,x;if(C(N,"addEventListener")){v=function(Z,X,Y){Z.addEventListener(X,Y,false)};x=function(Z,X,Y){Z.removeEventListener(X,Y,false)}}else{if(C(N,"attachEvent")){v=function(X,Z,Y){X.attachEvent("on"+Z,Y)};x=function(X,Z,Y){X.detachEvent("on"+Z,Y)}}else{throw new Error("Browser not supported")}}var W=false,J=[],L;if("readyState" in d){L=d.readyState;W=L=="complete"||(~navigator.userAgent.indexOf("AppleWebKit/")&&(L=="loaded"||L=="interactive"))}else{W=!!d.body}function s(){if(W){return}W=true;for(var X=0;X<J.length;X++){J[X]()}J.length=0}if(!W){if(C(N,"addEventListener")){v(d,"DOMContentLoaded",s)}else{v(d,"readystatechange",function(){if(d.readyState=="complete"){s()}});if(d.documentElement.doScroll&&N===top){var g=function(){if(W){return}try{d.documentElement.doScroll("left")}catch(X){K(g,1);return}s()};g()}}v(N,"load",s)}function G(Y,X){if(W){Y.call(X);return}J.push(function(){Y.call(X)})}function m(){var Z=parent;if(I!==""){for(var X=0,Y=I.split(".");X<Y.length;X++){Z=Z[Y[X]]}}return Z.easyXDM}function e(X){N.easyXDM=M;I=X;if(I){U="easyXDM_"+I.replace(".","_")+"_"}return o}function z(X){return X.match(Q)[3]}function f(X){return X.match(Q)[4]||""}function j(Z){var X=Z.toLowerCase().match(Q);var aa=X[2],ab=X[3],Y=X[4]||"";if((aa=="http:"&&Y==":80")||(aa=="https:"&&Y==":443")){Y=""}return aa+"//"+ab+Y}function B(X){X=X.replace(F,"$1/");if(!X.match(/^(http||https):\/\//)){var Y=(X.substring(0,1)==="/")?"":p.pathname;if(Y.substring(Y.length-1)!=="/"){Y=Y.substring(0,Y.lastIndexOf("/")+1)}X=p.protocol+"//"+p.host+Y+X}while(R.test(X)){X=X.replace(R,"")}return X}function P(X,aa){var ac="",Z=X.indexOf("#");if(Z!==-1){ac=X.substring(Z);X=X.substring(0,Z)}var ab=[];for(var Y in aa){if(aa.hasOwnProperty(Y)){ab.push(Y+"="+H(aa[Y]))}}return X+(y?"#":(X.indexOf("?")==-1?"?":"&"))+ab.join("&")+ac}var S=(function(X){X=X.substring(1).split("&");var Z={},aa,Y=X.length;while(Y--){aa=X[Y].split("=");Z[aa[0]]=k(aa[1])}return Z}(/xdm_e=/.test(p.search)?p.search:p.hash));function t(X){return typeof X==="undefined"}var O=function(){var Y={};var Z={a:[1,2,3]},X='{"a":[1,2,3]}';if(typeof JSON!="undefined"&&typeof JSON.stringify==="function"&&JSON.stringify(Z).replace((/\s/g),"")===X){return JSON}if(Object.toJSON){if(Object.toJSON(Z).replace((/\s/g),"")===X){Y.stringify=Object.toJSON}}if(typeof String.prototype.evalJSON==="function"){Z=X.evalJSON();if(Z.a&&Z.a.length===3&&Z.a[2]===3){Y.parse=function(aa){return aa.evalJSON()}}}if(Y.stringify&&Y.parse){O=function(){return Y};return Y}return null};function T(X,Y,Z){var ab;for(var aa in Y){if(Y.hasOwnProperty(aa)){if(aa in X){ab=Y[aa];if(typeof ab==="object"){T(X[aa],ab,Z)}else{if(!Z){X[aa]=Y[aa]}}}else{X[aa]=Y[aa]}}}return X}function a(){var Y=d.body.appendChild(d.createElement("form")),X=Y.appendChild(d.createElement("input"));X.name=U+"TEST"+n;E=X!==Y.elements[X.name];d.body.removeChild(Y)}function A(Y){if(t(E)){a()}var ac;if(E){ac=d.createElement('<iframe name="'+Y.props.name+'"/>')}else{ac=d.createElement("IFRAME");ac.name=Y.props.name}ac.id=ac.name=Y.props.name;delete Y.props.name;if(typeof Y.container=="string"){Y.container=d.getElementById(Y.container)}if(!Y.container){T(ac.style,{position:"absolute",top:"-2000px",left:"0px"});Y.container=d.body}var ab=Y.props.src;Y.props.src="javascript:false";T(ac,Y.props);ac.border=ac.frameBorder=0;ac.allowTransparency=true;Y.container.appendChild(ac);if(Y.onLoad){v(ac,"load",Y.onLoad)}if(Y.usePost){var aa=Y.container.appendChild(d.createElement("form")),X;aa.target=ac.name;aa.action=ab;aa.method="POST";if(typeof(Y.usePost)==="object"){for(var Z in Y.usePost){if(Y.usePost.hasOwnProperty(Z)){if(E){X=d.createElement('<input name="'+Z+'"/>')}else{X=d.createElement("INPUT");X.name=Z}X.value=Y.usePost[Z];aa.appendChild(X)}}}aa.submit();aa.parentNode.removeChild(aa)}else{ac.src=ab}Y.props.src=ab;return ac}function V(aa,Z){if(typeof aa=="string"){aa=[aa]}var Y,X=aa.length;while(X--){Y=aa[X];Y=new RegExp(Y.substr(0,1)=="^"?Y:("^"+Y.replace(/(\*)/g,".$1").replace(/\?/g,".")+"$"));if(Y.test(Z)){return true}}return false}function l(Z){var ae=Z.protocol,Y;Z.isHost=Z.isHost||t(S.xdm_p);y=Z.hash||false;if(!Z.props){Z.props={}}if(!Z.isHost){Z.channel=S.xdm_c.replace(/["'<>\\]/g,"");Z.secret=S.xdm_s;Z.remote=S.xdm_e.replace(/["'<>\\]/g,"");ae=S.xdm_p;if(Z.acl&&!V(Z.acl,Z.remote)){throw new Error("Access denied for "+Z.remote)}}else{Z.remote=B(Z.remote);Z.channel=Z.channel||"default"+n++;Z.secret=Math.random().toString(16).substring(2);if(t(ae)){if(j(p.href)==j(Z.remote)){ae="4"}else{if(C(N,"postMessage")||C(d,"postMessage")){ae="1"}else{if(Z.swf&&C(N,"ActiveXObject")&&c()){ae="6"}else{if(navigator.product==="Gecko"&&"frameElement" in N&&navigator.userAgent.indexOf("WebKit")==-1){ae="5"}else{if(Z.remoteHelper){ae="2"}else{ae="0"}}}}}}}Z.protocol=ae;switch(ae){case"0":T(Z,{interval:100,delay:2000,useResize:true,useParent:false,usePolling:false},true);if(Z.isHost){if(!Z.local){var ac=p.protocol+"//"+p.host,X=d.body.getElementsByTagName("img"),ad;var aa=X.length;while(aa--){ad=X[aa];if(ad.src.substring(0,ac.length)===ac){Z.local=ad.src;break}}if(!Z.local){Z.local=N}}var ab={xdm_c:Z.channel,xdm_p:0};if(Z.local===N){Z.usePolling=true;Z.useParent=true;Z.local=p.protocol+"//"+p.host+p.pathname+p.search;ab.xdm_e=Z.local;ab.xdm_pa=1}else{ab.xdm_e=B(Z.local)}if(Z.container){Z.useResize=false;ab.xdm_po=1}Z.remote=P(Z.remote,ab)}else{T(Z,{channel:S.xdm_c,remote:S.xdm_e,useParent:!t(S.xdm_pa),usePolling:!t(S.xdm_po),useResize:Z.useParent?false:Z.useResize})}Y=[new o.stack.HashTransport(Z),new o.stack.ReliableBehavior({}),new o.stack.QueueBehavior({encode:true,maxLength:4000-Z.remote.length}),new o.stack.VerifyBehavior({initiate:Z.isHost})];break;case"1":Y=[new o.stack.PostMessageTransport(Z)];break;case"2":if(Z.isHost){Z.remoteHelper=B(Z.remoteHelper)}Y=[new o.stack.NameTransport(Z),new o.stack.QueueBehavior(),new o.stack.VerifyBehavior({initiate:Z.isHost})];break;case"3":Y=[new o.stack.NixTransport(Z)];break;case"4":Y=[new o.stack.SameOriginTransport(Z)];break;case"5":Y=[new o.stack.FrameElementTransport(Z)];break;case"6":if(!i){c()}Y=[new o.stack.FlashTransport(Z)];break}Y.push(new o.stack.QueueBehavior({lazy:Z.lazy,remove:true}));return Y}function D(aa){var ab,Z={incoming:function(ad,ac){this.up.incoming(ad,ac)},outgoing:function(ac,ad){this.down.outgoing(ac,ad)},callback:function(ac){this.up.callback(ac)},init:function(){this.down.init()},destroy:function(){this.down.destroy()}};for(var Y=0,X=aa.length;Y<X;Y++){ab=aa[Y];T(ab,Z,true);if(Y!==0){ab.down=aa[Y-1]}if(Y!==X-1){ab.up=aa[Y+1]}}return ab}function w(X){X.up.down=X.down;X.down.up=X.up;X.up=X.down=null}T(o,{version:"2.4.19.3",query:S,stack:{},apply:T,getJSONObject:O,whenReady:G,noConflict:e});o.DomHelper={on:v,un:x,requiresJSON:function(X){if(!u(N,"JSON")){d.write('<script type="text/javascript" src="'+X+'"><\/script>')}}};(function(){var X={};o.Fn={set:function(Y,Z){X[Y]=Z},get:function(Z,Y){if(!X.hasOwnProperty(Z)){return}var aa=X[Z];if(Y){delete X[Z]}return aa}}}());o.Socket=function(Y){var X=D(l(Y).concat([{incoming:function(ab,aa){Y.onMessage(ab,aa)},callback:function(aa){if(Y.onReady){Y.onReady(aa)}}}])),Z=j(Y.remote);this.origin=j(Y.remote);this.destroy=function(){X.destroy()};this.postMessage=function(aa){X.outgoing(aa,Z)};X.init()};o.Rpc=function(Z,Y){if(Y.local){for(var ab in Y.local){if(Y.local.hasOwnProperty(ab)){var aa=Y.local[ab];if(typeof aa==="function"){Y.local[ab]={method:aa}}}}}var X=D(l(Z).concat([new o.stack.RpcBehavior(this,Y),{callback:function(ac){if(Z.onReady){Z.onReady(ac)}}}]));this.origin=j(Z.remote);this.destroy=function(){X.destroy()};X.init()};o.stack.SameOriginTransport=function(Y){var Z,ab,aa,X;return(Z={outgoing:function(ad,ae,ac){aa(ad);if(ac){ac()}},destroy:function(){if(ab){ab.parentNode.removeChild(ab);ab=null}},onDOMReady:function(){X=j(Y.remote);if(Y.isHost){T(Y.props,{src:P(Y.remote,{xdm_e:p.protocol+"//"+p.host+p.pathname,xdm_c:Y.channel,xdm_p:4}),name:U+Y.channel+"_provider"});ab=A(Y);o.Fn.set(Y.channel,function(ac){aa=ac;K(function(){Z.up.callback(true)},0);return function(ad){Z.up.incoming(ad,X)}})}else{aa=m().Fn.get(Y.channel,true)(function(ac){Z.up.incoming(ac,X)});K(function(){Z.up.callback(true)},0)}},init:function(){G(Z.onDOMReady,Z)}})};o.stack.FlashTransport=function(aa){var ac,X,ab,ad,Y,ae;function af(ah,ag){K(function(){ac.up.incoming(ah,ad)},0)}function Z(ah){var ag=aa.swf+"?host="+aa.isHost;var aj="easyXDM_swf_"+Math.floor(Math.random()*10000);o.Fn.set("flash_loaded"+ah.replace(/[\-.]/g,"_"),function(){o.stack.FlashTransport[ah].swf=Y=ae.firstChild;var ak=o.stack.FlashTransport[ah].queue;for(var al=0;al<ak.length;al++){ak[al]()}ak.length=0});if(aa.swfContainer){ae=(typeof aa.swfContainer=="string")?d.getElementById(aa.swfContainer):aa.swfContainer}else{ae=d.createElement("div");T(ae.style,h&&aa.swfNoThrottle?{height:"20px",width:"20px",position:"fixed",right:0,top:0}:{height:"1px",width:"1px",position:"absolute",overflow:"hidden",right:0,top:0});d.body.appendChild(ae)}var ai="callback=flash_loaded"+H(ah.replace(/[\-.]/g,"_"))+"&proto="+b.location.protocol+"&domain="+H(z(b.location.href))+"&port="+H(f(b.location.href))+"&ns="+H(I);ae.innerHTML="<object height='20' width='20' type='application/x-shockwave-flash' id='"+aj+"' data='"+ag+"'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='"+ag+"'></param><param name='flashvars' value='"+ai+"'></param><embed type='application/x-shockwave-flash' FlashVars='"+ai+"' allowScriptAccess='always' wmode='transparent' src='"+ag+"' height='1' width='1'></embed></object>"}return(ac={outgoing:function(ah,ai,ag){Y.postMessage(aa.channel,ah.toString());if(ag){ag()}},destroy:function(){try{Y.destroyChannel(aa.channel)}catch(ag){}Y=null;if(X){X.parentNode.removeChild(X);X=null}},onDOMReady:function(){ad=aa.remote;o.Fn.set("flash_"+aa.channel+"_init",function(){K(function(){ac.up.callback(true)})});o.Fn.set("flash_"+aa.channel+"_onMessage",af);aa.swf=B(aa.swf);var ah=z(aa.swf);var ag=function(){o.stack.FlashTransport[ah].init=true;Y=o.stack.FlashTransport[ah].swf;Y.createChannel(aa.channel,aa.secret,j(aa.remote),aa.isHost);if(aa.isHost){if(h&&aa.swfNoThrottle){T(aa.props,{position:"fixed",right:0,top:0,height:"20px",width:"20px"})}T(aa.props,{src:P(aa.remote,{xdm_e:j(p.href),xdm_c:aa.channel,xdm_p:6,xdm_s:aa.secret}),name:U+aa.channel+"_provider"});X=A(aa)}};if(o.stack.FlashTransport[ah]&&o.stack.FlashTransport[ah].init){ag()}else{if(!o.stack.FlashTransport[ah]){o.stack.FlashTransport[ah]={queue:[ag]};Z(ah)}else{o.stack.FlashTransport[ah].queue.push(ag)}}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.PostMessageTransport=function(aa){var ac,ad,Y,Z;function X(ae){if(ae.origin){return j(ae.origin)}if(ae.uri){return j(ae.uri)}if(ae.domain){return p.protocol+"//"+ae.domain}throw"Unable to retrieve the origin of the event"}function ab(af){var ae=X(af);if(ae==Z&&af.data.substring(0,aa.channel.length+1)==aa.channel+" "){ac.up.incoming(af.data.substring(aa.channel.length+1),ae)}}return(ac={outgoing:function(af,ag,ae){Y.postMessage(aa.channel+" "+af,ag||Z);if(ae){ae()}},destroy:function(){x(N,"message",ab);if(ad){Y=null;ad.parentNode.removeChild(ad);ad=null}},onDOMReady:function(){Z=j(aa.remote);if(aa.isHost){var ae=function(af){if(af.data==aa.channel+"-ready"){Y=("postMessage" in ad.contentWindow)?ad.contentWindow:ad.contentWindow.document;x(N,"message",ae);v(N,"message",ab);K(function(){ac.up.callback(true)},0)}};v(N,"message",ae);T(aa.props,{src:P(aa.remote,{xdm_e:j(p.href),xdm_c:aa.channel,xdm_p:1}),name:U+aa.channel+"_provider"});ad=A(aa)}else{v(N,"message",ab);Y=("postMessage" in N.parent)?N.parent:N.parent.document;Y.postMessage(aa.channel+"-ready",Z);K(function(){ac.up.callback(true)},0)}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.FrameElementTransport=function(Y){var Z,ab,aa,X;return(Z={outgoing:function(ad,ae,ac){aa.call(this,ad);if(ac){ac()}},destroy:function(){if(ab){ab.parentNode.removeChild(ab);ab=null}},onDOMReady:function(){X=j(Y.remote);if(Y.isHost){T(Y.props,{src:P(Y.remote,{xdm_e:j(p.href),xdm_c:Y.channel,xdm_p:5}),name:U+Y.channel+"_provider"});ab=A(Y);ab.fn=function(ac){delete ab.fn;aa=ac;K(function(){Z.up.callback(true)},0);return function(ad){Z.up.incoming(ad,X)}}}else{if(d.referrer&&j(d.referrer)!=S.xdm_e){N.top.location=S.xdm_e}aa=N.frameElement.fn(function(ac){Z.up.incoming(ac,X)});Z.up.callback(true)}},init:function(){G(Z.onDOMReady,Z)}})};o.stack.NameTransport=function(ab){var ac;var ae,ai,aa,ag,ah,Y,X;function af(al){var ak=ab.remoteHelper+(ae?"#_3":"#_2")+ab.channel;ai.contentWindow.sendMessage(al,ak)}function ad(){if(ae){if(++ag===2||!ae){ac.up.callback(true)}}else{af("ready");ac.up.callback(true)}}function aj(ak){ac.up.incoming(ak,Y)}function Z(){if(ah){K(function(){ah(true)},0)}}return(ac={outgoing:function(al,am,ak){ah=ak;af(al)},destroy:function(){ai.parentNode.removeChild(ai);ai=null;if(ae){aa.parentNode.removeChild(aa);aa=null}},onDOMReady:function(){ae=ab.isHost;ag=0;Y=j(ab.remote);ab.local=B(ab.local);if(ae){o.Fn.set(ab.channel,function(al){if(ae&&al==="ready"){o.Fn.set(ab.channel,aj);ad()}});X=P(ab.remote,{xdm_e:ab.local,xdm_c:ab.channel,xdm_p:2});T(ab.props,{src:X+"#"+ab.channel,name:U+ab.channel+"_provider"});aa=A(ab)}else{ab.remoteHelper=ab.remote;o.Fn.set(ab.channel,aj)}var ak=function(){var al=ai||this;x(al,"load",ak);o.Fn.set(ab.channel+"_load",Z);(function am(){if(typeof al.contentWindow.sendMessage=="function"){ad()}else{K(am,50)}}())};ai=A({props:{src:ab.local+"#_4"+ab.channel},onLoad:ak})},init:function(){G(ac.onDOMReady,ac)}})};o.stack.HashTransport=function(Z){var ac;var ah=this,af,aa,X,ad,am,ab,al;var ag,Y;function ak(ao){if(!al){return}var an=Z.remote+"#"+(am++)+"_"+ao;((af||!ag)?al.contentWindow:al).location=an}function ae(an){ad=an;ac.up.incoming(ad.substring(ad.indexOf("_")+1),Y)}function aj(){if(!ab){return}var an=ab.location.href,ap="",ao=an.indexOf("#");if(ao!=-1){ap=an.substring(ao)}if(ap&&ap!=ad){ae(ap)}}function ai(){aa=setInterval(aj,X)}return(ac={outgoing:function(an,ao){ak(an)},destroy:function(){N.clearInterval(aa);if(af||!ag){al.parentNode.removeChild(al)}al=null},onDOMReady:function(){af=Z.isHost;X=Z.interval;ad="#"+Z.channel;am=0;ag=Z.useParent;Y=j(Z.remote);if(af){T(Z.props,{src:Z.remote,name:U+Z.channel+"_provider"});if(ag){Z.onLoad=function(){ab=N;ai();ac.up.callback(true)}}else{var ap=0,an=Z.delay/50;(function ao(){if(++ap>an){throw new Error("Unable to reference listenerwindow")}try{ab=al.contentWindow.frames[U+Z.channel+"_consumer"]}catch(aq){}if(ab){ai();ac.up.callback(true)}else{K(ao,50)}}())}al=A(Z)}else{ab=N;ai();if(ag){al=parent;ac.up.callback(true)}else{T(Z,{props:{src:Z.remote+"#"+Z.channel+new Date(),name:U+Z.channel+"_consumer"},onLoad:function(){ac.up.callback(true)}});al=A(Z)}}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.ReliableBehavior=function(Y){var aa,ac;var ab=0,X=0,Z="";return(aa={incoming:function(af,ad){var ae=af.indexOf("_"),ag=af.substring(0,ae).split(",");af=af.substring(ae+1);if(ag[0]==ab){Z="";if(ac){ac(true)}}if(af.length>0){aa.down.outgoing(ag[1]+","+ab+"_"+Z,ad);if(X!=ag[1]){X=ag[1];aa.up.incoming(af,ad)}}},outgoing:function(af,ad,ae){Z=af;ac=ae;aa.down.outgoing(X+","+(++ab)+"_"+af,ad)}})};o.stack.QueueBehavior=function(Z){var ac,ad=[],ag=true,aa="",af,X=0,Y=false,ab=false;function ae(){if(Z.remove&&ad.length===0){w(ac);return}if(ag||ad.length===0||af){return}ag=true;var ah=ad.shift();ac.down.outgoing(ah.data,ah.origin,function(ai){ag=false;if(ah.callback){K(function(){ah.callback(ai)},0)}ae()})}return(ac={init:function(){if(t(Z)){Z={}}if(Z.maxLength){X=Z.maxLength;ab=true}if(Z.lazy){Y=true}else{ac.down.init()}},callback:function(ai){ag=false;var ah=ac.up;ae();ah.callback(ai)},incoming:function(ak,ai){if(ab){var aj=ak.indexOf("_"),ah=parseInt(ak.substring(0,aj),10);aa+=ak.substring(aj+1);if(ah===0){if(Z.encode){aa=k(aa)}ac.up.incoming(aa,ai);aa=""}}else{ac.up.incoming(ak,ai)}},outgoing:function(al,ai,ak){if(Z.encode){al=H(al)}var ah=[],aj;if(ab){while(al.length!==0){aj=al.substring(0,X);al=al.substring(aj.length);ah.push(aj)}while((aj=ah.shift())){ad.push({data:ah.length+"_"+aj,origin:ai,callback:ah.length===0?ak:null})}}else{ad.push({data:al,origin:ai,callback:ak})}if(Y){ac.down.init()}else{ae()}},destroy:function(){af=true;ac.down.destroy()}})};o.stack.VerifyBehavior=function(ab){var ac,aa,Y,Z=false;function X(){aa=Math.random().toString(16).substring(2);ac.down.outgoing(aa)}return(ac={incoming:function(af,ad){var ae=af.indexOf("_");if(ae===-1){if(af===aa){ac.up.callback(true)}else{if(!Y){Y=af;if(!ab.initiate){X()}ac.down.outgoing(af)}}}else{if(af.substring(0,ae)===Y){ac.up.incoming(af.substring(ae+1),ad)}}},outgoing:function(af,ad,ae){ac.down.outgoing(aa+"_"+af,ad,ae)},callback:function(ad){if(ab.initiate){X()}}})};o.stack.RpcBehavior=function(ad,Y){var aa,af=Y.serializer||O();var ae=0,ac={};function X(ag){ag.jsonrpc="2.0";aa.down.outgoing(af.stringify(ag))}function ab(ag,ai){var ah=Array.prototype.slice;return function(){var aj=arguments.length,al,ak={method:ai};if(aj>0&&typeof arguments[aj-1]==="function"){if(aj>1&&typeof arguments[aj-2]==="function"){al={success:arguments[aj-2],error:arguments[aj-1]};ak.params=ah.call(arguments,0,aj-2)}else{al={success:arguments[aj-1]};ak.params=ah.call(arguments,0,aj-1)}ac[""+(++ae)]=al;ak.id=ae}else{ak.params=ah.call(arguments,0)}if(ag.namedParams&&ak.params.length===1){ak.params=ak.params[0]}X(ak)}}function Z(an,am,ai,al){if(!ai){if(am){X({id:am,error:{code:-32601,message:"Procedure not found."}})}return}var ak,ah;if(am){ak=function(ao){ak=q;X({id:am,result:ao})};ah=function(ao,ap){ah=q;var aq={id:am,error:{code:-32099,message:ao}};if(ap){aq.error.data=ap}X(aq)}}else{ak=ah=q}if(!r(al)){al=[al]}try{var ag=ai.method.apply(ai.scope,al.concat([ak,ah]));if(!t(ag)){ak(ag)}}catch(aj){ah(aj.message)}}return(aa={incoming:function(ah,ag){var ai=af.parse(ah);if(ai.method){if(Y.handle){Y.handle(ai,X)}else{Z(ai.method,ai.id,Y.local[ai.method],ai.params)}}else{var aj=ac[ai.id];if(ai.error){if(aj.error){aj.error(ai.error)}}else{if(aj.success){aj.success(ai.result)}}delete ac[ai.id]}},init:function(){if(Y.remote){for(var ag in Y.remote){if(Y.remote.hasOwnProperty(ag)){ad[ag]=ab(Y.remote[ag],ag)}}}aa.down.init()},destroy:function(){for(var ag in Y.remote){if(Y.remote.hasOwnProperty(ag)&&ad.hasOwnProperty(ag)){delete ad[ag]}}aa.down.destroy()}})};b.easyXDM=o})(window,document,location,window.setTimeout,decodeURIComponent,encodeURIComponent);

 return easyXDM.noConflict('Kakao');
})();


},{}],10:[function(require,module,exports){
(function (process,global){
!function(){var a,b,c,d;!function(){var e={},f={};a=function(a,b,c){e[a]={deps:b,callback:c}},d=c=b=function(a){function c(b){if("."!==b.charAt(0))return b;for(var c=b.split("/"),d=a.split("/").slice(0,-1),e=0,f=c.length;f>e;e++){var g=c[e];if(".."===g)d.pop();else{if("."===g)continue;d.push(g)}}return d.join("/")}if(d._eak_seen=e,f[a])return f[a];if(f[a]={},!e[a])throw new Error("Could not find module "+a);for(var g,h=e[a],i=h.deps,j=h.callback,k=[],l=0,m=i.length;m>l;l++)"exports"===i[l]?k.push(g={}):k.push(b(c(i[l])));var n=j.apply(this,k);return f[a]=g||n}}(),a("promise/all",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to all.");return new b(function(b,c){function d(a){return function(b){f(a,b)}}function f(a,c){h[a]=c,0===--i&&b(h)}var g,h=[],i=a.length;0===i&&b([]);for(var j=0;j<a.length;j++)g=a[j],g&&e(g.then)?g.then(d(j),c):f(j,g)})}var d=a.isArray,e=a.isFunction;b.all=c}),a("promise/asap",["exports"],function(a){"use strict";function b(){return function(){process.nextTick(e)}}function c(){var a=0,b=new i(e),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function d(){return function(){j.setTimeout(e,1)}}function e(){for(var a=0;a<k.length;a++){var b=k[a],c=b[0],d=b[1];c(d)}k=[]}function f(a,b){var c=k.push([a,b]);1===c&&g()}var g,h="undefined"!=typeof window?window:{},i=h.MutationObserver||h.WebKitMutationObserver,j="undefined"!=typeof global?global:void 0===this?window:this,k=[];g="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?b():i?c():d(),a.asap=f}),a("promise/config",["exports"],function(a){"use strict";function b(a,b){return 2!==arguments.length?c[a]:(c[a]=b,void 0)}var c={instrument:!1};a.config=c,a.configure=b}),a("promise/polyfill",["./promise","./utils","exports"],function(a,b,c){"use strict";function d(){var a;a="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self;var b="Promise"in a&&"resolve"in a.Promise&&"reject"in a.Promise&&"all"in a.Promise&&"race"in a.Promise&&function(){var b;return new a.Promise(function(a){b=a}),f(b)}();b||(a.Promise=e)}var e=a.Promise,f=b.isFunction;c.polyfill=d}),a("promise/promise",["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],function(a,b,c,d,e,f,g,h){"use strict";function i(a){if(!v(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof i))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._subscribers=[],j(a,this)}function j(a,b){function c(a){o(b,a)}function d(a){q(b,a)}try{a(c,d)}catch(e){d(e)}}function k(a,b,c,d){var e,f,g,h,i=v(c);if(i)try{e=c(d),g=!0}catch(j){h=!0,f=j}else e=d,g=!0;n(b,e)||(i&&g?o(b,e):h?q(b,f):a===D?o(b,e):a===E&&q(b,e))}function l(a,b,c,d){var e=a._subscribers,f=e.length;e[f]=b,e[f+D]=c,e[f+E]=d}function m(a,b){for(var c,d,e=a._subscribers,f=a._detail,g=0;g<e.length;g+=3)c=e[g],d=e[g+b],k(b,c,d,f);a._subscribers=null}function n(a,b){var c,d=null;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(u(b)&&(d=b.then,v(d)))return d.call(b,function(d){return c?!0:(c=!0,b!==d?o(a,d):p(a,d),void 0)},function(b){return c?!0:(c=!0,q(a,b),void 0)}),!0}catch(e){return c?!0:(q(a,e),!0)}return!1}function o(a,b){a===b?p(a,b):n(a,b)||p(a,b)}function p(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(r,a))}function q(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(s,a))}function r(a){m(a,a._state=D)}function s(a){m(a,a._state=E)}var t=a.config,u=(a.configure,b.objectOrFunction),v=b.isFunction,w=(b.now,c.all),x=d.race,y=e.resolve,z=f.reject,A=g.asap;t.async=A;var B=void 0,C=0,D=1,E=2;i.prototype={constructor:i,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,d=new this.constructor(function(){});if(this._state){var e=arguments;t.async(function(){k(c._state,d,e[c._state-1],c._detail)})}else l(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}},i.all=w,i.race=x,i.resolve=y,i.reject=z,h.Promise=i}),a("promise/race",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to race.");return new b(function(b,c){for(var d,e=0;e<a.length;e++)d=a[e],d&&"function"==typeof d.then?d.then(b,c):b(d)})}var d=a.isArray;b.race=c}),a("promise/reject",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b,c){c(a)})}a.reject=b}),a("promise/resolve",["exports"],function(a){"use strict";function b(a){if(a&&"object"==typeof a&&a.constructor===this)return a;var b=this;return new b(function(b){b(a)})}a.resolve=b}),a("promise/utils",["exports"],function(a){"use strict";function b(a){return c(a)||"object"==typeof a&&null!==a}function c(a){return"function"==typeof a}function d(a){return"[object Array]"===Object.prototype.toString.call(a)}var e=Date.now||function(){return(new Date).getTime()};a.objectOrFunction=b,a.isFunction=c,a.isArray=d,a.now=e}),b("promise/polyfill").polyfill()}();

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1YiZ5S":1}]},{},[5])