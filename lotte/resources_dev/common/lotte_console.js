(function(window, angular, undefined) {
	'use strict';

	var utilModule = angular.module('lotteUtil');
	
	/**
	 * @ngdoc service
	 * @name lotteUtil.service:LotteConsole
	 * @description
	 * 스타일 추가된 console.log
	 */
	utilModule.service('LotteConsole', [function () {
		
		var self = this;
		var isReal = location.hostname == "m.lotte.com" ? true : false;
		
		this.log = function(){
			if(isReal)	return;
			console.log.apply(console, arguments);
		};
		this.warn = function(){
			if(isReal)	return;
			console.warn.apply(console, arguments);
		};
		this.error = function(){
			if(isReal)	return;
			console.error.apply(console, arguments);
		};
		this.info = function(){
			if(isReal)	return;
			console.info.apply(console, arguments);
		};
		this.traceObj = function(obj, title, bg, color){
			if(isReal)	return;
			var titleColor = color || "#fff";
			var bgColor = bg || "#444";
			var style = "color:" + titleColor + "; background-color:" + bgColor + "; padding: 1px 5px; border-radius: 5px;";
		    console.group.call(console, "%c---" + title + "-------------------------------------------------------", style);
		    console.log(obj);
		    if (console.groupEnd) console.groupEnd();
		};
	}]);
})(window, window.angular);