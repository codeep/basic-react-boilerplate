'use strict';

(function($) {
    $(document).ready(function(){
        var margin = 20;
        if (typeof endless_on_scroll_margin != 'undefined') {
            margin = endless_on_scroll_margin;
        }
        /*
		$(document).scroll(function(){
            if ($(document).height() - $(window).height() - $(window).scrollTop() <= margin) {
                $("a.endless_more").click();
            }
        });
		*/
		$(".endless_page_template").on( 'scroll', function(){
			if ($(this).height() - $(window).height() - $(window).scrollTop() <= margin) {
                $("a.endless_more").click();
            }
		});
    });
})(jQuery);
