// Minified
javascript:(function(){var head=document.getElementsByTagName("head")[0],scr=document.createElement("script");scr.type="text/javascript",scr.src="//code.jquery.com/jquery-1.12.0.min.js",head.appendChild(scr),setTimeout(function(){$("html>frameset>frameset").prop("cols","*,2000,*"),$("html>frameset>frameset:eq(1)>frameset").prop("cols","400,*"),$("frame#body").unbind("load").bind("load",function(){var e,t,d,n,r,p;$("table[width=798]",top.frames.body.document).css("width","100%"),$("td.bbs_text[width=480]",top.frames.body.document).each(function(o,c){e=$(c),t=e.prev(),d=e.parent(),n=d.parent(),(r=e.text()).indexOf(".192.62:")>0?(t.append(" <b style='color:red'>STG</b>"),n.prepend(d)):r.indexOf("192.86:")>0?t.append(" <b style='color:red'>STG2</b>"):r.indexOf("193.34:")>0?t.append(" <b style='color:red'>MT</b>"):r.indexOf(".192.71:")>0?(t.append(" <b style='color:red'>STG</b>"),n.prepend(d)):r.indexOf(".192.95:")>0?t.append(" <b style='color:red'>STG2</b>"):r.indexOf(".193.44:")>0?t.append(" <b style='color:red'>MT</b>"):r.indexOf("193.39:")>0&&(t.append(" <b style='color:red'>MT2</b>"),n.append(d)),t.find("input[type=checkbox]").unbind("change").bind("change",function(e){p=$(e.currentTarget),e.ctrlKey&&(p.parents("tr").siblings().find("input[type=checkbox]").prop("checked",!1),p.prop("checked",!0))})}),0!=$("select[name=upload_type]",top.frames.body.document).prop("selectedIndex")&&$("select[name=upload_type]",top.frames.body.document).prop("selectedIndex",0).trigger("change")})},1e3);})();



// 원본 소스
javascript:(function(){

var head=document.getElementsByTagName("head")[0];
var scr=document.createElement("script");
scr.type="text/javascript";
scr.src="//code.jquery.com/jquery-1.12.0.min.js";
head.appendChild(scr);
setTimeout(function(){
	$("html>frameset>frameset").prop("cols","*,2000,*");
	$("html>frameset>frameset:eq(1)>frameset").prop("cols","400,*");
	$("frame#body").unbind("load").bind("load",function(){
		$("table[width=798]",top.frames["body"].document).css("width","100%");
		var td,pr,tr,tb,ip, ck, me;
		$("td.bbs_text[width=480]",top.frames["body"].document).each(function(idx,itm){
			td=$(itm);
			pr=td.prev();
			tr=td.parent();
			tb=tr.parent();
			ip=td.text();
			if(ip.indexOf(".192.62:")>0){
				pr.append(" <b style='color:red'>STG</b>");
				tb.prepend(tr);
			}else if(ip.indexOf("192.86:")>0){
				pr.append(" <b style='color:red'>STG2</b>");
			}else if(ip.indexOf("193.34:")>0){
				pr.append(" <b style='color:red'>MT</b>");
			}else if(ip.indexOf(".192.71:")>0){
				pr.append(" <b style='color:red'>STG</b>");
				tb.prepend(tr);
			}else if(ip.indexOf(".192.95:")>0){
				pr.append(" <b style='color:red'>STG2</b>");
			}else if(ip.indexOf(".193.44:")>0){
				pr.append(" <b style='color:red'>MT</b>");
			}else if(ip.indexOf("193.39:")>0){
				pr.append(" <b style='color:red'>MT2</b>");
				tb.append(tr);
			}
			ck = pr.find("input[type=checkbox]");
			ck.unbind("change").bind("change", function(e){
				me = $(e.currentTarget);
				if(e.ctrlKey){
					me.parents("tr").siblings().find("input[type=checkbox]").prop("checked", false);
					me.prop("checked", true);
				}
			});
		});
		if($("select[name=upload_type]",top.frames["body"].document).prop("selectedIndex")!=0){
			$("select[name=upload_type]",top.frames["body"].document).prop("selectedIndex", 0).trigger("change");
		}
	});
},1000);

})();