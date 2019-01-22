(function($, undefined)
{
    // console 로그
    if (console === undefined || console.log === undefined)
    {
        var console = { log: function() {} };
    } 

    // String 객체에 format 메소드를 추가한다.  
    // "{2}{1}".format("talk", "super") = "supertalk"
    if (!String.prototype.format)
    {
        String.prototype.format = function()
        {
            var formatted = this;
            for (var i = 0; i < arguments.length; i++)
            {
                var regexp = new RegExp('\\{'+i+'\\}', 'gi');
                formatted = formatted.replace(regexp, arguments[i]);
            }
            return formatted;
        };
    }
    
    if (!String.prototype.trim)
    {
        String.prototype.trim = function()
        {     
            return this.replace(/(^\s*)|(\s*$)/gi, "");        
        };
    }

    /*
     * FORM 전송을 한다.
     * 
     * @param method GET/POST  
     */    
    var _submitJson = function(url, jsonParam, method, target)
    {
       var form = $("<form></form>");

       form.attr("method", method ? method : "post");
       form.attr("action", url);
       form.attr("target", target ? target : "_self");
       
       if (method == undefined || method == "get") 
       {
           jsonParam = (jsonParam == undefined) ? {} : jsonParam;
           jsonParam.__dmy = new Date().getTime();
       }
       
       for(var key in jsonParam)
       {
            var attrName = key;
            var attrValue = jsonParam[key];
            
            var input = $("<input></input>");
            input.attr("type", "hidden");
            input.attr("name", attrName);
            input.attr("value", attrValue);
            form.append(input);
       }       

       $('body').append(form);
       form.submit();
    };
    
    /**
     * FORM 내용을 전송을 한다.
     */
    var _submitJsonGet = function(url, jsonParam, target)
    {
        _submitJson(url, jsonParam, "get", target);
    };

    var _errorCode = {
    	    /** ERROR CODE : 성공 */
    	    RETURN_SUCCESS : 0,
    	    /** ERROR CODE : 실패 */
    	    RETURN_FAIL : -1,
    		
    	    /** ERROR CODE : 운영시간이 아님 */
    	    RETURN_NOT_WORKTIME : 1001,
    	    /** ERROR CODE : 최대 대기 상담 수 초과 */
    	    RETURN_MAX_WAIT_CUSTOMER : 1002,
    	    /** ERROR CODE : 고객 개인 별 최대 동시 상담수 초과 */
    	    RETURN_MAX_ACTIVE_CUSTOMER : 1003,
    	    /** ERROR CODE : 상담 인입 차단 설정됨 */
    	    RETURN_TLK_INPUT_COUNSEL_BLOCK_FLAG_Y : 1004,
    	    /** ERROR CODE : 템플릿 사용여부 flag [사용하지 않음]*/
    	    RETURN_DO_NOT_USE_TEMPLATE : 1005,
    	    /** ERROR CODE : 베너 사용여부 flag [사용하지 않음]*/
    	    RETURN_DO_NOT_USE_BANNER : 1006,
    	    /** ERROR CODE : 이용 할 수 없는 서비스*/
    	    RETURN_DO_NOT_SERVICEAVAILABLE : 1007,
    	    /** ERROR CODE : 가용 상담원 없음 */
    	    RETURN_AVAILABLE_ACCOUNT_NOT_EXIST : 1008,
    	    /** ERROR CODE : 상담 인입 차단안함(상담인입안내 메세지 사용) */
    	    RETURN_TLK_INPUT_COUNSEL_BLOCK_FLAG_O : 1009,
    	    
    	    // Common
    	    /** ERROR CODE : 데이타 없음 */
    	    RETURN_FAIL_NODATA : -1001,
    	    /** ERROR CODE : 필수 파라미터 없음 */
    	    RETURN_FIELD_NULL : -1002,
    	    /** ERROR CODE : 허용되지 않은 시스템설정 값 */
    	    RETURN_NONPERMISSION_CONFIG : -1003,
    	    /** ERROR CODE : 허용되지 않은 도메인 환결설정 값 */
    	    RETURN_NONPERMISSION_ENV : -1004,
    	    /** ERROR CODE : 해당 카테고리(리스트) 정보 없음 */
    	    RETURN_CATEGORY_NODATA : -1005,
    	    /** ERROR CODE : 첨부할 수 없는 확장자 */
    	    RETURN_DO_NOT_USE_EXT : -1006,
    	    /** ERROR CODE : 첨부파일 업로드 제한용량 초과 */
    	    RETURN_UPLOAD_MAX_SIZE : -1007,
    	    /** ERROR CODE : 요청된 서브커맨드가 정의되지 않았음 */
    	    RETURN_SUBCOMMAND_NULL : -1008,
    	    /** ERROR CODE : 이미지 파일이 아님 */
    	    RETURN_NO_IMAGE : -1009,
    	    /** ERROR CODE : 파라메터 이상으로 validator에 체크될 때 발생 */
    	    RETURN_NOTVALID_VALUE : -1010,
    	    /** ERROR CODE : 요청된 메시지가 NULL임 */
    	    RETURN_COMMAND_NULL : -1011,
    	    /** ERROR CODE : NODE ID가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_NODE : -1012,
    	    /** ERROR CODE : DOMAIN ID가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_DOMAIN : -1013,
    	    /** ERROR CODE : Parameter가 숫자이어야함 */
    	    RETURN_MUST_NUMBER : -1014,
    	    /** ERROR CODE : Parameter가 YN만 허용됨 */
    	    RETURN_MUST_YN : -1015,
    	    /** ERROR CODE : CHANNEL ID가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_CHANNEL : -1016,
    	    /** ERROR CODE : 해당 도메인에서 지원하지 않는 서비스 */
    	    RETURN_NOT_SUPPORT_DOMAINSERVICE : -1017,
    	    /** ERROR CODE : 해당 노드에서 지원하지 않는 서비스 */
    	    RETURN_NOT_SUPPORT_NODESERVICE : -1018,
    	    /** ERROR CODE : 해당 도메인 하위에 해당 node 없음 or nodeid가 없음 */
    	    RETURN_NODEID_NOT_FOUND : -1019,
    	    /** ERROR CODE : command가 없음 */
    	    RETURN_COMMAND_NOT_FOUND : -1020,
    	    /** ERROR CODE : CODESET ID가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_CODESET : -1021,
    	    /** ERROR CODE : SORT_ORDER 가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_SORTORDER : -1022,
    	    /** ERROR CODE : SURVEY_TYPE 가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_SURVEYTYPE : -1023,
    	    /** ERROR CODE : 설문 가능한 상태 아님 */
    	    RETURN_NOT_AVAILABLE_STATUS : -1024,
    	    /** ERROR CODE : FAQ 설문이 이미 반영됨 */
    	    RETURN_ALREADY_INSERT_SURVEY : -1025,
    	    
    	    // Talk
    	    /** ERROR CODE : 채팅종료 */
    	    RETURN_CHAT_END : -2001,
    	    /** ERROR CODE : 채팅메세지가 더 있음 */
    	    RETURN_CHAT_MORE_MESSAGE : -2002,
    	    /** ERROR CODE : 고객삭제 */
    	    RETURN_CHAT_CUSTOMER_DELETE : -2003,
    	    /** ERROR CODE : 상담원 삭제 */
    	    RETURN_CHAT_AGENT_DELETE : -2004,
    	    /** ERROR CODE : 메세지 순번 중복 */
    	    RETURN_CHAT_DUP_SEQUENCE : -2005,
    	    /** ERROR CODE : ticket_status가 유효하지 않음 */
    	    RETURN_INVALID_STATUS : -2006,
    	    /** ERROR CODE : 만료 티켓 */
    	    RETURN_TICKET_EXPIRED : -2007,
    	    /** ERROR CODE : 소유자가 아님 */
    	    RETURN_NOT_OWNER : -2008,
    	    /** ERROR CODE : 상담내역 정보 없음 */
    	    RETURN_MYTALK_NODATA : -2009,
    	    /** ERROR CODE : 최대 대기 상담수 - 공통,서비스별 설정 오류 */
    	    RETURN_MAX_WAIT_CUSTOMER_SERVICETYPE : -2010,
    	    /** ERROR CODE : 최대 대기 상담수 - 서비스별 MaxCount 설정오류*/
    	    RETURN_MAX_WAIT_CUSTOMER_SERVICECOUNT : -2011,
    	    /** ERROR CODE : 고객 개인 별 최대 동시 상담수 - 공통,서비스별 설정 오류 */
    	    RETURN_MAX_ACTIVE_CUSTOMER_SERVICETYPE : -2012,
    	    /** ERROR CODE : 고객 개인 별 최대 동시 상담수 - 서비스별 MaxCount 설정오류*/
    	    RETURN_MAX_ACTIVE_CUSTOMER_SERVICECOUNT : -2013,
    	    /** ERROR CODE : 해당되는 티켓 없음 */
    	    RETURN_NO_TICKET : -2014,
    	    /** ERROR CODE : 비회원은 종료된 상담에 접근할 수 없음 */
    	    RETURN_END_TICKET : -2015,
    	    
    	    // FAQ
    	    /** ERROR CODE : FAQ 검색어 예시구문 없음 */
    	    RETURN_FAQ_SEARCH_QUESTION_SAMPLE_NULL : -4001,
    	    /** ERROR CODE : FAQ 리스트 조회 시 문제 발생. */
    	    RETURN_FAQLIST_NULL : -4002,
    	    /** ERROR CODE : FAQ 상세내역 조회 시 문제 발생. */
    	    RETURN_FAQDETAILVIEW_NULL : -4003,
    	    /** ERROR CODE : 신규 FAQ 리스트 조회 시 문제 발생. */
    	    RETURN_FAQNEWLIST_NULL : -4004,
    	    /** ERROR CODE : FAQ 검색 리스트 조회 시 문제 발생. */
    	    RETURN_FAQSEARCHLIST_NULL : -4005,
    	    /** ERROR CODE : FAQ TOP KEYWORD 조회 시 문제 발생. */
    	    RETURN_FAQTOPKEYWORDLIST_NULL : -4006,
    	    /** ERROR CODE : TOP FAQ 리스트 조회 시 문제 발생. */
    	    RETURN_FAQTOPLIST_NULL : -4007,
    	    /** ERROR CODE : FAQ 리스트 갯수 조회 시 문제 발생. */
    	    RETURN_FAQLISTCOUNT_NULL : -4008,
    	    /** ERROR CODE : FAQ 페이지 번호 조회 시 문제 발생. */
    	    RETURN_FAQPAGENO_NULL : -4009,
    	    /** ERROR CODE : 이전, 다음FAQ 조회 시 문제 발생. */
    	    RETURN_FAQPREVNEXT_NULL : -4010,
    	    /** ERROR CODE : 상담지식 유효기간 만료 */
    	    RETURN_END_VALID_TERM_DATE : -4012,
    	    /** ERROR CODE : KB ID가 형식에 맞지 않음 */
    	    RETURN_NOT_MATCH_TYPE_KB : -4013,
    	    /** ERROR CODE : FAQ 등록할 설문이 없습니다 */
    	    RETURN_NO_FAQ_SURVEY : -4014,
    	    
    	    // license
    	    /** ERROR CODE : 허용되지 않은 도메인 ID */
    	    RETURN_NONPERMISSION_DOMAIN : -8001,
    	    /** ERROR CODE : 허용되지 않은 IP */
    	    RETURN_NONPERMISSION_IP : -8002,
    	    /** ERROR CODE : 허용되지 않은 Service */
    	    RETURN_NONPERMISSION_SERVICE : -8003,
    	    /** ERROR CODE : Proxy 인증실패 */
    	    RETURN_PROXY_FAIL_AUTH: -8004,
    	    /** ERROR CODE : Proxy 인증파일 찾을수 없음 */
    	    RETURN_LICENSE_NOTFOUND: -8005,
    	    /** ERROR CODE : Proxy 인증파일의 유효 자리수 */
    	    RETURN_LICENSE_LENGTH: -8006,
    	    /** ERROR CODE : Proxy 개발 라이선스 만료 */
    	    RETURN_LICENSE_EXP_DATE: -8007
    };
    
    function _errorMessage(errorCode, serverErrorMessage)
    {
        var errorMessage = serverErrorMessage;
        
        switch (errorCode)
        {
            // 서버 에러 메세지를 그대로 사용하는 코드 (템플릿 메시지 리턴 코드)
            case $.common.errorCode.RETURN_TLK_INPUT_COUNSEL_BLOCK_FLAG :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string001;
                }
                break;
            case $.common.errorCode.RETURN_TLK_INPUT_COUNSEL_BLOCK_FLAG_Y :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string001;
                }
                break;
            case $.common.errorCode.RETURN_NOT_WORKTIME :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string002;
                }
                break;
            case $.common.errorCode.RETURN_MAX_WAIT_CUSTOMER :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string001;
                }
                break;
            case $.common.errorCode.RETURN_MAX_ACTIVE_CUSTOMER :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string003;
                }
                break;
            case $.common.errorCode.RETURN_TLK_INPUT_COUNSEL_BLOCK_FLAG_O :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string004;
                }
                break;
            case $.common.errorCode.RETURN_NOT_SUPPORT_NODESERVICE :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = lang.ee.error.string005;
                }
                break;
            case $.common.errorCode.RETURN_NO_FAQ_SURVEY :
                if (serverErrorMessage == undefined || serverErrorMessage == '')
                {
                    errorMessage = "";
                }
                break;
            
            case $.common.errorCode.RETURN_CHAT_DUP_SEQUENCE :
                errorMessage = lang.ee.error.string006;
                break;
            case $.common.errorCode.RETURN_INVALID_STATUS :
                errorMessage = lang.ee.error.string007;
                break;
            case $.common.errorCode.RETURN_NOT_OWNER :
                errorMessage = lang.ee.error.string008;
                break;
            case $.common.errorCode.RETURN_ALREADY_INSERT_SURVEY :
                errorMessage = lang.ee.error.string009;
                break;
            default :
                errorMessage = lang.ee.error.string010;
                break;
        }
        
        errorMessage = errorMessage + "(" + errorCode + ")";
        return errorMessage; 
    };
    
    //var reAnchor = new RegExp("([a-zA-Z0-9]+)://([a-z0-9.\\-&%=?:@#+~\\_/]+)", "gi");
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    
    function _anchorHtmlLinkTarget(html, target) 
    {
        html = html.replace(/<br\s*[\/]?>/gim, ' <br>'); // www.naver.com<br> 인 경우 문자열을 못짤라서 오류가 발생
        html = html.replace(replacePattern1, '<a href="$1" target="_blank" class="text-decoration-underline">$1</a>');
        html = html.replace(replacePattern2, '$1<a href="http://$2" target="_blank" class="text-decoration-underline">$2</a>');
        return html;
        //return html.replace(reAnchor, "<a href='http://$2' target='" + (target ? target : "_blank") + "'>http://$2</a>");
    }
    
    
    /**
     * 쿠키값을 얻는다.
     */
    function _getCookieVal(offset)
    {
        var endstr = document.cookie.indexOf (";", offset);  

        if (endstr == -1)
        endstr = document.cookie.length;  
        return unescape(document.cookie.substring(offset, endstr));
    }

    /**
     * 쿠키값을 얻는다.
     */
    function _getCookie(name) {
        var arg = name + "=";  
        var alen = arg.length;  
        var clen = document.cookie.length;  
        var i = 0;  
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return _getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }  
        return null;
    }

    /**
     * 쿠키값을 셋팅한다.
     */
    function _setCookie(name, value)
    {
        document.cookie = name + "=" + escape (value) + "; path=/";
    }    
    
    function _delCookie(name)
    {
      var expireDate = new Date();
      expireDate.setDate( expireDate.getDate() - 1 );
      document.cookie = name + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
    }
    
    /**
     * 해당 URL을 팝업으로 띄운다.
     */
    function _openImageViewer(url)
    {
        window.open(url, 'imgViewer', 'width=500, height=100, toolbar=no, menubar=no, status=no, scrollbars=yes');
    }
    
    /**
     * 파일의 확장자가 이미지 확장자 인지 검사한다.
     */
    function _isImageFile(fileName)
    {
        var ext = fileName.slice(fileName.indexOf(".") + 1).toLowerCase();            
        return ("jpg jpeg gif bmp png".indexOf(ext) > -1);
    }
    
    /**
     * XSS 공격 방지에 대한 문자 변환을 한다.
     */
    function _getEscapeXSS(inputText)
    {
        var targetText = inputText;
        if (targetText != '' ) 
        {
            var source = new Array ("&", "<", ">", "\"", "'", "/", "(", ")", "%", "-");
            var target = new Array ("&amp;","&lt;","&gt;","&quot;","&#39;","&#47;","&#40;","&#41;","&#37;","&#45;");
            
            for(var i = 0; i < source.length; i++)
            {
                targetText = targetText.replace(source[i], target[i]);
            }
        }
        return targetText;
    }
    
    /**
     * XSS 공격 방지를 위해 변환된 문자를 원본 문자로 복원한다.
     */
    function _getUnescapeXSS(inputText) 
    {
        var plainText = inputText;
        if (plainText != '')
        {
            var source = new Array ("&amp;","&lt;","&gt;","&quot;","&#39;","&#47;","&#40;","&#41;","&#37;","&#45;");
            var target = new Array ("&", "<", ">", "\"", "'", "/", "(", ")", "%", "-");
            
            for(var  i = 0; i < source.length; i++)
            {
                if(plainText.indexOf(source[i]) > -1)
                {
                    plainText = plainText.replace(source[i], target[i]);
                }
            }
        }
        return plainText;
    }

    $.common = {};
    $.common.errorCode = _errorCode;
    $.common.errorMessage = _errorMessage;
    $.common.submitJson = _submitJson;
    $.common.submitJsonGet = _submitJsonGet;
    $.common.anchorHtmlLinkTarget = _anchorHtmlLinkTarget;
    $.common.delCookie = _delCookie;
    $.common.getCookie = _getCookie;
    $.common.setCookie = _setCookie;
    $.common.openImageViewer = _openImageViewer;
    $.common.isImageFile = _isImageFile;
    $.common.getEscapeXSS = _getEscapeXSS;
    $.common.getUnescapeXSS = _getUnescapeXSS;
})(jQuery);
