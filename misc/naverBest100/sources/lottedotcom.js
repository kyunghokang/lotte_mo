var LDCB_DIV, LDCB_BTN;
var LDCB_LIST = [];
var LDCB_PROD = {};
var LDCB_CNT = {
	dc : {list:[], cnt:0},
	lt10 : {list:[], cnt:0},
	gt10 : {list:[], cnt:0},
	gt30 : {list:[], cnt:0},
	nodc : {list:[], cnt:0}
};

/**
 * 닷컴 최저가 검색 시작하기 
 */
function LDCB_StartOver(){
	var tag = '';
	tag += '<div id="LotteDotComBest100">';
	tag += '<a class="ldcb_logo"></a>';
	tag += '<span class="ldcb_btn"></span>';
	tag += '<div class="ldcb_table">';
	tag += '<table class="dc"><thead><tr>';
	tag += '<th>순위</th><th>상품명</th><th>원부ID</th><th>닷컴 상품코드</th><th>최저 상품가</th><th>판매처</th>';
	tag += '</tr></thead><tbody><tr><td colspan="6">No Data</td></tr></tbody></table>';
	tag += '<table class="lt10"><thead><tr>';
	tag += '<th>순위</th><th>상품명</th><th>원부ID</th><th>닷컴 상품코드</th><th>닷컴 상품가</th><th>최저 상품가</th><th>가격차이(%)</th><th>판매처</th>';
	tag += '</tr></thead><tbody><tr><td colspan="8">No Data</td></tr></tbody></table>';
	tag += '<table class="gt10"><thead><tr>';
	tag += '<th>순위</th><th>상품명</th><th>원부ID</th><th>닷컴 상품코드</th><th>닷컴 상품가</th><th>최저 상품가</th><th>가격차이(%)</th><th>판매처</th>';
	tag += '</tr></thead><tbody><tr><td colspan="8">No Data</td></tr></tbody></table>';
	tag += '<table class="gt30"><thead><tr>';
	tag += '<th>순위</th><th>상품명</th><th>원부ID</th><th>닷컴 상품코드</th><th>닷컴 상품가</th><th>최저 상품가</th><th>가격차이(%)</th><th>판매처</th>';
	tag += '</tr></thead><tbody><tr><td colspan="8">No Data</td></tr></tbody></table>';
	tag += '<table class="nodc"><thead><tr>';
	tag += '<th>순위</th><th>상품명</th><th>원부ID</th><th>최저 상품가</th><th>검색결과</th>';
	tag += '</tr></thead><tbody><tr><td colspan="4">No Data</td></tr></tbody></table>';
	tag += '</div></div>';
	
	LDCB_DIV = $(tag);
	LDCB_BTN = LDCB_DIV.find(".ldcb_btn");
	$('body').append(LDCB_DIV);
	
	LDCB_DIV.find(".ldcb_logo").unbind("click").bind("click", LDCB_LoadData);
};

/**
 * 최저가 API 호출하기
 */
function LDCB_LoadData(){
	LDCB_LIST = [];
	LDCB_PROD = {};
	
	var li, img, src;
	
	/*$("._itemSection").each(function(idx, itm){
		console.log($(itm).data("nvMid"))
	});*/
	
	var arr = [];
	var prod_list = $("._itemSection");
	prod_list.each(function(idx, itm){
		li = $(itm);
		src = li.data("nvMid");
		//li.data("mid", src);
		LDCB_LIST.push({
			code	: src,
			li		: li
		});
		li.addClass("ldcb_list_item");
		if(li.find(".ldcb_li_box").length == 0){
			li.append('<div class="ldcb_li_box"><div class="ldcb_li_prc"></div></div>');
		}
		arr.push(src);
	});
	/*var prod_list = $("ul[id=productList_ul] > li");
	prod_list.each(function(idx, itm){
		li = $(itm);
		img = li.find(".thumb_area img");
		src = img.data("original");
		src = src.substr(src.lastIndexOf("/")+1);
		src = src.substr(0, src.indexOf("."));
		li.data("mid", src);
		LDCB_LIST.push({
			code	: src,
			li		: li
		});
		li.addClass("ldcb_list_item");
		if(li.find(".ldcb_li_box").length == 0){
			li.append('<div class="ldcb_li_box"><div class="ldcb_li_prc"></div></div>');
		}
		arr.push(src);
	});*/
	
	var param = {
		authkey	: "s_453e50e7e481",
		nvMids	: arr.join(",")
	};
	var obj = {
		data		: param,
		dataType	: "text",
		method		: "GET",
		url			: "http://api.shopping.naver.com/api/lowestPrice/model",
		success		: LDCB_success,
		error		: LDCB_error
	};
	//$.ajax(obj);
};

/**
 * 최저가 API 호출 성공 콜백
 * @param {Object} data
 * @param {Object} status
 * @param {Object} xhr
 */
function LDCB_success(data, status, xhr){
	LDCB_PROD = {};
	var xml = $.parseXML(data);
	var doc = $(xml);
	var p, mid, list, pp;
	doc.find("modelProduct").each(function(idx, itm){
		p = $(itm);
		mid = p.find("matchNvMid").text();
		p.find("lowestProductList product").each(function(pidx, pitm){
			pp = $(pitm);
			if(pp.find("mallId").text() == "lotte"){
				LDCB_PROD[mid] = {
					mid		: p.find("matchNvMid").text(),
					pname	: p.find("productName").text(),
					cate	: p.find("cateCode").text(),
					cname	: p.find("cateName").text(),
					price	: p.find("lowestPrice").text(),
					count	: p.find("productCount").text(),
					attr	: p.find("useAttr").text(),
					dc		: {
						mid		: pp.find("nvMid").text,
						pid		: pp.find("mallPid").text(),
						price	: pp.find("price").text()
					}
				};
				return false;
			}
		});
	});
	
	LDCB_UpdateList();
	LDCB_AddButton();
	LDCB_FillTable();
};

/**
 * 최저가 API 호출 실패 콜백
 * @param {Object} xhr
 * @param {Object} status
 * @param {Object} e
 */
function LDCB_error(xhr, status, e){
	alert("Data load error.");
};

/**
 * 상품 리스트 UI 추가하기
 */
function LDCB_UpdateList(){
	LDCB_CNT = {
		dc : {list:[], cnt:0},
		lt10 : {list:[], cnt:0},
		gt10 : {list:[], cnt:0},
		gt30 : {list:[], cnt:0},
		nodc : {list:[], cnt:0}
	}
	
	var itm, cd, li, prd, lp, dp, dif, pct, str;
	var len = LDCB_LIST.length;
	for(var i=0; i<len; i++){
		itm = LDCB_LIST[i];
		cd = itm.code;
		li = itm.li;
		prd = LDCB_PROD[cd];
		if(prd == undefined){
			// 닷컴 없음
			li.addClass("nodc");
			LDCB_CNT.nodc.cnt++;
			LDCB_CNT.nodc.list.push(li);
		}else{
			// 닷컴 상품
			dp = prd.dc.price;
			lp = prd.price;
			dif = dp - lp;
			pct = Math.round(dif / dp * 100);
			if(dif <= 0){
				// 최저가
				li.addClass("dc");
				LDCB_CNT.dc.cnt++;
				LDCB_CNT.dc.list.push(prd);
			}else if(pct <= 10){
				// 10% 이하
				li.addClass("lt10");
				LDCB_CNT.lt10.cnt++;
				LDCB_CNT.lt10.list.push(prd);
			}else if(pct <= 30){
				// 10% 초과
				li.addClass("gt10");
				LDCB_CNT.gt10.cnt++;
				LDCB_CNT.gt10.list.push(prd);
			}else{
				// 30% 초과
				li.addClass("gt30");
				LDCB_CNT.gt30.cnt++;
				LDCB_CNT.gt30.list.push(prd);
			}
			
			str = '';
			str += '<div><span>닷컴</span><span>' + convertCurrency(dp) + '</span></div>';
			str += '<div><span>최저가</span><span>' + convertCurrency(lp) + '</span></div>';
			str += '<div class="sum"><span>' + pct + '%</span><span>' + convertCurrency(dp - lp) + '</span></div>';
			li.find(".ldcb_li_prc").html(str);
			prd.li = li;
			prd.pct = pct;
		}
	}
};

/**
 * 통화 형식 만들기
 * @param {Number} 가격
 */
function convertCurrency(n){
	n = "" + n;
	if( /\d{3}\d+/.test(n) ){
		return convertCurrency(n.replace(/(\d{3}?)(,|$)/, ',$&'));
	}
	return n;
}

/**
 * 화면 상단 최저가 버튼 추가하기
 */
function LDCB_AddButton(){
	var tag = '';
	tag += '<a class="dc">닷컴 최저가 : ' + LDCB_CNT.dc.cnt + '</a>';
	tag += '<a class="lt10">가격차이 10% 이내 : ' + LDCB_CNT.lt10.cnt + '</a>';
	tag += '<a class="gt10">가격차이 10% 초과 : ' + LDCB_CNT.gt10.cnt + '</a>';
	tag += '<a class="gt30">가격차이 30% 초과 : ' + LDCB_CNT.gt30.cnt + '</a>';
	tag += '<a class="nodc">닷컴 미보유상품 : ' + LDCB_CNT.nodc.cnt + '</a>';
	
	var btn = $(tag);
	btn.bind("click", DLCB_BtnClick);
	
	LDCB_BTN.html(btn);
};

/**
 * 최저가 버튼 클릭 이벤트
 */
function DLCB_BtnClick(e){
	var a = $(e.currentTarget);
	var cls = a.attr("class");
	
	var body = $("body");
	if(body.hasClass(cls)){
		body.removeClass(cls);
	}else{
		body.removeClass("dc lt10 gt10 gt30 nodc").addClass(cls);
	}
};

/**
 * 화면 상단 최저가 목록 테이블 채우기
 */
function LDCB_FillTable(){
	var key, tb, list, k, klen, str, prd, li, tit, txt, arr;
	var arr = ["dc", "lt10", "gt10", "gt30"];
	var len = arr.length;
	for(var i=0; i<len; i++){
		key = arr[i];
		tb = LDCB_DIV.find("table." + key + " tbody");
		list = LDCB_CNT[key].list;
		klen = list.length;
		str = '';
		for(k=0; k<klen; k++){
			prd = list[k];
			li = prd.li;
			str += '<tr>';
			str += '<td>' + (li.index() + 1) + '</td>';
			str += '<td class="nm">' + prd.pname + '</td>';
			str += '<td>' + prd.mid + '</td>';
			str += '<td>' + prd.dc.pid + '</td>';
			if(key != "dc"){
				str += '<td class="r">' + convertCurrency(prd.dc.price) + '</td>';
				str += '<td class="r">' + convertCurrency(prd.price) + '</td>';
				str += '<td class="r">' + prd.pct + '%</td>';
			}else{
				str += '<td class="r">' + convertCurrency(prd.price) + '</td>';
			}
			str += '<td class="r">' + prd.count + '</td>';
			str += '</tr>';
		}
		if(str != ""){
			tb.html(str);
		}
	}
	
	str = '';
	len = LDCB_CNT.nodc.list.length;
	for(i=0; i<len; i++){
		li = LDCB_CNT.nodc.list[i];
		txt = li.find(".cont a").text();
		tit = li.find(".cont a").attr("title");
		arr = tit.split(" ");
		if(arr.length > 3){
			arr.length = 3;
		}
		tit = arr.join(" ");
		str += '<tr>';
		str += '<td>' + (li.index() + 1) + '</td>';
		str += '<td class="nm">' + txt + '</td>';
		//str += '<td>' + li.data("mid") + '</td>';
		str += '<td>' + li.data("nvMid") + '</td>';
		str += '<td class="r">' + li.find(".price strong span").text() + '</td>';
		str += '<td><a href="http://www.lotte.com/search/searchMain.lotte?init=Y&query=' + tit + '" target="_blank">닷컴 검색결과 보기&nbsp;&gt;</a></td>';
		str += '</tr>';
	}
	$(".ldcb_table table.nodc tbody").html(str);
};


LDCB_StartOver();