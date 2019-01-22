//Release: 23
//BUILD 61
function CrittercismClass(){function K(a){function c(b){return"string"==typeof b?b:b instanceof String?b.toString():null}this.sendHandledException=function(b,a,f){if("undefined"!=typeof _crttr){b=c(b);a=c(a);var d=null;"object"==typeof f&&(d=f.join("\r\n"));_crttr.logHandledException(b,a,d)}};this.sendUnhandledException=function(b,a,f){"undefined"!=typeof _crttr&&(b=c(b),a=c(a),f=null,"object"==typeof stack&&(f=stack.join("\r\n")),_crttr.logUnhandledException(b,a,f))};this.logNetworkRequest=function(b,
a,f,d,h,n,k){"undefined"!=typeof _crttr&&(b=c(b),a=c(a),f=parseInt(f),d=parseInt(d),h=parseInt(h),n=parseInt(n),k=parseInt(k),_crttr.logNetworkRequest(b,a,f,d,h,n,k))};this.leaveBreadcrumb=function(a){"undefined"!=typeof _crttr&&(a=c(a),_crttr.leaveBreadcrumb(a))};this.setMetadata=function(a){"undefined"!=typeof _crttr&&"object"==typeof a&&_crttr.setMetadata(JSON.stringify(a))};this.setUsername=function(a){"undefined"!=typeof _crttr&&(a=c(a),_crttr.setUsername(a))};this.setValue=function(a,e){if("undefined"!=
typeof _crttr){c(a);var d=c(e);_crttr.setMetadata(JSON.stringify({keyStr:d}))}};this.beginTransaction=function(a){"undefined"!=typeof _crttr&&(a=c(a),_crttr.beginTransaction(a))};this.endTransaction=function(a){"undefined"!=typeof _crttr&&(a=c(a),_crttr.endTransaction(a))};this.failTransaction=function(a){"undefined"!=typeof _crttr&&(a=c(a),_crttr.failTransaction(a))};this.setTransactionValue=function(a,e){if("undefined"!=typeof _crttr){var d=parseInt(e),g=c(a);d&&_crttr.setTransactionValue(g,d)}};
this.getTransactionValue=function(a){return"undefined"!=typeof _crttr?(a=c(a),_crttr.getTransactionValue(a)):-1}}function L(a){function c(a){a=JSON.stringify(a);b.src="com.crittercism://eval/"+encodeURIComponent(a)}var b=document.createElement("iframe");b.style.display="none";document.documentElement.appendChild(b);this.sendHandledException=function(a,b,d){d=d.join("\n");c(["logHandledException",a,b,d,2])};this.sendUnhandledException=function(a,b,d){d=d.join("\n");c(["logUnhandledException",a,b,d,
2])};this.logNetworkRequest=function(a,b,d,h,n,k,l){c(["logNetworkRequest",a,b,.001*d,h,n,k,l])};this.leaveBreadcrumb=function(a){c(["leaveBreadcrumb",a])};this.setUsername=function(a){c(["setUsername",a])};this.setValue=function(a,b){c(["setValue",b,a])};this.setMetadata=function(a){};this.beginTransaction=function(a){c(["beginTransaction",a])};this.endTransaction=function(a){c(["endTransaction",a])};this.failTransaction=function(a){c(["failTransaction",a])};this.setTransactionValue=function(a,b){c(["setTransactionValue",
a,b])};this.getTransactionValue=function(a){return-1}}function t(a){function c(){return"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g,function(a){return Math.floor(16*Math.random()).toString(16)})}function b(a){this.isValidAppId=!1;if(a&&null!==a.match(/^[a-f0-9]{24,40}$/gi)){if(24===a.length)a="crittercism.com";else if(40===a.length)switch(a=a.substring(32),a){case "00555300":a="crittercism.com";break;case "00555304":a="crit-ci.com";break;case "00555305":a="crit-staging.com";break;case "00444503":a=
"de.crittercism.com";break;default:return}else return;this.isValidAppId=!0;this.configuredApiUrl="https://api."+a;this.configuredApmUrl="https://apm."+a;this.configuredTxnUrl="https://txn.ingest."+a}else d("Not a valid Crittercism appId == "+a)}function e(){var a=m("breadcrumbs");a||(a="[]");try{this.previous_session=JSON.parse(a)}catch(b){d("Exception occurred while parsing previous session breadcrumb"),d(a),this.previous_session=[]}this.current_session=[];this.leaveBreadcrumb=function(a){if("string"!=
typeof a)throw Error("Invalid breadcrumb type; must be a string");d(a);a=a.substr(0,140);100<=this.current_session.length&&this.current_session.splice(1,1);this.current_session.push([a,u(new Date)]);q("breadcrumbs",JSON.stringify(this.current_session))};this.leaveBreadcrumb("session_start")}function f(){var a=m("network");a||(a="[]");try{this.endpoints=JSON.parse(a)}catch(b){console.log("Crittercism network endpoints from previous session could not be parsed")}this.endpoints.constructor!==Array&&
(this.endpoints=[]);this.logNetworkRequest=function(a,b,c,e,d,f,h){if(!(-1<b.indexOf(y))){var M=u(new Date);100<=this.endpoints.length&&this.endpoints.splice(0,1);this.endpoints.push([a,b,M,c,2,e,d,f,4,h]);q("network",JSON.stringify(this.endpoints));null===D&&(D=window.setTimeout(g,1E4,this))}};this.clearEndpoints=function(){this.endpoints=[];try{localStorage.removeItem(l("network"))}catch(a){}}}function g(a){var b,c;if(0<a.endpoints.length){b=a.endpoints.slice(0);a.clearEndpoints();a=[r,z,E,"2.6",
v];var e=c="UNKNOWN";if("undefined"!=typeof navigator){try{c=navigator.platform}catch(f){}try{e=navigator.userAgent}catch(g){}}var h=u(new Date);d("report_timestamp == "+h);c=[h,"UNKNOWN",c,"html5",e];b={d:[a,c,b]};d("SENDING REPORT TO APM: "+y+"/api/apm/network");d(JSON.stringify(b));k(y+"/api/apm/network",JSON.stringify(b),"application/json;charset=UTF-8")}D=null}function h(a,b){var c=1,e=new Date;this.tryEvent=function(){var d=new Date,f=d-e;e=d;c+=a/b*f;c>a&&(c=a);return 1<=c?(c-=1,!0):!1}}function n(){q("lastSeen",
(new Date).toString())}function k(a,c,b){if(a&&c){var e=!1;if(window.XMLHttpRequest)e=new XMLHttpRequest,e.overrideMimeType&&e.overrideMimeType(b);else if(window.ActiveXObject)try{e=new ActiveXObject("Msxml2.XMLHTTP")}catch(d){try{e=new ActiveXObject("Microsoft.XMLHTTP")}catch(f){}}if(!e)return!1;e.open("POST",a,!0);-1<a.indexOf(w)?e.withCredentials=!0:e.withCredentials=!1;e.setRequestHeader("Content-type",b);e.send(c)}}function l(a){return"com.crittercism.html5/"+r+"/"+a}function m(a){var c=null;
try{c=localStorage.getItem(l(a))}catch(b){}return c}function q(a,c){try{localStorage.setItem(l(a),c)}catch(b){}}function s(){if(t.tryEvent()){var a=JSON.stringify(p);k(w+"/metadata",a,"application/json;charset=UTF-8")}}var E="UNKNOWN",v=0,z=null,A=null,w=null,y=null,B=null,C=null,D=null,t=null,x=null;this.getBreadcrumbs=function(){return B};this.AppLocator=b;this.Breadcrumbs=e;this.Throttle=h;this.sendHandledException=function(a,c,b){x.tryEvent()&&(k(w+"/errors",JSON.stringify({app_id:r,library_version:"2.6",
exceptions:[{library_version:"2.6",exception_name:a,exception_reason:c,breadcrumbs:B,state:{app_version:z},unsymbolized_stacktrace:b}]}),"application/json;charset=UTF-8"),n())};this.sendUnhandledException=function(a,c,b){n()};this.logNetworkRequest=function(a,c,b,e,d,f,g){C.logNetworkRequest(a,c,b,e,d,f,g);n()};this.leaveBreadcrumb=function(a){B.leaveBreadcrumb(a);n()};this.setUsername=function(a){s();n()};this.setValue=function(a,c){s();n()};this.setMetadata=function(a){s();n()};this.beginTransaction=
function(a){n()};this.endTransaction=function(a){n()};this.failTransaction=function(a){n()};this.setTransactionValue=function(a,c){n()};this.getTransactionValue=function(a){n();return-1};(function(a){z=a.appVersion||"unspecified";A=new b(r);if(A.isValidAppId)w=A.configuredApiUrl,y=A.configuredApmUrl;else throw Error("Crittercism is disabled because appId '"+r+"' is invalid");B=new e;t=new h(5,6E4);x=new h(5,6E4);C=new f;var l=m("deviceId");null===l&&(l=c(),q("deviceId",l),l=m("deviceId"),null===l&&
(l="UNKNOWN"));E=l;d("deviceId == "+E);l=m("sessionId");v=l=null===l?0:parseInt(l);l=!0;if(!a.appLoad){a=null;var p=m("lastSeen");p&&(a=new Date(p));a&&(l=18E5<=new Date-a)}l&&(d("sendAppLoad"),v+=1,q("sessionId",v),l=JSON.stringify({app_id:r,library_version:"2.6",app_state:{app_version:z}}),k(w+"/app_loads",l,"application/json;charset=UTF-8"));0<C.endpoints.length&&g(C);n()})(a)}function q(a){a=a||{guess:!0};var c=a.e||null;a=!!a.guess;var b=new q.implementation,c=b.run(c);return a?b.guessAnonymousFunctions(c):
c}function x(a){for(var c=[],b=[/^crittercismErrorHandler/i,/^printStackTrace/i],e=0,d=a.length;e<d;e++){for(var g=a[e],h=!1,n=0,k=b.length;n<k;n++)if(g.match(b[n])){h=!0;break}h||c.push(g)}return c}function d(a){F&&window.console.log("[Crittercism] "+a)}function u(a){function c(a){return 10>a?"0"+a:a}return a.getUTCFullYear()+"-"+c(a.getUTCMonth()+1)+"-"+c(a.getUTCDate())+"T"+c(a.getUTCHours())+":"+c(a.getUTCMinutes())+":"+c(a.getUTCSeconds())+"."+(a.getUTCMilliseconds()/1E3).toFixed(3).slice(2,
5)+"Z"}function G(){function a(){for(var a,c=[function(){return window.XMLHttpRequest},function(){return window.ActiveXObject("Msxml2.XMLHTTP")},function(){return window.ActiveXObject("Msxml3.XMLHTTP")},function(){return window.ActiveXObject("Microsoft.XMLHTTP")}],d=0;d<c.length;d++)try{return a=c[d](),new a,a}catch(g){}console.log("Unknown XMLHttpRequest, Crittercism service monitoring will be disabled");return null}function c(a){var e=0;try{a&&("string"==typeof a?e=a.length:a.byteLength?e=a.byteLength:
a.size?e=a.size:window.jQuery||(e=c(a.toString())))}catch(d){}return e}d("APM");(function(){var b=a();b?"undefined"==typeof b.prototype._cr_wrapped&&(b.prototype._cr_wrapped=!0,b.prototype._cr_saved_open=b.prototype.open,b.prototype.open=function(){this._cr_stats||(this._cr_stats={method:"",url:"",latency:0,bytesRead:0,bytesSent:0,responseCode:0,errorCode:0});this._cr_saved_open.apply(this,arguments);if(arguments[0]&&arguments[1]){this._cr_stats.method=arguments[0];var a=document.createElement("a");
a.href=arguments[1];this._cr_stats.url=a.href}},b.prototype._cr_saved_send=b.prototype.send,b.prototype.send=function(a){this._cr_stats||(this._cr_stats={method:"",url:"",latency:0,bytesRead:0,bytesSent:0,responseCode:0,errorCode:0});this._cr_stats._currentTime=(new Date).getTime();this._cr_logLatency=function(){this._cr_stats&&this._cr_stats._currentTime&&(this._cr_stats.latency=(new Date).getTime()-this._cr_stats._currentTime)};this._cr_logResponse=function(){this._cr_stats&&(this._cr_stats.responseCode=
this.status,this._cr_stats.bytesRead=c(this.response),this._cr_stats.time_stamp=u(new Date),this._cr_logLatency())};this._cr_saved_onabort=this.onabort;this.onabort=function(){this._cr_errorCode=602;this._cr_saved_onabort&&this._cr_saved_onabort.apply(this,arguments)};this._cr_saved_onerror=this.onerror;this.onerror=function(a){this._cr_errorCode=601;this._cr_saved_onerror&&this._cr_saved_onerror.apply(this,arguments)};this._cr_saved_onloadend=this.onloadend;this.onloadend=function(){this._cr_logResponse();
this._cr_errorCode&&(this._cr_stats.errorCode=this._cr_errorCode);this._cr_logLatency();this._cr_stats&&this._cr_stats.url&&Crittercism.logNetworkRequest(this._cr_stats.method,this._cr_stats.url,this._cr_stats.latency,this._cr_stats.bytesRead,this._cr_stats.bytesSent,this._cr_stats.responseCode,this._cr_stats.errorCode);this._cr_saved_onloadend&&this._cr_saved_onloadend.apply(this,arguments)};this._cr_saved_onprogress=this.onprogress;this.onprogress=function(){this._cr_logLatency();this._cr_saved_onprogress&&
this._cr_saved_onprogress.apply(this,arguments)};this._cr_saved_ontimeout=this.ontimeout;this.ontimeout=function(){this._cr_errorCode=603;this._cr_saved_ontimeout&&this._cr_saved_ontimeout.apply(this,arguments)};this._cr_saved_onreadystatechange=this.onreadystatechange;this.onreadystatechange=function(){2!=this.readyState&&3!=this.readyState||this._cr_logLatency();4==this.readyState&&this._cr_logResponse();this._cr_saved_onreadystatechange&&this._cr_saved_onreadystatechange.apply(this,arguments)};
this._cr_stats.bytesSent=c(a);this._cr_saved_send.apply(this,arguments)}):d("Warning: XMLHttpRequest missing. Crittercism service monitoring will not be installed.")})()}function H(a){this.app_id=a;this.metadata={};this.setMetadata=function(a){var b,e=!1;if("object"!=typeof a)return d("Crittercism setMetadata given a parameter that is not an object: "+a),!1;this.metadata.username&&!a.username&&(a.username=this.metadata.username);for(b in this.metadata)a.hasOwnProperty(b)||(delete this.metadata[b],
e=!0);for(b in a)a.hasOwnProperty(b)&&this.setValue(b,a[b])&&(e=!0);return e};this.setValue=function(a,b){if("string"!=typeof a)return d("Crittercism setValue given a key that is not a string: "+a),!1;if("string"!=typeof b&&"number"!=typeof b)return d("Crittercism setValue given a value that is not a string or a number: "+b),!1;var e=this.metadata[a]!==b;this.metadata[a]=b;return e};this.getValue=function(a){return"string"!=typeof a?(d("Crittercism getValue given a key that is not a string: "+a),
null):this.metadata[a]};this.setUsername=function(a){return"string"!=typeof a?(d("Crittercism setUsername given a name that is not a string: "+a),!1):this.setValue("username",a)};this.getUsername=function(){return this.getValue("username")}}function I(a,c,b){d("sendHandledException");if(m)for(var e in k)k[e].sendHandledException(a,c,b);else d("Crittercism isn't initialized yet.  Can't sendHandledException.")}var r=null,m=!1,F=!0,p,k={};this.getObserver=function(a){return k[a]};this.getObservers=function(){return k};
this.Html5Observer=t;q.implementation=function(){};q.implementation.prototype={run:function(a,c){a=a||this.createException();c=c||this.mode(a);return"other"===c?this.other(arguments.callee):this[c](a)},createException:function(){try{this.undef()}catch(a){return a}},mode:function(a){return a.arguments&&a.stack?"chrome":"string"===typeof a.message&&"undefined"!==typeof window&&window.opera?!a.stacktrace||-1<a.message.indexOf("\n")&&a.message.split("\n").length>a.stacktrace.split("\n").length?"opera9":
a.stack?0>a.stacktrace.indexOf("called from line")?"opera10b":"opera11":"opera10a":a.stack?"firefox":"other"},instrumentFunction:function(a,c,b){a=a||window;var e=a[c];a[c]=function(){b.call(this,q().slice(4));return a[c]._instrumented.apply(this,arguments)};a[c]._instrumented=e},deinstrumentFunction:function(a,c){a[c].constructor===Function&&a[c]._instrumented&&a[c]._instrumented.constructor===Function&&(a[c]=a[c]._instrumented)},chrome:function(a){a=(a.stack+"\n").replace(/^\S[^\(]+?[\n$]/gm,"").replace(/^\s+(at eval )?at\s+/gm,
"").replace(/^([^\(]+?)([\n$])/gm,"{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,"{anonymous}()@$1").split("\n");a.pop();return a},firefox:function(a){return a.stack.replace(/(?:\n@:0)?\s+$/m,"").replace(/^\(/gm,"{anonymous}(").split("\n")},opera11:function(a){var c=/^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;a=a.stacktrace.split("\n");for(var b=[],e=0,d=a.length;e<d;e+=2){var g=c.exec(a[e]);if(g){var h=g[4]+":"+g[1]+":"+g[2],g=g[3]||"global code",g=g.replace(/<anonymous function: (\S+)>/,
"$1").replace(/<anonymous function>/,"{anonymous}");b.push(g+"@"+h+" -- "+a[e+1].replace(/^\s+/,""))}}return b},opera10b:function(a){var c=/^(.*)@(.+):(\d+)$/;a=a.stacktrace.split("\n");for(var b=[],d=0,f=a.length;d<f;d++){var g=c.exec(a[d]);g&&b.push((g[1]?g[1]+"()":"global code")+"@"+g[2]+":"+g[3])}return b},opera10a:function(a){var c=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;a=a.stacktrace.split("\n");for(var b=[],d=0,f=a.length;d<f;d+=2){var g=c.exec(a[d]);g&&b.push((g[3]||
"{anonymous}")+"()@"+g[2]+":"+g[1]+" -- "+a[d+1].replace(/^\s+/,""))}return b},opera9:function(a){var c=/Line (\d+).*script (?:in )?(\S+)/i;a=a.message.split("\n");for(var b=[],d=2,f=a.length;d<f;d+=2){var g=c.exec(a[d]);g&&b.push("{anonymous}()@"+g[2]+":"+g[1]+" -- "+a[d+1].replace(/^\s+/,""))}return b},other:function(a){for(var c=/function\s*([\w\-$]+)?\s*\(/i,b=[],d,f;a&&a.arguments&&10>b.length;)d=c.test(a.toString())?RegExp.$1||"{anonymous}":"{anonymous}",f=Array.prototype.slice.call(a.arguments||
[]),b[b.length]=d+"("+this.stringifyArguments(f)+")",a=a.caller;return b},stringifyArguments:function(a){for(var c=[],b=Array.prototype.slice,d=0;d<a.length;++d){var f=a[d];void 0===f?c[d]="undefined":null===f?c[d]="null":f.constructor&&(f.constructor===Array?c[d]=3>f.length?"["+this.stringifyArguments(f)+"]":"["+this.stringifyArguments(b.call(f,0,1))+"..."+this.stringifyArguments(b.call(f,-1))+"]":f.constructor===Object?c[d]="#object":f.constructor===Function?c[d]="#function":f.constructor===String?
c[d]='"'+f+'"':f.constructor===Number&&(c[d]=f))}return c.join(",")},sourceCache:{},ajax:function(a){var c=this.createXMLHTTPObject();if(c)try{return c.open("GET",a,!1),c.send(null),c.responseText}catch(b){}return""},createXMLHTTPObject:function(){for(var a,c=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}],b=0;b<c.length;b++)try{return a=c[b](),
this.createXMLHTTPObject=c[b],a}catch(d){}},isSameDomain:function(a){return"undefined"!==typeof location&&-1!==a.indexOf(location.hostname)},getSource:function(a){a in this.sourceCache||(this.sourceCache[a]=this.ajax(a).split("\n"));return this.sourceCache[a]},guessAnonymousFunctions:function(a){for(var c=0;c<a.length;++c){var b=/^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,d=a[c],f=/\{anonymous\}\(.*\)@(.*)/.exec(d);if(f){var g=b.exec(f[1]);g&&(b=g[1],f=g[2],g=g[3]||0,b&&this.isSameDomain(b)&&f&&(b=
this.guessAnonymousFunction(b,f,g),a[c]=d.replace("{anonymous}",b)))}}return a},guessAnonymousFunction:function(a,c,b){var d;try{d=this.findFunctionName(this.getSource(a),c)}catch(f){d="getSource failed with url: "+a+", exception: "+f.toString()}return d},findFunctionName:function(a,c){for(var b=/function\s+([^(]*?)\s*\(([^)]*)\)/,d=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/,f=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/,g="",h,k=Math.min(c,20),m,l=0;l<k;++l)if(h=a[c-l-1],m=h.indexOf("//"),
0<=m&&(h=h.substr(0,m)),h)if(g=h+g,(h=d.exec(g))&&h[1]||(h=b.exec(g))&&h[1]||(h=f.exec(g))&&h[1])return h[1];return"(?)"}};this.printDebug=d;this.dateToISOString=u;this.APM=G;this.Metadata=H;this.registerObserver=function(a){"undefined"==typeof a&&(a={});var c=a.appId;if("undefined"!=typeof c)a.platform="html5",k[c]=new t(a);else{c=a.platform;if("undefined"==typeof c){var b="UNKNOWN";if("undefined"!=typeof navigator)try{b=navigator.userAgent.toLowerCase()}catch(d){}if(0<=b.indexOf("android"))c="android";
else if(0<=b.indexOf("ipad")||0<=b.indexOf("iphone")||0<=b.indexOf("ipod"))c="ios"}"android"==c?k[c]=new K(a):"ios"==c&&(k[c]=new L(a))}};if("undefined"!=typeof Crittercism){var J="1.0";try{J=Crittercism.getVersion()}catch(N){}2.6>parseFloat(J)&&(Crittercism=this)}var s=!1;this.init=function(a){try{if(d("init"),!s){s=!0;if(!m){"undefined"!=typeof a.debug&&(F=a.debug);d("LIB_VERSION == "+Crittercism.getVersion());m=!0;var c=window.onerror;window.onerror=function(a,b,d,h,k){try{var m="Crash";if("string"===
typeof b){var l=document.createElement("a");l.href=b;m=l.protocol+"//"+l.host+"/"+l.pathname}var p=x(q({e:k||a,guess:!0}));I(m,a,p)}catch(r){}c&&c(a,b,d,h,k)};r=a.appId;d("Crittercism appId == "+r);new G;p=new H(r)}Crittercism.registerObserver(a);s=!1}}catch(b){d(""+b),d("Crittercism init CRASHED!!!")}};this.getVersion=function(){return"2.6"};this.getUsername=function(){var a=null;try{d("getUsername"),m?a=p.getUsername():d("Crittercism isn't initialized yet.  Can't getUsername.")}catch(c){d(c)}return a};
this.setUsername=function(a){try{if(d("setUsername"),m){if(p.setUsername(a))for(var c in k)k[c].setUsername(a)}else d("Crittercism isn't initialized yet.  Can't setUsername.")}catch(b){d(b)}};this.getValue=function(a){var c=null;try{d("getValue"),m?c=p.getValue(a):d("Crittercism isn't initialized yet.  Can't getValue.")}catch(b){d(b)}return c};this.setValue=function(a,c){try{if(d("setValue"),m){if(p.setValue(a,c))for(var b in k)k[b].setValue(a,c)}else d("Crittercism isn't initialized yet.  Can't setValue.")}catch(e){d(e)}};
this.setMetadata=function(a){try{if(d("setMetadata"),m){if(p.setMetadata(a))for(var c in k)k[c].setMetadata(a)}else d("Crittercism isn't initialized yet.  Can't setMetadata.")}catch(b){d(b)}};this.leaveBreadcrumb=function(a){try{if(d("leaveBreadcrumb"),m)for(var c in k)k[c].leaveBreadcrumb(a);else d("Crittercism isn't initialized yet.  Can't leaveBreadcrumb.")}catch(b){d(b)}};this.logNetworkRequest=function(a,c,b,e,f,g,h){try{if(d("logNetworkRequest"),d(c),m)if("string"!=typeof a)d("error: method == "+
a+"should be a string");else if("string"!=typeof c)d("error: url == "+c+"should be a string");else{0>"GET HEAD POST PUT DELETE TRACE OPTIONS CONNECT PATCH".split(" ").indexOf(a.toUpperCase())&&d("warning: method == "+a+"should be an HTTP verb ('GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'OPTIONS', 'CONNECT', 'PATCH')");"number"!=typeof b?(d("warning: latency == "+b+"should be a number"),b=0):0>b&&d("warning: latency == "+b+"should be >= 0");"number"!=typeof e?(d("warning: bytesRead == "+e+"should be a number"),
e=0):0>e&&d("warning: bytesRead == "+e+"should be >= 0");"number"!=typeof f?(d("warning: bytesSent == "+f+"should be a number"),f=0):0>f&&d("warning: bytesSent == "+f+"should be >= 0");"number"!=typeof g?(d("warning: responseCode == "+g+"should be a number"),g=0):0===h&&(100>g||599<=g)&&d("warning: responseCode == "+g+"should be inside 100-599 for errorCode == 0");h?"number"!=typeof h?(d("warning: errorCode == "+h+"should be a number"),h=0):0!==h&&0!==g&&d("warning: errorCode == "+h+"should be 0 for errorCode != 0"):
h=0;for(var n in k)k[n].logNetworkRequest(a,c,b,e,f,g,h)}else d("Crittercism isn't initialized yet.  Can't logNetworkRequest.")}catch(p){d(p)}};this.logHandledException=function(a){try{if(d("logHandledException"),m){var c=null;if(a&&"string"==typeof a.name)c=a.name;else{var b="null";if(a){var b=a.constructor.toString(),e=b.indexOf(" "),b=b.substring(e+1),f=b.search(/\W/),b=b.substring(0,f);try{"undefined"!=typeof navigator&&0<navigator.userAgent.search("Safari")&&endsWith(b,"Constructor")&&(b=b.substring(0,
b.length-11))}catch(g){}}c=b}b=null;if(a&&"string"==typeof a.message)b=a.message;else if("object"==typeof a){var h,e="{",k;for(k in a)e=e+k+":"+a[k]+"\n";k=h=e+"}";800<h.length&&(k=h.substring(0,800)+"...");b=k}else b=""+a;var p=x(q({e:a,guess:!0}));d(c);d(b);d(p);I(c,b,p)}else d("Crittercism isn't initialized yet.  Can't logHandledException.")}catch(l){d(l)}return this};this.beginTransaction=function(a){try{if(d("beginTransaction"),m)for(var c in k)k[c].beginTransaction(a);else d("Crittercism isn't initialized yet.  Can't beginTransaction.")}catch(b){d(b)}};
this.endTransaction=function(a){try{if(d("endTransaction"),m)for(var c in k)k[c].endTransaction(a);else d("Crittercism isn't initialized yet.  Can't endTransaction.")}catch(b){d(b)}};this.failTransaction=function(a){try{if(d("failTransaction"),m)for(var c in k)k[c].failTransaction(a);else d("Crittercism isn't initialized yet.  Can't failTransaction.")}catch(b){d(b)}};this.setTransactionValue=function(a,c){try{if(d("setTransactionValue"),m)for(var b in k)k[b].setTransactionValue(a,c);else d("Crittercism isn't initialized yet.  Can't setTransactionValue.")}catch(e){d(e)}}}
try{newCrittercism=new CrittercismClass,"undefined"==typeof Crittercism&&(Crittercism=newCrittercism,"undefined"!=typeof module&&(module.exports=Crittercism))}catch(e$$48){console.log("[Crittercism] error: "+e$$48),console.log("[Crittercism] error: Unexpected error while loading library.")};