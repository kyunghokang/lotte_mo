(function(window, angular, undefined) {
    'use strict';

    var filterModule = angular.module('lotteFilter', []);

    filterModule.filter('cutStr', [function(){
        return function(str, len) {
            var reStr = "";
            if(str.len <= len) reStr = str;
            else reStr = str.substring(0, len) + '...';

            return reStr;
        }
    }]);
    
    var i = 0 ;
    
    filterModule.filter('unique', [function(){
        return function(data, propertyName) {
            if (angular.isArray(data) && angular.isString(propertyName)) {
            	var results = [];
            	var keys = {};
            	for (var i = 0; i < data.length; i++) {
            		var val = data[i][propertyName];

            		if (angular.isUndefined(keys[val])) {
            			keys[val] = true;
            			results.push(val);
            		}
            	}
 
            	 return results;
            } else {            	 
            	return data;
            }
        }
    }]);/*main page Top category Filter*/
    
    filterModule.filter('toTrustedHtml', ['$sce', function($sce) {
    	return function(value) {
    		return value ? $sce.trustAsHtml(value) : '';
    	}
    }]);/* trustAsHtml 처리 */

	// 반올림
	filterModule.filter('ceil', function() {
	  return function(input) {
		return Math.ceil(input);
	  };
	});
    
	// HTML  리플레이스처리
	filterModule.filter('replace_html', function() {
	  return function(html) {
            html = html.replace(/\<br(.*?)\>|\<p\>\&nbsp\;\<\/p\>|\<p\>\<br(.*?)\>\&nbsp\;\<\/p\>|null/g, "");//빈값 제거 
            html = html.replace(/\&\#34\;/g, '"').replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>'); //태그 처리             
            return html;
	  };
	});
	
	filterModule.filter('mixedUnicode', [function(){
		return function(str){
			var x = str;
			var r = /\\u([\d\w]{4})/gi;
			x = x.replace(r, function (match, grp) {
				console.log(match,grp);
				return String.fromCharCode(parseInt(grp, 16)); 
			});
			x = unescape(x);
			return x;
		 }
	}]);
	
	// 텍스트 자르기(구분자 / , space)
	filterModule.filter('cutSlash', function() {
	  return function(str, len) {
		  var arr = str.split('/');
		  var result = '';
		  var result_pre = '';
		  for(var i = 0; i<arr.length; i++){
			  result_pre = result;
			  if(i> 0)	result += '/';
			  result += arr[i];
			  if(result.length > len){
				  if(result_pre.length == 0){
					  var arr2 = arr[i].split(' ');
					  var result2 = '';
					  var result_pre2 = '';
					  for(var j = 0; j<arr2.length; j++){
						  result_pre2 = result2;
						  if(j > 0)	result2 += ' ';
						  result2 += arr2[j];
						  if(result2.length > len){
							  return result_pre2;
						  }
					  }
					  return result2;
				  }else{
					  return result_pre;
				  }
			  }
		  }
		  return result;
	  };
	});
	
})(window, window.angular);