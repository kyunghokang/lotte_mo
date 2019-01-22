// smp.common.sendpick.js - Smartpick Mobile SNS Share script
/* 
 	작성자: 이승용(sylee58@lotte.com)
 	작성일: 2014/07/10
*/
if (typeof com == 'undefined') var com = {};
if (typeof com.lotte == 'undefined') com.lotte = {}; 
if (typeof com.lotte.smp == 'undefined') com.lotte.smp = {};
com.lotte.smp.sendpick = function(isApp, oBt, oNo, oSn, eEntr, oType, sDiv, isMms) {
	this.isApp		= (typeof isApp == 'boolean') ? isApp : false;
	this.oButten	= (oBt == undefined || oBt == null) ? '' : String(oBt);
	this.orderNo	= (oNo == undefined || oNo == null) ? '' : String(oNo);
	this.orderSn	= (oSn == undefined || oSn == null) ? '' : String(oSn);
	this.expEntr	= (typeof eEntr == 'object' && eEntr instanceof Array) ? eEntr.join(',') : '';
	this.objType	= (typeof eEntr == 'object') ? oType : null;
	this.siteDiv	= (sDiv == undefined || sDiv == null) ? '' : String(sDiv);
	this.onlyMmsTf  = (typeof isMms == 'boolean') ? isMms : false;
		
	if (typeof $(this.oButten) != 'object' || typeof $(this.oButten)[0] != 'object') {
		return false;
	}
	if (typeof this.objType != 'object' || this.objType == null) {
		return false;
	}
}
com.lotte.smp.sendpick.prototype = {	
	setKakaoLink : function(data) {
		if (typeof data != 'object' || this.isEmpty(String(data.ecpn_no))) {
			alert("교환권 정보가 존재하지 않습니다.");
			Kakao.Link.cleanup();
			return;
		}
		
		if (this.expEntr.indexOf(data.entr_no) > -1 && data.entr_no != 1 && data.entr_no != 5) {
			$(this.oButten).attr("href", "javascript:alert(\"죄송합니다.\\n해당 교환권은 문자(MMS)로만 보내실 수 있습니다.\");");
			Kakao.Link.cleanup();
			return;
		} 
				
		var _type	= this.getType(data);
		if (this.isEmpty(_type)) {
			alert("교환권 정보가 존재하지 않습니다.");
			Kakao.Link.cleanup();
			return;
		}
		
		var _msg	= this.getSendMessage(data, _type);
		
		if (this.isApp && this.onlyMmsTf){
			$(this.oButten).attr("href", "javascript:alert(\"죄송합니다.\\n해당 교환권은 문자(MMS)로만 보내실 수 있습니다.\");");
			Kakao.Link.cleanup();
			return;
		}
		
		if (this.isApp === true && this.siteDiv === 'splotte') 
		{	// 웹/앱 분기
			$(this.oButten).attr("href", "javascript:tabletSendKakao();");
		}else {
			$(this.oButten).attr("href", "javascript:closePickType();");

			var exe_url = "http://";
			if (this.siteDiv=='splotte'){
				exe_url += "m.lotte.com/main_smp.do?c=mlotte&smp_yn=Y";
			}else if (this.siteDiv=='ellotte'){
				exe_url += "m.ellotte.com/main.do?c=mlotte";
			}else if (this.siteDiv=='sklotte'){
				exe_url += "m.lotte.com/main.do?c=mlotte";
			}else{
				exe_url += "m.lotte.com/main.do?c=mlotte";
			}
			
			//exe_url = encodeURI(exe_url);
			
			/*if (data.smp_yn == "Y"){
				Kakao.Link.createTalkLinkButton({
					container : this.oButten,
					label : _msg,
					image : {
						src : 'http://www.lotte.com/mail/getEcpnImage.lotte?goods_no='+data.goods_no+'ecpn_no='+data.ecpn_no						
					  , width: '602'
					  , height: '1004' 
					},
					appButton: {
						text: '앱으로 이동',
						execParams: {
							iphone: {executeurl: exe_url},
							ipad: {executeurl: exe_url},
							android: {executeurl: exe_url}
						}
					}
				});
			}else{*/
				Kakao.Link.createTalkLinkButton({
					container : this.oButten,
					label : _msg,
					appButton: {
						text: '앱으로 이동',
						execParams: {
							iphone: {executeurl: exe_url},
							ipad: {executeurl: exe_url},
							android: {executeurl: exe_url}
						}
					}
				});
			//}
		}
		
		return _msg;
	},
	getType : function(data) {
		if (this.objType.TYPE_DEP == data.smp_goods_type) {
			return 'D';			
		}
		else if (this.objType.TYPE_ETC == data.smp_goods_type && data.shop_cnt == '1') {
			return 'E1';
		}
		else if (this.objType.TYPE_ETC == data.smp_goods_type && data.shop_cnt != '1') {
			return 'E2';
		}
		else if (this.objType.TYPE_NOM == data.smp_goods_type) {
			return 'N';
		}
		else {
			return '';
		}
	},
	getSendMessage : function(data, type) {
		var MsgBuilder = function() {
			this.buffer = [];
		}
		MsgBuilder.prototype = {
			append : function(s) {
				this.buffer[this.buffer.length] = s;
				return this;
			},
			toString : function(s) {
				return this.buffer.join(s ? s : '');
			}
		};
		
		var msg = new MsgBuilder();		
		// ellotte_jklee16
		if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
			msg.append("[엘롯데 스마트픽]");
		}else{
			msg.append("[롯데닷컴 스마트픽]");
		}
		msg.append(data.orderer_nm +"님이 보내신 교환권입니다."); // 주문자명
		msg.append("");
		
		msg.append("◆상품 정보◆");
		msg.append("▶ 상품명 : "+ data.goods_nm +"");
		
		if(!this.isEmpty(data.opt_desc) || !this.isEmpty(data.input_opt)){
			if(!this.isEmpty(data.opt_desc) && !this.isEmpty(data.input_opt))
				msg.append("▶ 단품 : "+ data.opt_desc +" / "+ data.input_opt +"");
			else
				msg.append("▶ 단품 : "+ data.opt_desc + data.input_opt +"");
		}
		msg.append("▶ 수량 : "+ data.ord_qty +"개");
		msg.append("▶ 상품가격 : "+ data.ord_amt +"원");
			
		if (type == 'D') {
			msg.append("▶ 사용매장 : "+ data.shop_nm +"");
			msg.append("▶ 픽업예정일 : "+ data.smp_date +"");
			msg.append("▶ 교환권번호 : "+ data.ecpn_no +"");
			if (data.exch_ecpn_no!=""){
				msg.append("다른상품픽 번호 : "+ data.exch_ecpn_no +"");
			}
//			msg.append("주문번호 : "+ data.ord_no +"");
			
			msg.append("");
			//2016-06-07 수정 start (by jdkim33) 			
			msg.append("<유의사항>");
			msg.append("* 상품준비가 완료되면 알림 문자를 드립니다. 확인 후 픽업장소로 방문바랍니다.");
			msg.append("* 매장에서 다른 사이즈 및 컬러로 수령 가능합니다."); //2016-06-07 수정 (by jdkim33)
			msg.append("* 픽업예정일 다음날까지 수령하지 않으면, 주문이 자동으로 취소됩니다.");
			msg.append("* 픽업예정일 변경이 가능합니다. (상품당 1회)");
			if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
				msg.append("  픽업예정일 변경안내 : http://s.ellotte.com/Change");
			}else{
				msg.append("  픽업예정일 변경안내 : http://s.lotte.com/Change");
			}	
			//2016-06-07 수정 end (by jdkim33) 
			msg.append("");
		}
		if (type == 'E1') {
			msg.append("▶ 방문매장 : "+ data.shop_nm +"");
			msg.append("▶ 방문예정일 : "+ data.smp_date +"");
			msg.append("교환권번호 : "+ data.ecpn_no +"");
			if (data.exch_ecpn_no!=""){
			msg.append("다른상품픽 번호 : "+ data.exch_ecpn_no +"");
			}
			msg.append("");
			msg.append("<유의사항>");
			msg.append("- 상품이 준비되면 별도의 알람을 드립니다. 알람을 받은 후 픽업장소로  방문 바랍니다.");
			msg.append("- 픽업예정일 다음날까지 수령하지 않으면 주문이 자동으로 주문취소 됩니다.");
			msg.append("- 매장에서 다른 사이즈 및 컬러로 수령 가능합니다.");
		}
		if (type == 'E2') {
			msg.append("▶ 방문예정일 : "+ data.smp_date +"");
			msg.append("");
			msg.append("주문번호 : "+ data.ord_no +"");
			msg.append("교환권번호 : "+ data.ecpn_no +"");		
			msg.append("");
			msg.append("<유의사항>");
			msg.append("- 유효기간 경과 후에는 일정 금액만큼 환불됩니다.");
		}
		if (type == 'N') {
			msg.append("▶ 사용매장 : "+ data.loc_desc +"");
			if(data.smp_cpn_issu_tp_cd != '02') {
				msg.append("▶ 유효기간 : "+ data.smp_aval_date +"");
			}
			msg.append("");
			msg.append("주문번호 : "+ data.ord_no +"");
			msg.append("교환권번호 : "+ data.ecpn_no +"");	
			msg.append("");
			if (data.rfd_psbl_tgt_yn == 'Y') {
				msg.append("◆환불 안내◆");
				if(data.auto_rfd_tgt_yn = 'Y') {
					msg.append("▶ 환불유형 : 자동환불 상품");
				} else if(data.auto_rfd_tgt_yn = 'N') {
					msg.append("▶ 환불유형 : 수동환불 상품");
				}
				if(data.rfd_tgt_cd = '01') {  //초기 등록 안될때는 노출X?
					msg.append("▶ 환불대상 : 주문자");
				} else if(data.rfd_tgt_cd = '02') {
					msg.append("▶ 환불대상 : 받는분");
				}
				msg.append("▶ 환불조건");
				msg.append("1. 구매일로부터 5년 이내 교환권");
				msg.append("2. 사용하지 않고 유효기간 지난 교환권");
				msg.append("▶ 환불신청 방법");
				
				if(data.rfd_tgt_cd = '01') {
					msg.append("1. 환불대상이 주문자인 경우 환불 자동 신청");
				} else if(data.rfd_tgt_cd = '02') {
					msg.append("1. 환불대상이 받는분인 경우 \"로그인 > 마이롯데 > e쿠폰 환불신청\"에서 쿠폰번호 등록");
				}
				if(data.auto_rfd_tgt_yn = 'Y') {
					msg.append("2. 자동환불 상품 : 유효기간 경과 후 롯데닷컴 ID 내 \"보관금\"으로 자동 환불");
				} else if(data.auto_rfd_tgt_yn = 'N') {
					msg.append("2. 수동환불 상품 : 유효기간 경과 후 고객센터로 문의 주세요. 등록된 쿠폰에 한하여 환불해 드립니다.");
				}
			}
			msg.append("");
			msg.append("▶ 주의사항 및 유의사항은 상품 설명 페이지 > 기본정보에서 확인해주세요.");
		}	
		
		msg.append("");
		if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
			msg.append("▶엘롯데 고객센터 : 1899-2500");
		}else{
			msg.append("▶롯데닷컴 고객센터 : 1577-1110");
		}
		msg.append("단, 주말/공휴일은 1599-8437로 연락바랍니다.");  //2016-06-07 수정 02-6744-5004 -> 1599-8437 (by jdkim33)
		msg.append("▶스마트픽 앱 URL : m.lotte.com/spp.do");
		
		console.log(msg.toString('\n'));
		return msg.toString('\n');
	},
	isEmpty : function(str) {
		return (str == null || str == '' || str == 'undefined');
	}
};
