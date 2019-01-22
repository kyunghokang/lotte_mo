/* 디버그 목적의 로거 */
(function(window, angular, undefined) {
    'use strict';
    
    var logModule = angular.module('Logger', []);
    
    logModule.config(['$httpProvider', function ($httpProvider, $q, $log){
		$httpProvider.interceptors.push(function($q, $log) {
			return {
				'request': function(config) {
					$log.debug('$http request:'+config.url);
					return config;
				},

				'response': function(response) {
					if (response) {
					  var res = '$http response['+response.status+']'+response.config.url;
					  $log.debug(res);
				  }
					return response;
				}
			};
		});
    }]);
    
    logModule.config([ "$provide", function( $provide ) {
		$provide.decorator( '$log', [ "$delegate", function( $delegate ) {
			var debugFn = $delegate.debug; // Save the original $log.debug()
			$delegate.debug = function( ) {
				var args = [].slice.call(arguments);
				/*
				var date = new Date();
				var datestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+":"+date.getMilliseconds();
				args[0] = [args[0]].join('');
				*/
				debugFn.apply(null, args)
			};
			
			var separator = "::";
			
			var prepareLogFn = function (logFn, className, colorCSS) {
				var enhancedLogFn = function () {
				    try {
						var args = Array.prototype.slice.call(arguments);
						var date = new Date();
						var now = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+":"+date.getMilliseconds();
						
						// prepend a timestamp and optional classname to the original output message
						args[0] =['[', now, ']', className, args[0]].join('');
//						
						logFn.apply(null, args);
				    } catch(error) {
				    	$delegate.error("LogEnhancer ERROR: " + error);
				    }
				};
				
				// Only needed to support angular-mocks expectations
				enhancedLogFn.logs = [];
				
				return enhancedLogFn;
			};
			
			$delegate.getLogger = function (className, colorCSS, customSeparator) {
			    var className = (className !== undefined) ? className + (customSeparator || separator) : "";
				
			    var instance = {
					log: prepareLogFn($delegate.log, className, colorCSS),
					info: prepareLogFn($delegate.info, className, colorCSS),
					warn: prepareLogFn($delegate.warn, className, colorCSS),
					debug: prepareLogFn($delegate.debug, className, colorCSS),
					error: prepareLogFn($delegate.error, className) // NO styling of ERROR messages
			    };
			
//			    if(angular.isDefined(angular.makeTryCatch)) {
//			        instance.tryCatch = angular.makeTryCatch(instance.error, instance);
//			    }
			
			    return instance;
			};
			
		    return $delegate;
		}]);
	}]);
    
})(window, window.angular);
