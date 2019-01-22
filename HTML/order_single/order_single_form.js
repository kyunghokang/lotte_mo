function toggleAction (){
	$('.right_cont_area').toggleClass('off');
}
function toggleAction2 (){
	$('.box_agree_check').toggleClass('on');
}
function toggleAction3 (){
	$('.max_discount').toggleClass('on');
	$('.box_section.type4').toggleClass('active');
}
function toggleAction4 (){
	$('.Lpay-help').toggleClass('on');
}
function toggleAction5 (e){
	$('.inlineBorder').removeClass('active');
	$(e).addClass('active');
	$('.clear').addClass('off');
	$('.pay-step').addClass('on');
	//$('.order_product_content').addClass('off');
}
function toggleAction6 (e){
	/* 20180503 네이버페이 추가 간편결제 disable 처리 */
	if($(e).is(".disable")) return ;

	$('.pay_method_area span').removeClass('on');
	$('.pay-inner').removeClass('on');
	$(e).addClass('on');
	var tab_id = $(e).attr('data-tab');
	$("#"+tab_id).addClass('on');
}
function toggleAction7 (e){
	$('.pay-inner .ng-scope').removeClass('active');
	$(e).closest('.ng-scope').addClass('active');
}
function toggleAction8 (e){
	$('.inlineBorder').removeClass('active');
	$('.tab-con').removeClass('active');
	$(e).addClass('active');
	var tab_id = $(e).attr('data-tab2');
	$("#"+tab_id).addClass('active');
}
function toggleAction9 (e){
	$('.pay-inner').removeClass('on');
	$('.tab-con').removeClass('active');
	$(e).addClass('active');
	var tab_id = $(e).attr('data-tab');
	$("#"+tab_id).addClass('active');
}
function toggleAction10(e){
	if($(e).change()){
		$('.apply_box.type2').toggleClass('off')
	};
};
function toggleAction13(){
	setTimeout(toggleAction14, 2000);
};
function toggleAction14(){
	$('.introduce_comment_wrap').hide()
}
(function disappear(){
	setTimeout(function() { $('.introduce_comment_wrap').hide(); }, 5000);
}());

//20181011 수정
function toggleAction15(){
	$("#card_no1").val("");
	$("#card_no2").val("");
	$("#card_no3").val("");
	$("#card_no4").val("");
		var viewLayer = $('#lpoint_cert');
		if (viewLayer.css("display") == "none") {
			viewLayer.show();
			$('#lt_point_amt_btn2').text("취소하기");
		} else  {
			viewLayer.hide();
			fn_useLottePointCancel();
			$('#lt_point_amt_btn2').text("본인 확인하기");
		}
};
function toggleAction16(){
	$('#lpoint_cert').hide();
	$("#lt_point_amt_btn2").text("본인 확인하기");
}
//20181011 수정 END

//20170629수정사항
function toggleAction17(){
	var li_num1 = $('.slide_ul li').size();
	var li_num2 = $('.slide_ul li[style="display:none"]').size();
	var li_num1_width = (li_num1 * 189);
	var li_num2_width = (li_num2 * 189);
	var li_num_total = (li_num1_width - li_num2_width) - 3;
	$('.slide_ul').width(li_num_total);
}
//20170703스탑스크롤
function toggleAction18(){
	$('body').addClass('stop_scroll');
}
function toggleAction19(){
	$('body').removeClass('stop_scroll');
}

//20181011 추가
function toggleAction20(){
	var viewLayer2 = $('#use_member');

	console.log(viewLayer2.css("display"))
	if (viewLayer2.css("display") == "none") {
		viewLayer2.show();
		$('#member_my_btn').text("취소하기");
	} else  {
		viewLayer2.hide();
		$('#member_my_btn').text("본인확인");
	}
};

function toggleAction21(){
	$('#use_member').hide();
	$('#member_my_btn').text("본인확인");
}
//20181011 추가 END

function payScrollView(index){
	// if(index == 0){
	// 	index = pay_index;
	// }
	var windowwidth = $(window).width();
	var windowwidthhalf = windowwidth / 2;
	var outerWidth = 189;
	var outerWidthhalf = outerWidth / 2;
	var halfhalf = windowwidthhalf - outerWidthhalf;
	var leftValue = (outerWidth * (index - 1)) + 8;
	var howleft = leftValue - halfhalf;
	$('.slide').scrollLeft(howleft);
}
// 주문 내역 확인 동의
$(function(){
	$(".box_agree_check .tit_agree_check span").bind("click", function(){
			$(this).parent().toggleClass("show").next().toggle();
	});
});
