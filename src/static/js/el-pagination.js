'use strict';

(function ($) {

    // Fix JS String.trim() function is unavailable in IE<9 #45
    if (typeof(String.prototype.trim) === "undefined") {
         String.prototype.trim = function() {
             return String(this).replace(/^\s+|\s+$/g, '');
         };
    }

    $.fn.endlessPaginate = function(options) {
        var defaults = {
            // Twitter-style pagination container selector.
            containerSelector: '.endless_container',
            // Twitter-style pagination loading selector.
            loadingSelector: '.endless_loading',
            // Twitter-style pagination link selector.
            moreSelector: 'a.endless_more',
            // Twitter-style pagination content wrapper selector.
            contentSelector: null,
            // Digg-style pagination page template selector.
            pageSelector: '.endless_page_template',
            // Digg-style pagination link selector.
            pagesSelector: 'a.endless_page_link',
            // Callback called when the user clicks to get another page.
            onClick: function() {},
            // Callback called when the new page is correctly displayed.
            onCompleted: function() {},
            // Set this to true to use the paginate-on-scroll feature.
            paginateOnScroll: false,
            // If paginate-on-scroll is on, this margin will be used.
            paginateOnScrollMargin : 1,
            // If paginate-on-scroll is on, it is possible to define chunks.
            paginateOnScrollChunkSize: 0
			
        },
            settings = $.extend(defaults, options);

        var getContext = function(link) {
            return {
                key: link.data("el-querystring-key").split(' ')[0],
                url: link.attr('href')
            };
        };

        return this.each(function() {
            var element = $(this),
                loadedPages = 1;

            // Twitter-style pagination.
            element.on('click', settings.moreSelector, function() {
                var link = $(this),
                    html_link = link.get(0),
                    content_wrapper = element.find(settings.contentSelector),
                    container = link.closest(settings.containerSelector),
                    detailsContainer = $(settings.contentDetailsSourceSelector), // Added by Navasardyan Edgar
					loading = container.find(settings.loadingSelector);
                // Avoid multiple Ajax calls.
                if (loading.is(':visible')) {
                    return false;
                }
                link.hide();
                loading.show();
                var context = getContext(link);
                // Fire onClick callback.
                if (settings.onClick.apply(html_link, [context]) !== false) {
                    var data = 'querystring_key=' + context.key;
                    // Edited by Navasardyan Edgar
					// FILTER_DATA defined in main.js
					if (FILTER_DATA){
						data += FILTER_DATA
					}
					// Send the Ajax request.
                    $.get(context.url, data, function(response) {
                        // Edited by Navasardyan Edgar
						var fragment = response.object.template;
						
						// Added by Navasardyan Edgar
						var wrapper = container.closest('.endless_page_template');
                        var $fragment = $('<div />',{html:fragment});
						if (wrapper.hasClass('_select-mode')) {
							$fragment.children().addClass('accordion-box__title-box--for-checkbox');
							$fragment.children().find('.checkbox-form').removeClass('dn');
						}
						
						if (wrapper.hasClass('_all-selected')) {
							$fragment.find('.checkbox-form input[type="checkbox"]').prop('checked', true);
						}
						fragment = $fragment.html();
						// Increase the number of loaded pages.
						loadedPages += 1;

                        if (!content_wrapper.length) {
							// Replace pagination container (the default behavior)
							container.before(fragment);
                            container.remove();
							
                        } else {
                            // Insert the content in the specified wrapper and increment link
                            content_wrapper.append(fragment);
                            var nextPage = 'page=' + (loadedPages + 1);
                            link.attr('href', link.attr('href').replace(/page=\d+/, nextPage));
                            link.show();
                            loading.hide();
                        }
						
						
						// Fire onCompleted callback.
                        settings.onCompleted.apply(
                            html_link, [context, fragment.trim()]);
                    }).error(function(xhr, textStatus, error) {
                        // Remove the container left if any
                        container.remove();
						var error_msg = null;
						if (xhr.readyState == 4) {
							// server error
							error_msg = "HTTP error. " + xhr.statusText;
						}
						else if (xhr.readyState == 0) {
							// Network error (i.e. connection refused, access denied due to CORS, etc.)
							error_msg = "Woops :( Network error";
						}
						else {
							error_msg = "Error message from the server";
						}
						alert(error_msg);
					});
                }
                return false;
            });

            // On scroll pagination.
            if (settings.paginateOnScroll) {
                var win = $(window);
                var doc = $(document);
                doc.scroll(function(){
                    if (doc.height() - win.height() -
                        win.scrollTop() <= settings.paginateOnScrollMargin) {
                        // Do not paginate on scroll if chunks are used and
                        // the current chunk is complete.
                        var chunckSize = settings.paginateOnScrollChunkSize;
                        if (!chunckSize || loadedPages % chunckSize) {
                            element.find(settings.moreSelector).click();
                        } else {
                            element.find(settings.moreSelector).addClass('endless_chunk_complete');
                        }
                    }
                });
            }

            // Digg-style pagination.
            element.on('click', settings.pagesSelector, function() {
                var link = $(this),
                    html_link = link.get(0),
                    context = getContext(link);
                // Fire onClick callback.
                if (settings.onClick.apply(html_link, [context]) !== false) {
                    var page_template = link.closest(settings.pageSelector),
                        data = 'querystring_key=' + context.key;
                    // Send the Ajax request.
                    page_template.load(context.url, data, function(fragment) {
                        // Fire onCompleted callback.
                        settings.onCompleted.apply(
                            html_link, [context, fragment.trim()]);
                    });
                }
                return false;
            });
        });
    };

    $.endlessPaginate = function(options) {
        return $('body').endlessPaginate(options);
    };

})(jQuery);