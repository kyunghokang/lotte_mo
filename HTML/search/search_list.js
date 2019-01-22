$(function(){
	$(window).ready(function(){
        initSchSetting();
		
    });
    function initSchSetting(){
        //text length width
        $.fn.textWidth = function(){
            var text = $(this).html();
            $(this).html('<span>'+text+'</span>');
            var width = $(this).find('span:first').width();
            $(this).html(text);
            return width;
        };
		
        resizer();
		// tab category text width 
        function resizer(){
            $('.term .scroll_wrap ul li a').each(function(e){ 
                var $this = $(this);
                var $cnt_width = $this.find('.cnt').outerWidth();
                if(($cnt_width + ($this.textWidth() + 20)) > $this.outerWidth()){
                    //$this.css('padding-right',($cnt_width + 10));
                    $this.find('.cnt').css('right',10);
                }else{
                    $this.css('padding-right','10px');
                    $this.find('.cnt').css('right','auto');
                }
            });
        }
		
        $(window).on('resize',resizer);
        
        schTabClickListener();
        schLayerPop();
    }
    // tab click
    function schTabClickListener(){
        $('.srh_terms_wrap .tab li').unbind('click').bind('click',function(e){
            var $target = $(this);
            var $parent = $(this).parent();
            var $wrap = $('.terms_cont_wrap');
            if($target.hasClass('on')){
                $target.removeClass('on');
                $parent.removeClass('on');
                $wrap.attr('class','terms_cont_wrap');
                $wrap.find('.term').removeClass('on');
                $('.terms_cont_wrap').css('overflow','hidden');
            }else{
                var classTxt=$wrap.find('.term').removeClass('on').eq($target.index()).addClass('on').attr('class').replace(/(term|on|\s)/g,'');
                $wrap.attr('class','terms_cont_wrap').addClass(classTxt+' on');
                $('.srh_terms_wrap .tab li').removeClass('on');
                $target.addClass('on');
                $parent.addClass('on');
                $('.terms_cont_wrap .layerBtn').removeClass('on');
				if($wrap.find('.mallSelect').length>0) $wrap.find('.mallSelect').next('.scroll_wrap').removeClass('on');
            }
            
        });
        $('.mallSelect li').unbind('click').bind('click',function(){
            $(this).parents('.mallSelect').next('.scroll_wrap').addClass('on');
        });
    }
    // layer popup
    function schLayerPop(){
        $('.layerBtn').unbind('click').bind('click',function(e){
            $(this).toggleClass('on');
            $('.terms_cont_wrap.on').css('overflow','visible');
        });
        $('.layerPop .btn_close').unbind('click').bind('click',function(e){
             $('.layerBtn').removeClass('on');
        });
    }
});