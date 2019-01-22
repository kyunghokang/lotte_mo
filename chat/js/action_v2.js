document.write("<script src='/chat/js/chat.common_v2.js'></script>");
var url = chatUrl;


/* ******************************************
시스템 설정정보 조회 (확인용)
******************************************* */
function fn_getConfigValue(){
	
	var mForm = document.frm; 
	var obj = new Object(); 
	
	command = "CommonConfigValue";

	obj.command = command; 
	obj.domain_id = domain_id;
	obj.service_type = service_type;
	obj.item_list = "GATEWAY_SERVER_IP,GATEWAY_SERVER_PORT,FILE_ICON_LIST";
	 
	var cmd = JSON.stringify(obj); 
	mForm.cmd2.value = cmd;
	
	var param = "cmd=" + cmd;
	 
	var result_list = "";

	var request = $.ajax({
	 url:url,
	 type:"POST",
	 data: param,
	 dataType:"json"
	});
	
	request.done(function(result){ 
	 if (result != null){
		 
	  if (result.error_code == 0) { 
		
		  var data_message = new Object();
			data_message = result.data;
		
		  var config_list = [];
		      config_list = data_message.config_list;
		      
		  var id = "";
		  var value = "";
		  
		  for(var i=0; i < config_list.length; i++){
			  
			  id = config_list[i].id;
			  value = config_list[i].value;
			  
			 //alert( "id : " + id + " value : " + value);
		  }    
		  
	  }else{ 
	   	//존재하는 데이터 없음
	  }
	  
	 }
	});
	request.fail(function(jqXHR, textStatus){ // 에러 발생
		alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
	});	

}




/* ******************************************
상담지식 조회
******************************************* */
function fn_getBContents(kbId){
	
	var mForm = document.frm; 
	var obj = new Object(); 
	
	command = "TalkKBContents";

	obj.command = command; 
	obj.domain_id = domain_id;
	obj.service_type = service_type;
	obj.kb_id = kbId;
	 
	var cmd = JSON.stringify(obj); 
	mForm.cmd2.value = cmd;
	 
	var param = "cmd=" + cmd;
	 
	var result_list = "";
	var message = "";
	var title = "";
	var attach_count = "";
	var kb_id = "";
	var kb_contents = "";
	

	$.ajax({
	 url: url,
	 type:"POST",
	 data: param,
	 dataType:"json",
	 success : function(result) {
		 if (result != null){
			 
			  if (result.error_code == 0) { 
				
				  var data_message = new Object();
					  data_message = result.data;
				
				  message = data_message.message;
				  title = data_message.title;
				  attach_count = data_message.attach_count;
				  kb_id = data_message.kb_id;
				  kb_contents = data_message.kb_contents;
				  
				  /*
				  if(attach_count > 0){
					  var attach_info = new Object();
					  	  attach_info = data_message.attach_info;
					  	  
					  var attachName = attach_info.attachName;
					  var attachPath = attach_info.attachPath;
					  var attachExt  = attach_info.attachExt;
					  var fileInfo   = attach_info.fileInfo;
					  var attachName = attach_info.attachName;
				  } */
				    
			  }else{ 
			   	//존재하는 데이터 없음
			  }
			  
			 }
	 },
		error : function(request, status, error) {
			//alert("에러발생");
 		}, 
 		complete : function(request, status) {
 			 //$("#kb_title").val(title);
			 //$("#kb_attach_count").val(attach_count);
 		}
	});
	
	return true;
}





/* ******************************************
설문리스트 조회 (만족도 조회)
******************************************* */
function fn_getSuerveyList(){
	
	var mForm = document.frm; 
	var obj = new Object(); 
	
	command = "CommonSurveyList";

	obj.command = command; 
	obj.domain_id = domain_id;
	obj.service_type = service_type;
	obj.target_id =  $("#getTalkId").val();
	//obj.target_id =  "TCKT0000000041";
	obj.node_id = node_id;
	obj.survey_type = "CUSAF";
	 
	var cmd = JSON.stringify(obj); 
	mForm.cmd2.value = cmd;
	
	var param = "cmd=" + cmd;
	 
	var result_list = "";

	$("#surveyContents").text("");
	
	var request = $.ajax({
	 url:url,
	 type:"POST",
	 data: param,
	 dataType:"json"
	});
	
	request.done(function(result){ 
	 if (result != null){
		 
	  if (result.error_code == 0) { 
		
		  var data_message = new Object();
			  data_message = result.data;
			
		  var survey_list = [];
		      survey_list = data_message.survey_list;
		  
		  var codeset_id = "";
	      var answer_type = "";
		  var question_title = "";
		  var description = "";
		  var target_field = "";
		      
		  for(var i=0 ; i < survey_list.length; i++){    
		      
		     codeset_id = survey_list[i].codeset_id;
		     answer_type = survey_list[i].answer_type;
		     question_title = survey_list[i].question_title;
		     description = survey_list[i].description;
		     target_field = survey_list[i].target_field;
		     
		     if(target_field == "feedback"){ //feedback인것이 만족도..
		    	 fn_getSuerveyContents(codeset_id , answer_type , question_title);
		     }
		  }    
		  
		  
	  }else{ 
	   	//존재하는 데이터 없음
	  }
	  
	 }
	});
	request.fail(function(jqXHR, textStatus){ // 에러 발생
		alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
	});	
}



/* ******************************************
설문 내용 조회(만족도)
******************************************* */
function fn_getSuerveyContents(codeset_id , answer_type, question_title){
 
	var mForm = document.frm; 
	var obj = new Object(); 
	
	command = "CommonCodeList";

	obj.command = command; 
	obj.domain_id = domain_id;
	obj.service_type = service_type;
	obj.codeset_id =  codeset_id;

	var cmd = JSON.stringify(obj); 
	mForm.cmd2.value = cmd;
	
	var param = "cmd=" + cmd;
	 
	var result_list = "";

	$("#satisfaction_pop_inner").html("");
	
	var request = $.ajax({
	 url:url,
	 type:"POST",
	 data: param,
	 dataType:"json"
	});
	
	request.done(function(result){ 
	 if (result != null){
	  if (result.error_code == 0) { 
		
		  var data_message = new Object();
			  data_message = result.data;
			
		  var code_list = [];
		  	  code_list = data_message.code_list;
		      
		  var codeset_id = "";
		  var sort_order = "";
		  var code_id = "";
		  var depth = "";
		  var parent_id = "";
		  var report_code = "";
		  var code_name = "";  
		  var code_value = "";
		  
		  //result_list += "=====" + question_title + "=====<br>";
		  
		   for(var j=0; j < code_list.length; j++){    
			  for(var i=0; i < code_list.length; i++){
				  
				  sort_order = code_list[i].sort_order;
				  code_id = code_list[i].code_id;
				  depth = code_list[i].depth;
				  parent_id = code_list[i].parent_id;
				  report_code = code_list[i].report_code;
				  code_name = code_list[i].code_name;
				  code_value = code_list[i].code_value;
				  
				  //CLOUD20151019
				  if(j == 0 && sort_order == 1){
					  result_list += "<a href=\"#\" class=\"on\">"+ code_value +"</a>";
					  //값 초기화
					  $("#surveyScore").val(code_value);
				  }else if(sort_order == j+1 ){
					  result_list += "<a href=\"#\">"+ code_value +"</a>";
				  }
			  }    
		  }
		  
		  $("#satisfaction_pop_inner").append(result_list);
		  
		  //CLOUD20151019 설문조사 DIV 노출
		  $("#cover, .satisfaction_pop").show();
		  
	  }else{ 
	   	//존재하는 데이터 없음
	  }
	  
	 }
	});
	request.fail(function(jqXHR, textStatus){ // 에러 발생
		alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
	});	
}


/* ******************************************
설문(만족도) 답변 등록 취소
******************************************* */
function fn_cancelSurvey(){
	$("#inputMessage").val("");
	var target = $("#satisfaction_pop_inner").find( "a" );
	target.removeClass( "on" );
	
	$("#surveyContents").text("");
	$("#surveyContents").attr("style" ,"display:none");
	
	$("#selectValue").val("0");
}

/* ******************************************
설문(만족도) 답변 등록
******************************************* */
function fn_bfInsertSurvey(chatDiv){
	if($("#selectValue").val() == "0" || $("#selectValue").val() == ""){
		alert("별점을 선택해 주세요.");
		return;
	}
	
	if (chatDiv=="ROP"){// 상품추천톡
		var mForm = document.frm;
		var obj = new Object();
		obj.command = "CommonSurveyExist"; 
		obj.domain_id = domain_id;
		obj.service_type = service_type;
		obj.survey_type =  "CUSAF";
		obj.target_id =  $("#historyRTalkId").val();
		
		var cmd = JSON.stringify(obj); 
		mForm.cmd2.value = cmd;
		
		var param = "cmd=" + cmd;
		 
		var result_list = "";
		
		var request = $.ajax({
		 url:url,
		 type:"POST",
		 data: param,
		 dataType:"json"
		});
		
		request.done(function(result){ 

		 if (result != null){
		  if (result.error_code == 0) {
			  if (result.data.survey_count < 1){
				  fn_insertSurvey(chatDiv);
			  }else{
				  alert('이미 점수를 매겨주셨습니다.');
				  return;
			  }
		  }else if (result.error_code == -1024){ 
			  fn_insertSurvey(chatDiv);
		  }
		 }
		});
		request.fail(function(jqXHR, textStatus){ // 에러 발생
			alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
		});	
	}else{
		if($("#inputMessage").val().length > 500){
			alert("상담후기는 최대 500자까지 입력해주세요.");
			return;
		}
		
		fn_insertSurvey(chatDiv);
	}
}

/* ******************************************
설문(만족도) 답변 등록
******************************************* */
function fn_insertSurvey(chatDiv){
	var mForm = document.frm; 
	var obj = new Object(); 
	
	command = "CommonInsertSurvey";
	
	obj.command = command; 
	obj.domain_id = domain_id;
	obj.service_type = service_type;
	obj.survey_type =  "CUSAF";
	obj.target_id =  $("#historyRTalkId").val();
	//obj.target_id =  "TCKT0000000041";
	obj.feedback =  $("#selectValue").val();
	obj.option01 = encodeURIComponent($("#inputMessage").val()); 
	//obj.option01 =  "Y";
    //alert($("#getTalkId").val());
	var cmd = JSON.stringify(obj); 
	mForm.cmd2.value = cmd;
	
	var param = "cmd=" + cmd;
	 
	var result_list = "";
	
	var rTalkIds = $("#rTalkIds").val();
	
	var request = $.ajax({
	 url:url,
	 type:"POST",
	 data: param,
	 dataType:"json"
	});
	
	request.done(function(result){ 

	 if (result != null){
	  if (result.error_code == 0) { 
		  rTalkIds += ","+$("#historyRTalkId").val();
		  $("#rTalkIds").val(rTalkIds);
		  if (chatDiv=="ROP"){ // 상품추천
			  alert('감사합니다! 깨알상품 추천으로 보답하겠습니다.');
		  }else{ // 톡상담
			  alert('고객님의 소중한 의견에 감사드립니다.');
		  }
		  $("#cover, .layer_pop").hide();
		  fn_cancelSurvey();
	  }else{ 
		  if (chatDiv=="ROP"){ // 상품추천
			  alert('이미 점수를 매겨주셨습니다.');
		  }else{ // 톡상담
			  alert('이미 등록하셨습니다.');
		  }
		  $("#cover, .layer_pop").hide();
		  fn_cancelSurvey();
	  }
	 }
	});
	request.fail(function(jqXHR, textStatus){ // 에러 발생
		alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
	});	
}


/* ******************************************
설문(만족도) 답변여부 조회
******************************************* */
function fn_getSurveyExist(){

	var mForm = document.frm; 
	var obj = new Object(); 
	
	command = "CommonInsertSurvey";
	//subcommand = "getTicketByCustomerId";

	obj.command = command; 
	obj.domain_id = domain_id;
	obj.service_type = service_type;
	obj.survey_type =  "CUSAF";
	//obj.target_id =  $("#getTalkId").val();
	obj.target_id =  "TCKT0000000041";

	var cmd = JSON.stringify(obj); 
	mForm.cmd2.value = cmd;
	
	var param = "cmd=" + cmd;
	 
	var result_list = "";
	
	var request = $.ajax({
	 url:url,
	 type:"POST",
	 data: param,
	 dataType:"json"
	});
	
	request.done(function(result){ 
		
	 if (result != null){
	  if (result.error_code == 0) { 
		  
		  var data_message = new Object();
		  	  data_message = result.data;
		
	      var survey_count = data_message.survey_count;
	      
	      	  //alert(survey_count);
	    	  //alert('답변한 설문지 수=>' + survey_count);
	      
		  $("#surveyContents").text("");
		  $("#surveyContents").attr("style" ,"display:none");
		  
	  }else{ 

		  alert('이미 등록하셨습니다.');
	  }
	  
	 }
	});
	request.fail(function(jqXHR, textStatus){ // 에러 발생
		alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
	});	
}



/* ******************************************
상담가능 체크 (상담신청 전)
******************************************* */
function fn_timeCheck2(){
if($("#sendBtn").html() == "상담<br/>신청" || $("#sendBtn").html() == "상담<br>신청"){
var mForm = document.frm; 
var obj = new Object(); 

command = "TalkMultiCheck";
subcommand = "isWorkTime,isBlockStatus,isReceiptOutoftimeFlag,isServiceAvailable,isValidUser";

obj.command = command; 
obj.domain_id = domain_id;
obj.service_type = service_type;
obj.node_id = node_id;
obj.subcommand = subcommand;
obj.in_channel_id = in_channel_id;
obj.customer_id = customer_id;

var cmd = JSON.stringify(obj); 

mForm.cmd2.value = cmd;

var param = "cmd=" + cmd;

var result_list = "";

var request = $.ajax({
url: url ,
type:"POST",
data: param,
dataType:"json",
success : function(result) { 
	if (result != null){

		if (result.error_code == 0) {
			var data_message = new Object();
				data_message = result.data;
				
			var isBlockStatus = new Object();
			    isBlockStatus = data_message.isBlockStatus;
			
			var isBlockStatus_yn = "";
			
			//상담원 인입차단여부
			if(isBlockStatus.error_code == 0){
				isBlockStatus_yn = "N";
			}else{
				isBlockStatus_yn = "Y";
			}
			
			var isWorkTime = new Object();
				isWorkTime = data_message.isWorkTime;
			
			var isWorkTime_data = new Object();
				isWorkTime_data = isWorkTime.data;
		   
			var is_work_time = "";
			
			//상담가능시간 체크
			if(isWorkTime_data.is_work_time){
				is_work_time = "Y";
			}else{
				is_work_time = "N";
			}
			
			
			//관심고객 등록여부	
			var isCheckUser = new Object();
			isCheckUser = data_message.isValidUser;
			var checkUserYn = "";
	
			if(isCheckUser.error_code != 0){
				//관심고객일 경우 에러코드가 0이 아님
				checkUserYn = 'Y';
			}else{
				checkUserYn = 'N';
			}
			
			
			
			 if (is_work_time == "Y"){
				 
				 //상담가능
				 if (isBlockStatus_yn == 'N' && checkUserYn == 'N') {
					 
					 fn_send(); //상담시작 
				 
				 }
				 //상담사 인입차단
				 if(isBlockStatus_yn == 'Y'){
					 if(confirm('지금은 상담원과 연결이 불가능합니다.\n문의사항은 1:1문의하기로 접수해주시기 바랍니다.\n1:1문의하기로 이동하시겠습니까?')){
						 window.location = $("#defaultD").val() +"/custcenter/m/question.do?"+ $("#commonP").val() +"&tclick="+ $("#tclick_my_s5").val();
					 }
					 return;
				 }
				 
				//관심고객
				 if(checkUserYn == 'Y'){
					 if(confirm('잠시 상담원과 연결이 불가능합니다.\n문의사항은 1:1문의하기로 접수해주시기 바랍니다.\n1:1문의하기로 이동하시겠습니까?')){
						 window.location = $("#defaultD").val() +"/custcenter/m/question.do?"+ $("#commonP").val() +"&tclick="+ $("#tclick_my_s5").val();
					 }
					 return;
				 }
				 
			 }else if(is_work_time == "N"){
				 if(confirm('지금은 채팅상담 운영시간이 아닙니다.\n문의사항은 1:1문의하기로 접수해주시기 바랍니다.\n1:1문의하기로 이동하시겠습니까?')){
					 window.location = $("#defaultD").val() +"/custcenter/m/question.do?"+ $("#commonP").val() +"&tclick="+ $("#tclick_my_s5").val();
				 }
				 return;
				 
			 }
		}else if(result.error_code == -49999){  //20151117_비로그인 처리 추가
			fn_goLogin();
	    }else{

	    }	 
	}
},error : function(request, status, error) {
		
	//alert('오류가 발생하였습니다.');
}, 
complete : function(request, status) {
	
	

	
}
	
	
});

}else{
	fn_send();
}

}




/* ******************************************
상담사 정보 조회
******************************************* */
function fn_AgentName(){

var mForm = document.frm; 
var obj = new Object(); 

command = "CommonAccountInfo";

obj.command = command; 
obj.domain_id = domain_id;
obj.node_id = node_id;
obj.service_type = "SVTLK";
obj.target_id = $("#getTalkId").val();

var cmd = JSON.stringify(obj); 

mForm.cmd2.value = cmd;

var param = "cmd=" + cmd;

var result_list = "";

var request = $.ajax({
url: url ,
type:"POST",
data: param,
dataType:"json"
});

request.done(function(result){ 
if (result != null){
	
	if(result.error_code == 0){
	
		var data_message = new Object();
			data_message = result.data;
			
		//상담원 이름
		var account_name = data_message.account_name;
		
		$("#agentName").val(account_name);
	}

 
}
});
request.fail(function(jqXHR, textStatus){ // 에러 발생
	alert("서비스 연결이 원활하지 않습니다.\r잠시후 다시 이용해 주세요.");
});
}



