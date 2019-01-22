document.write("<script src='/chat/js/chat.common.js'></script>");
function TalkGateway()
{ 
	this.config = {
	        host : "127.0.0.1",
	        port : "6060"
	};
	
	// Gateway 서버와 연결되었을 경우 호출
    this._connectionEstablished = function()
    {
		//alert("connectionEstablished");
        //parent.setIsGatewayAlive(true); //연결상태를 나타내는 flag값 변경
		
		$("#connectionYn").val('Y');
		//parent.fn_timeCheck();//상담가능체크
    };
 	
 	// Gateway 서버와 연결이 끊어졌을 경우 호출
    this._connectionBroken = function()
    {
		//alert("connectionBroken");
		$("#connectionYn").val('N');
        //parent.setIsGatewayAlive(false);        
    };
 	
 	// 신규 메세지 유무
    this._newMessage = function(talkId)
    {
		//alert("newMessage");
        //parent.doNewMessageByGateway(talkId);
    	if(isAppForTalk2_script > -1 || isAppForTalk_script > -1){ //앱이면
    		if(!getNewMessageBlock){
    			parent.fn_getMessage2();
    		}
    	}else{ //웹이면
    		if (!document.hidden) {
    			parent.fn_getMessage2();
    		}
    	}
    };
    
    // 메세지 입력 상태
    this._inputStatus = function(talkId, serviceType, status)
    {
		//alert("inputStatus");
        //console.log('gateway _inputStatus called');
        //parent.doInputStatusByGateway(talkId, status);
    };
    
    // 티켓 종료 
    this._ticketEnded = function(talkId)
    {
		//alert("ticketEnded");
        //parent.doNewMessageByGateway(talkId);
		//$("#connectionYn").val('N');
		$.gateway.disconnect();
		parent.fn_getMessage2();
    };
    
    //상담사 읽음 
    this._readMessage = function(talkId, serviceType, status)
    {
		//alert("talkId=>" + talkId);
    	
    	//talkId는 정확하게 오나 serviceType에 해당 seq값이 넘어옴 확인해야함
		//alert("serviceType=>" + serviceType);
		//alert("status=>" + status);
		//alert("AgentRead");
        //console.log('gateway _inputStatus called');
        parent.fn_agentRead(talkId , serviceType, status);
    };
    
    
    
    
	
    this._getConfig = function()
    {
    	//var url = $("#getUrl").val();
    	var url = chatUrl;
    	var userId = $("#userNo").val();
    	
        var _self = this;
    	var cmd = {
        	    command : "CommonConfigValue",
        	    domain_id : domain_id,
        	    service_type : "SVTLK",
        	    item_list : "GATEWAY_SERVER_IP,GATEWAY_SERVER_PORT"
        	};
    	$.ajax(
    	{
           // url: "/proxy",
    		url: url,
            type: "POST",
            dataType: "json",
            data:"cmd=" + JSON.stringify(cmd),
            beforeSend : function(response){},
            success: function(responseJson, status, response) {
                if (responseJson.error_code == 0)
                {
                    var result = responseJson.data;
                    var customerId = userId; //로그인한 고객 아이디 설정
                    $(result.config_list).each(function(index, _config) {
                		if(_config.id == 'GATEWAY_SERVER_IP')
            			{
                			_self.config.host = _config.value;
            			}
                		if(_config.id == 'GATEWAY_SERVER_PORT')
            			{
                			_self.config.port = _config.value;
            			}
                	});

                    $.gateway.initCustomer(_self.config, customerId);
                }
                else
                {
                    alert(responseJson.error_code);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {},
            complete :function(response,status) {}    
        });
    };
};

$(document).ready(function() {
	
	
	
});

function loadConnection(){
	if($.talkGateway == undefined){$.talkGateway = new TalkGateway();}
	if($.gateway == undefined){
		$.gateway = new Gateway();
		
		$.gateway.addListener($.gateway.EVENT.NEW_MESSAGE, $.talkGateway._newMessage);
	    $.gateway.addListener($.gateway.EVENT.INPUT_STATUS, $.talkGateway._inputStatus);
	    $.gateway.addListener($.gateway.EVENT.TICKET_ENDED, $.talkGateway._ticketEnded);
	    $.gateway.addListener($.gateway.EVENT.CONNECTION_ESTABLISHED, $.talkGateway._connectionEstablished);
	    $.gateway.addListener($.gateway.EVENT.CONNECTION_BROKEN, $.talkGateway._connectionBroken);
	    
	    $.gateway.addListener($.gateway.EVENT.READ_MESSAGE, $.talkGateway._readMessage); //상담사 읽음여부 추가
	}
	
    $.talkGateway._getConfig();
}